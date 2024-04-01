//! Wasm bindings for `kcl`.

use std::{
    str::FromStr,
    sync::{Arc, RwLock},
};

use futures::stream::TryStreamExt;
use gloo_utils::format::JsValueSerdeExt;
use kcl_lib::engine::EngineManager;
use tower_lsp::{LspService, Server};
use wasm_bindgen::prelude::*;

// wasm_bindgen wrapper for execute
#[wasm_bindgen]
pub async fn execute_wasm(
    program_str: &str,
    memory_str: &str,
    units: &str,
    engine_manager: kcl_lib::engine::conn_wasm::EngineCommandManager,
    fs_manager: kcl_lib::fs::wasm::FileSystemManager,
    is_mock: bool,
) -> Result<JsValue, String> {
    console_error_panic_hook::set_once();
    // deserialize the ast from a stringified json

    use kcl_lib::executor::ExecutorContext;
    let program: kcl_lib::ast::types::Program = serde_json::from_str(program_str).map_err(|e| e.to_string())?;
    let mut mem: kcl_lib::executor::ProgramMemory = serde_json::from_str(memory_str).map_err(|e| e.to_string())?;
    let units = kittycad::types::UnitLength::from_str(units).map_err(|e| e.to_string())?;

    let engine = kcl_lib::engine::conn_wasm::EngineConnection::new(engine_manager)
        .await
        .map_err(|e| format!("{:?}", e))?;
    let fs = kcl_lib::fs::FileManager::new(fs_manager);
    let ctx = ExecutorContext {
        engine: Arc::new(Box::new(engine)),
        fs,
        stdlib: std::sync::Arc::new(kcl_lib::std::StdLib::new()),
        units,
        is_mock,
    };

    let memory = kcl_lib::executor::execute(program, &mut mem, kcl_lib::executor::BodyType::Root, &ctx)
        .await
        .map_err(String::from)?;
    // The serde-wasm-bindgen does not work here because of weird HashMap issues so we use the
    // gloo-serialize crate instead.
    JsValue::from_serde(&memory).map_err(|e| e.to_string())
}

// wasm_bindgen wrapper for execute
#[wasm_bindgen]
pub async fn modify_ast_for_sketch_wasm(
    manager: kcl_lib::engine::conn_wasm::EngineCommandManager,
    program_str: &str,
    sketch_name: &str,
    plane_type: &str,
    sketch_id: &str,
) -> Result<JsValue, String> {
    console_error_panic_hook::set_once();

    // deserialize the ast from a stringified json
    let mut program: kcl_lib::ast::types::Program = serde_json::from_str(program_str).map_err(|e| e.to_string())?;

    let plane: kcl_lib::executor::PlaneType = serde_json::from_str(plane_type).map_err(|e| e.to_string())?;

    let engine: Arc<Box<dyn EngineManager>> = Arc::new(Box::new(
        kcl_lib::engine::conn_wasm::EngineConnection::new(manager)
            .await
            .map_err(|e| format!("{:?}", e))?,
    ));

    let _ = kcl_lib::ast::modify::modify_ast_for_sketch(
        &engine,
        &mut program,
        sketch_name,
        plane,
        uuid::Uuid::parse_str(sketch_id).map_err(|e| e.to_string())?,
    )
    .await
    .map_err(String::from)?;

    // The serde-wasm-bindgen does not work here because of weird HashMap issues so we use the
    // gloo-serialize crate instead.
    JsValue::from_serde(&program).map_err(|e| e.to_string())
}

#[wasm_bindgen]
pub fn deserialize_files(data: &[u8]) -> Result<JsValue, JsError> {
    console_error_panic_hook::set_once();

    let ws_resp: kittycad::types::WebSocketResponse = bson::from_slice(data)?;

    if let Some(success) = ws_resp.success {
        if !success {
            return Err(JsError::new(&format!("Server returned error: {:?}", ws_resp.errors)));
        }
    }

    if let Some(kittycad::types::OkWebSocketResponseData::Export { files }) = ws_resp.resp {
        return Ok(JsValue::from_serde(&files)?);
    }

    Err(JsError::new(&format!("Invalid response type, got: {:?}", ws_resp)))
}

// wasm_bindgen wrapper for lexer
// test for this function and by extension lexer are done in javascript land src/lang/tokeniser.test.ts
#[wasm_bindgen]
pub fn lexer_wasm(js: &str) -> Result<JsValue, JsError> {
    console_error_panic_hook::set_once();

    let tokens = kcl_lib::token::lexer(js);
    Ok(JsValue::from_serde(&tokens)?)
}

#[wasm_bindgen]
pub fn parse_wasm(js: &str) -> Result<JsValue, String> {
    console_error_panic_hook::set_once();

    let tokens = kcl_lib::token::lexer(js);
    let parser = kcl_lib::parser::Parser::new(tokens);
    let program = parser.ast().map_err(String::from)?;
    // The serde-wasm-bindgen does not work here because of weird HashMap issues so we use the
    // gloo-serialize crate instead.
    JsValue::from_serde(&program).map_err(|e| e.to_string())
}

// wasm_bindgen wrapper for recast
// test for this function and by extension the recaster are done in javascript land src/lang/recast.test.ts
#[wasm_bindgen]
pub fn recast_wasm(json_str: &str) -> Result<JsValue, JsError> {
    console_error_panic_hook::set_once();

    // deserialize the ast from a stringified json
    let program: kcl_lib::ast::types::Program = serde_json::from_str(json_str).map_err(JsError::from)?;

    // Use the default options until we integrate into the UI the ability to change them.
    let result = program.recast(&Default::default(), 0);
    Ok(JsValue::from_serde(&result)?)
}

#[wasm_bindgen]
pub struct ServerConfig {
    into_server: js_sys::AsyncIterator,
    from_server: web_sys::WritableStream,
    fs: kcl_lib::fs::wasm::FileSystemManager,
}

#[wasm_bindgen]
impl ServerConfig {
    #[wasm_bindgen(constructor)]
    pub fn new(
        into_server: js_sys::AsyncIterator,
        from_server: web_sys::WritableStream,
        fs: kcl_lib::fs::wasm::FileSystemManager,
    ) -> Self {
        Self {
            into_server,
            from_server,
            fs,
        }
    }
}

/// Run the `kcl` lsp server.
//
// NOTE: we don't use web_sys::ReadableStream for input here because on the
// browser side we need to use a ReadableByteStreamController to construct it
// and so far only Chromium-based browsers support that functionality.

// NOTE: input needs to be an AsyncIterator<Uint8Array, never, void> specifically
#[wasm_bindgen]
pub async fn kcl_lsp_run(config: ServerConfig, token: String, is_dev: bool) -> Result<(), JsValue> {
    console_error_panic_hook::set_once();

    let ServerConfig {
        into_server,
        from_server,
        fs,
    } = config;

    let stdlib = kcl_lib::std::StdLib::new();
    let stdlib_completions = kcl_lib::lsp::kcl::get_completions_from_stdlib(&stdlib).map_err(|e| e.to_string())?;
    let stdlib_signatures = kcl_lib::lsp::kcl::get_signatures_from_stdlib(&stdlib).map_err(|e| e.to_string())?;
    // We can unwrap here because we know the tokeniser is valid, since
    // we have a test for it.
    let token_types = kcl_lib::token::TokenType::all_semantic_token_types().unwrap();

    let mut zoo_client = kittycad::Client::new(token);
    if is_dev {
        zoo_client.set_base_url("https://api.dev.zoo.dev");
    }
    // Check if we can send telememtry for this user.
    let privacy_settings = match zoo_client.users().get_privacy_settings().await {
        Ok(privacy_settings) => privacy_settings,
        Err(err) => {
            // In the case of dev we don't always have a sub set, but prod we should.
            if err
                .to_string()
                .contains("The modeling app subscription type is missing.")
            {
                kittycad::types::PrivacySettings {
                    can_train_on_data: true,
                }
            } else {
                return Err(err.to_string().into());
            }
        }
    };

    let (service, socket) = LspService::new(|client| kcl_lib::lsp::kcl::Backend {
        client,
        fs: kcl_lib::fs::FileManager::new(fs),
        workspace_folders: Default::default(),
        stdlib_completions,
        stdlib_signatures,
        token_types,
        token_map: Default::default(),
        ast_map: Default::default(),
        current_code_map: Default::default(),
        diagnostics_map: Default::default(),
        symbols_map: Default::default(),
        semantic_tokens_map: Default::default(),
        zoo_client,
        can_send_telemetry: privacy_settings.can_train_on_data,
    });

    let input = wasm_bindgen_futures::stream::JsStream::from(into_server);
    let input = input
        .map_ok(|value| {
            value
                .dyn_into::<js_sys::Uint8Array>()
                .expect("could not cast stream item to Uint8Array")
                .to_vec()
        })
        .map_err(|_err| std::io::Error::from(std::io::ErrorKind::Other))
        .into_async_read();

    let output = wasm_bindgen::JsCast::unchecked_into::<wasm_streams::writable::sys::WritableStream>(from_server);
    let output = wasm_streams::WritableStream::from_raw(output);
    let output = output.try_into_async_write().map_err(|err| err.0)?;

    Server::new(input, output, socket).serve(service).await;

    Ok(())
}

/// Run the `copilot` lsp server.
//
// NOTE: we don't use web_sys::ReadableStream for input here because on the
// browser side we need to use a ReadableByteStreamController to construct it
// and so far only Chromium-based browsers support that functionality.

// NOTE: input needs to be an AsyncIterator<Uint8Array, never, void> specifically
#[wasm_bindgen]
pub async fn copilot_lsp_run(config: ServerConfig, token: String, is_dev: bool) -> Result<(), JsValue> {
    console_error_panic_hook::set_once();

    let ServerConfig {
        into_server,
        from_server,
        fs,
    } = config;

    let mut zoo_client = kittycad::Client::new(token);
    if is_dev {
        zoo_client.set_base_url("https://api.dev.zoo.dev");
    }

    let (service, socket) = LspService::build(|client| kcl_lib::lsp::copilot::Backend {
        client,
        fs: kcl_lib::fs::FileManager::new(fs),
        workspace_folders: Default::default(),
        current_code_map: Default::default(),
        editor_info: Arc::new(RwLock::new(kcl_lib::lsp::copilot::types::CopilotEditorInfo::default())),
        cache: Arc::new(kcl_lib::lsp::copilot::cache::CopilotCache::new()),
        telemetry: Default::default(),
        zoo_client,
    })
    .custom_method("setEditorInfo", kcl_lib::lsp::copilot::Backend::set_editor_info)
    .custom_method(
        "getCompletions",
        kcl_lib::lsp::copilot::Backend::get_completions_cycling,
    )
    .custom_method("notifyAccepted", kcl_lib::lsp::copilot::Backend::accept_completion)
    .custom_method("notifyRejected", kcl_lib::lsp::copilot::Backend::reject_completions)
    .finish();

    let input = wasm_bindgen_futures::stream::JsStream::from(into_server);
    let input = input
        .map_ok(|value| {
            value
                .dyn_into::<js_sys::Uint8Array>()
                .expect("could not cast stream item to Uint8Array")
                .to_vec()
        })
        .map_err(|_err| std::io::Error::from(std::io::ErrorKind::Other))
        .into_async_read();

    let output = wasm_bindgen::JsCast::unchecked_into::<wasm_streams::writable::sys::WritableStream>(from_server);
    let output = wasm_streams::WritableStream::from_raw(output);
    let output = output.try_into_async_write().map_err(|err| err.0)?;

    Server::new(input, output, socket).serve(service).await;

    Ok(())
}

#[wasm_bindgen]
pub fn is_points_ccw(points: &[f64]) -> i32 {
    console_error_panic_hook::set_once();

    kcl_lib::std::utils::is_points_ccw_wasm(points)
}

#[wasm_bindgen]
pub struct TangentialArcInfoOutputWasm {
    /// The geometric center of the arc x.
    pub center_x: f64,
    /// The geometric center of the arc y.
    pub center_y: f64,
    /// The midpoint of the arc x.
    pub arc_mid_point_x: f64,
    /// The midpoint of the arc y.
    pub arc_mid_point_y: f64,
    /// The radius of the arc.
    pub radius: f64,
    /// Start angle of the arc in radians.
    pub start_angle: f64,
    /// End angle of the arc in radians.
    pub end_angle: f64,
    /// Flag to determine if the arc is counter clockwise.
    pub ccw: i32,
    /// The length of the arc.
    pub arc_length: f64,
}

#[wasm_bindgen]
pub fn get_tangential_arc_to_info(
    arc_start_point_x: f64,
    arc_start_point_y: f64,
    arc_end_point_x: f64,
    arc_end_point_y: f64,
    tan_previous_point_x: f64,
    tan_previous_point_y: f64,
    obtuse: bool,
) -> TangentialArcInfoOutputWasm {
    console_error_panic_hook::set_once();

    let result = kcl_lib::std::utils::get_tangential_arc_to_info(kcl_lib::std::utils::TangentialArcInfoInput {
        arc_start_point: [arc_start_point_x, arc_start_point_y],
        arc_end_point: [arc_end_point_x, arc_end_point_y],
        tan_previous_point: [tan_previous_point_x, tan_previous_point_y],
        obtuse,
    });
    TangentialArcInfoOutputWasm {
        center_x: result.center[0],
        center_y: result.center[1],
        arc_mid_point_x: result.arc_mid_point[0],
        arc_mid_point_y: result.arc_mid_point[1],
        radius: result.radius,
        start_angle: result.start_angle,
        end_angle: result.end_angle,
        ccw: result.ccw,
        arc_length: result.arc_length,
    }
}

/// Create the default program memory.
#[wasm_bindgen]
pub fn program_memory_init() -> Result<JsValue, String> {
    console_error_panic_hook::set_once();

    let memory = kcl_lib::executor::ProgramMemory::default();

    // The serde-wasm-bindgen does not work here because of weird HashMap issues so we use the
    // gloo-serialize crate instead.
    JsValue::from_serde(&memory).map_err(|e| e.to_string())
}
