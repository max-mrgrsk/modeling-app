//! The executor for the AST.

use std::{collections::HashMap, sync::Arc};

use anyhow::Result;
use async_recursion::async_recursion;
use kittycad_execution_plan_macros::ExecutionPlanValue;
use parse_display::{Display, FromStr};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use serde_json::Value as JValue;
use tower_lsp::lsp_types::{Position as LspPosition, Range as LspRange};

use crate::{
    ast::types::{BodyItem, FunctionExpression, KclNone, Value},
    engine::EngineManager,
    errors::{KclError, KclErrorDetails},
    fs::FileManager,
    std::{FunctionKind, StdLib},
};

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct ProgramMemory {
    pub root: HashMap<String, MemoryItem>,
    #[serde(rename = "return")]
    pub return_: Option<ProgramReturn>,
}

impl ProgramMemory {
    pub fn new() -> Self {
        Self {
            root: HashMap::from([
                (
                    "ZERO".to_string(),
                    MemoryItem::UserVal(UserVal {
                        value: serde_json::Value::Number(serde_json::value::Number::from(0)),
                        meta: Default::default(),
                    }),
                ),
                (
                    "QUARTER_TURN".to_string(),
                    MemoryItem::UserVal(UserVal {
                        value: serde_json::Value::Number(serde_json::value::Number::from(90)),
                        meta: Default::default(),
                    }),
                ),
                (
                    "HALF_TURN".to_string(),
                    MemoryItem::UserVal(UserVal {
                        value: serde_json::Value::Number(serde_json::value::Number::from(180)),
                        meta: Default::default(),
                    }),
                ),
                (
                    "THREE_QUARTER_TURN".to_string(),
                    MemoryItem::UserVal(UserVal {
                        value: serde_json::Value::Number(serde_json::value::Number::from(270)),
                        meta: Default::default(),
                    }),
                ),
            ]),
            return_: None,
        }
    }

    /// Add to the program memory.
    pub fn add(&mut self, key: &str, value: MemoryItem, source_range: SourceRange) -> Result<(), KclError> {
        if self.root.contains_key(key) {
            return Err(KclError::ValueAlreadyDefined(KclErrorDetails {
                message: format!("Cannot redefine {}", key),
                source_ranges: vec![source_range],
            }));
        }

        self.root.insert(key.to_string(), value);

        Ok(())
    }

    /// Get a value from the program memory.
    /// Return Err if not found.
    pub fn get(&self, key: &str, source_range: SourceRange) -> Result<&MemoryItem, KclError> {
        self.root.get(key).ok_or_else(|| {
            KclError::UndefinedValue(KclErrorDetails {
                message: format!("memory item key `{}` is not defined", key),
                source_ranges: vec![source_range],
            })
        })
    }
}

impl Default for ProgramMemory {
    fn default() -> Self {
        Self::new()
    }
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(rename_all = "camelCase", untagged)]
pub enum ProgramReturn {
    Arguments,
    Value(MemoryItem),
}

impl From<ProgramReturn> for Vec<SourceRange> {
    fn from(item: ProgramReturn) -> Self {
        match item {
            ProgramReturn::Arguments => Default::default(),
            ProgramReturn::Value(v) => v.into(),
        }
    }
}

impl ProgramReturn {
    pub fn get_value(&self) -> Result<MemoryItem, KclError> {
        match self {
            ProgramReturn::Value(v) => Ok(v.clone()),
            ProgramReturn::Arguments => Err(KclError::Semantic(KclErrorDetails {
                message: "Cannot get value from arguments".to_owned(),
                source_ranges: self.clone().into(),
            })),
        }
    }
}

/// A memory item.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(tag = "type")]
pub enum MemoryItem {
    UserVal(UserVal),
    Plane(Box<Plane>),
    Face(Box<Face>),
    SketchGroup(Box<SketchGroup>),
    SketchGroups {
        value: Vec<Box<SketchGroup>>,
    },
    ExtrudeGroup(Box<ExtrudeGroup>),
    ExtrudeGroups {
        value: Vec<Box<ExtrudeGroup>>,
    },
    ImportedGeometry(ImportedGeometry),
    #[ts(skip)]
    Function {
        #[serde(skip)]
        func: Option<MemoryFunction>,
        expression: Box<FunctionExpression>,
        #[serde(rename = "__meta")]
        meta: Vec<Metadata>,
    },
}

/// A geometry.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(tag = "type")]
pub enum Geometry {
    SketchGroup(Box<SketchGroup>),
    ExtrudeGroup(Box<ExtrudeGroup>),
}

impl Geometry {
    pub fn id(&self) -> uuid::Uuid {
        match self {
            Geometry::SketchGroup(s) => s.id,
            Geometry::ExtrudeGroup(e) => e.id,
        }
    }
}

/// A set of geometry.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(tag = "type")]
pub enum Geometries {
    SketchGroups(Vec<Box<SketchGroup>>),
    ExtrudeGroups(Vec<Box<ExtrudeGroup>>),
}

/// A sketch group or a group of sketch groups.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum SketchGroupSet {
    SketchGroup(Box<SketchGroup>),
    SketchGroups(Vec<Box<SketchGroup>>),
}

/// A extrude group or a group of extrude groups.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum ExtrudeGroupSet {
    ExtrudeGroup(Box<ExtrudeGroup>),
    ExtrudeGroups(Vec<Box<ExtrudeGroup>>),
}

/// Data for an imported geometry.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct ImportedGeometry {
    /// The ID of the imported geometry.
    pub id: uuid::Uuid,
    /// The original file paths.
    pub value: Vec<String>,
    #[serde(rename = "__meta")]
    pub meta: Vec<Metadata>,
}

/// A plane.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct Plane {
    /// The id of the plane.
    pub id: uuid::Uuid,
    // The code for the plane either a string or custom.
    pub value: PlaneType,
    /// Origin of the plane.
    pub origin: Point3d,
    /// What should the plane’s X axis be?
    pub x_axis: Point3d,
    /// What should the plane’s Y axis be?
    pub y_axis: Point3d,
    /// The z-axis (normal).
    pub z_axis: Point3d,
    #[serde(rename = "__meta")]
    pub meta: Vec<Metadata>,
}

#[derive(Debug, Default, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct DefaultPlanes {
    pub xy: uuid::Uuid,
    pub xz: uuid::Uuid,
    pub yz: uuid::Uuid,
    pub neg_xy: uuid::Uuid,
    pub neg_xz: uuid::Uuid,
    pub neg_yz: uuid::Uuid,
}

/// A face.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct Face {
    /// The id of the face.
    pub id: uuid::Uuid,
    /// The tag of the face.
    pub value: String,
    /// The original sketch group id of the object we are sketching on.
    pub sketch_group_id: uuid::Uuid,
    /// What should the face’s X axis be?
    pub x_axis: Point3d,
    /// What should the face’s Y axis be?
    pub y_axis: Point3d,
    /// The z-axis (normal).
    pub z_axis: Point3d,
    /// the face id the sketch is on
    pub face_id: uuid::Uuid,
    #[serde(rename = "__meta")]
    pub meta: Vec<Metadata>,
}

/// Type for a plane.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema, FromStr, Display)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
#[display(style = "camelCase")]
pub enum PlaneType {
    #[serde(rename = "XY", alias = "xy")]
    #[display("XY")]
    XY,
    #[serde(rename = "XZ", alias = "xz")]
    #[display("XZ")]
    XZ,
    #[serde(rename = "YZ", alias = "yz")]
    #[display("YZ")]
    YZ,
    /// A custom plane.
    #[serde(rename = "Custom")]
    #[display("Custom")]
    Custom,
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(tag = "type", rename_all = "camelCase")]
pub struct UserVal {
    #[ts(type = "any")]
    pub value: serde_json::Value,
    #[serde(rename = "__meta")]
    pub meta: Vec<Metadata>,
}

pub type MemoryFunction =
    fn(
        s: Vec<MemoryItem>,
        memory: ProgramMemory,
        expression: Box<FunctionExpression>,
        metadata: Vec<Metadata>,
        ctx: ExecutorContext,
    ) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<Option<ProgramReturn>, KclError>> + Send>>;

fn force_memory_function<
    F: Fn(
        Vec<MemoryItem>,
        ProgramMemory,
        Box<FunctionExpression>,
        Vec<Metadata>,
        ExecutorContext,
    ) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<Option<ProgramReturn>, KclError>> + Send>>,
>(
    f: F,
) -> F {
    f
}

impl From<MemoryItem> for Vec<SourceRange> {
    fn from(item: MemoryItem) -> Self {
        match item {
            MemoryItem::UserVal(u) => u.meta.iter().map(|m| m.source_range).collect(),
            MemoryItem::SketchGroup(s) => s.meta.iter().map(|m| m.source_range).collect(),
            MemoryItem::SketchGroups { value } => value
                .iter()
                .flat_map(|sg| sg.meta.iter().map(|m| m.source_range))
                .collect(),
            MemoryItem::ExtrudeGroup(e) => e.meta.iter().map(|m| m.source_range).collect(),
            MemoryItem::ExtrudeGroups { value } => value
                .iter()
                .flat_map(|eg| eg.meta.iter().map(|m| m.source_range))
                .collect(),
            MemoryItem::ImportedGeometry(i) => i.meta.iter().map(|m| m.source_range).collect(),
            MemoryItem::Function { meta, .. } => meta.iter().map(|m| m.source_range).collect(),
            MemoryItem::Plane(p) => p.meta.iter().map(|m| m.source_range).collect(),
            MemoryItem::Face(f) => f.meta.iter().map(|m| m.source_range).collect(),
        }
    }
}

impl MemoryItem {
    pub fn get_json_value(&self) -> Result<serde_json::Value, KclError> {
        if let MemoryItem::UserVal(user_val) = self {
            Ok(user_val.value.clone())
        } else {
            serde_json::to_value(self).map_err(|err| {
                KclError::Semantic(KclErrorDetails {
                    message: format!("Cannot convert memory item to json value: {:?}", err),
                    source_ranges: self.clone().into(),
                })
            })
        }
    }

    /// Get a JSON value and deserialize it into some concrete type.
    pub fn get_json<T: serde::de::DeserializeOwned>(&self) -> Result<T, KclError> {
        let json = self.get_json_value()?;

        serde_json::from_value(json).map_err(|e| {
            KclError::Type(KclErrorDetails {
                message: format!("Failed to deserialize struct from JSON: {}", e),
                source_ranges: self.clone().into(),
            })
        })
    }

    /// Get a JSON value and deserialize it into some concrete type.
    /// If it's a KCL None, return None. Otherwise return Some.
    pub fn get_json_opt<T: serde::de::DeserializeOwned>(&self) -> Result<Option<T>, KclError> {
        let json = self.get_json_value()?;
        if let JValue::Object(ref o) = json {
            if let Some(JValue::String(s)) = o.get("type") {
                if s == "KclNone" {
                    return Ok(None);
                }
            }
        }

        serde_json::from_value(json)
            .map_err(|e| {
                KclError::Type(KclErrorDetails {
                    message: format!("Failed to deserialize struct from JSON: {}", e),
                    source_ranges: self.clone().into(),
                })
            })
            .map(Some)
    }

    /// If this memory item is a function, call it with the given arguments, return its val as Ok.
    /// If it's not a function, return Err.
    pub async fn call_fn(
        &self,
        args: Vec<MemoryItem>,
        memory: ProgramMemory,
        ctx: ExecutorContext,
    ) -> Result<Option<ProgramReturn>, KclError> {
        let MemoryItem::Function { func, expression, meta } = &self else {
            return Err(KclError::Semantic(KclErrorDetails {
                message: "not a in memory function".to_string(),
                source_ranges: vec![],
            }));
        };
        let Some(func) = func else {
            return Err(KclError::Semantic(KclErrorDetails {
                message: format!("Not a function: {:?}", expression),
                source_ranges: vec![],
            }));
        };
        func(args, memory, expression.clone(), meta.clone(), ctx).await
    }
}

/// A sketch group is a collection of paths.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(tag = "type", rename_all = "camelCase")]
pub struct SketchGroup {
    /// The id of the sketch group.
    pub id: uuid::Uuid,
    /// The paths in the sketch group.
    pub value: Vec<Path>,
    /// What the sketch is on (can be a plane or a face).
    pub on: SketchSurface,
    /// The starting path.
    pub start: BasePath,
    /// The position of the sketch group.
    pub position: Position,
    /// The rotation of the sketch group base plane.
    pub rotation: Rotation,
    /// The x-axis of the sketch group base plane in the 3D space
    pub x_axis: Point3d,
    /// The y-axis of the sketch group base plane in the 3D space
    pub y_axis: Point3d,
    /// The z-axis of the sketch group base plane in the 3D space
    pub z_axis: Point3d,
    /// The plane id or face id of the sketch group.
    pub entity_id: Option<uuid::Uuid>,
    /// Metadata.
    #[serde(rename = "__meta")]
    pub meta: Vec<Metadata>,
}

/// A sketch group type.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum SketchSurface {
    Plane(Box<Plane>),
    Face(Box<Face>),
}

impl SketchSurface {
    pub fn id(&self) -> uuid::Uuid {
        match self {
            SketchSurface::Plane(plane) => plane.id,
            SketchSurface::Face(face) => face.id,
        }
    }
    pub fn x_axis(&self) -> Point3d {
        match self {
            SketchSurface::Plane(plane) => plane.x_axis.clone(),
            SketchSurface::Face(face) => face.x_axis.clone(),
        }
    }
    pub fn y_axis(&self) -> Point3d {
        match self {
            SketchSurface::Plane(plane) => plane.y_axis.clone(),
            SketchSurface::Face(face) => face.y_axis.clone(),
        }
    }
    pub fn z_axis(&self) -> Point3d {
        match self {
            SketchSurface::Plane(plane) => plane.z_axis.clone(),
            SketchSurface::Face(face) => face.z_axis.clone(),
        }
    }
}

pub struct GetTangentialInfoFromPathsResult {
    pub center_or_tangent_point: [f64; 2],
    pub is_center: bool,
    pub ccw: bool,
}

impl SketchGroup {
    pub fn get_path_by_id(&self, id: &uuid::Uuid) -> Option<&Path> {
        self.value.iter().find(|p| p.get_id() == *id)
    }

    pub fn get_path_by_name(&self, name: &str) -> Option<&Path> {
        self.value.iter().find(|p| p.get_name() == name)
    }

    pub fn get_base_by_name_or_start(&self, name: &str) -> Option<&BasePath> {
        if self.start.name == name {
            Some(&self.start)
        } else {
            self.value.iter().find(|p| p.get_name() == name).map(|p| p.get_base())
        }
    }

    pub fn get_coords_from_paths(&self) -> Result<Point2d, KclError> {
        if self.value.is_empty() {
            return Ok(self.start.to.into());
        }

        let index = self.value.len() - 1;
        if let Some(path) = self.value.get(index) {
            let base = path.get_base();
            Ok(base.to.into())
        } else {
            Ok(self.start.to.into())
        }
    }

    pub fn get_tangential_info_from_paths(&self) -> GetTangentialInfoFromPathsResult {
        if self.value.is_empty() {
            return GetTangentialInfoFromPathsResult {
                center_or_tangent_point: self.start.to,
                is_center: false,
                ccw: false,
            };
        }
        let index = self.value.len() - 1;
        if let Some(path) = self.value.get(index) {
            match path {
                Path::TangentialArcTo { center, ccw, .. } => GetTangentialInfoFromPathsResult {
                    center_or_tangent_point: *center,
                    is_center: true,
                    ccw: *ccw,
                },
                _ => {
                    let base = path.get_base();
                    GetTangentialInfoFromPathsResult {
                        center_or_tangent_point: base.from,
                        is_center: false,
                        ccw: false,
                    }
                }
            }
        } else {
            GetTangentialInfoFromPathsResult {
                center_or_tangent_point: self.start.to,
                is_center: false,
                ccw: false,
            }
        }
    }
}

/// An extrude group is a collection of extrude surfaces.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(tag = "type", rename_all = "camelCase")]
pub struct ExtrudeGroup {
    /// The id of the extrude group.
    pub id: uuid::Uuid,
    /// The extrude surfaces.
    pub value: Vec<ExtrudeSurface>,
    /// The sketch group paths.
    pub sketch_group_values: Vec<Path>,
    /// The height of the extrude group.
    pub height: f64,
    /// The position of the extrude group.
    pub position: Position,
    /// The rotation of the extrude group.
    pub rotation: Rotation,
    /// The x-axis of the extrude group base plane in the 3D space
    pub x_axis: Point3d,
    /// The y-axis of the extrude group base plane in the 3D space
    pub y_axis: Point3d,
    /// The z-axis of the extrude group base plane in the 3D space
    pub z_axis: Point3d,
    /// The id of the extrusion start cap
    pub start_cap_id: Option<uuid::Uuid>,
    /// The id of the extrusion end cap
    pub end_cap_id: Option<uuid::Uuid>,
    /// Metadata.
    #[serde(rename = "__meta")]
    pub meta: Vec<Metadata>,
}

impl ExtrudeGroup {
    pub fn get_path_by_id(&self, id: &uuid::Uuid) -> Option<&ExtrudeSurface> {
        self.value.iter().find(|p| p.get_id() == *id)
    }

    pub fn get_path_by_name(&self, name: &str) -> Option<&ExtrudeSurface> {
        self.value.iter().find(|p| p.get_name() == name)
    }
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub enum BodyType {
    Root,
    Sketch,
    Block,
}

#[derive(Debug, Deserialize, Serialize, PartialEq, Copy, Clone, ts_rs::TS, JsonSchema)]
#[ts(export)]
pub struct Position(#[ts(type = "[number, number, number]")] pub [f64; 3]);

impl From<Position> for Point3d {
    fn from(p: Position) -> Self {
        Self {
            x: p.0[0],
            y: p.0[1],
            z: p.0[2],
        }
    }
}

#[derive(Debug, Deserialize, Serialize, PartialEq, Copy, Clone, ts_rs::TS, JsonSchema)]
#[ts(export)]
pub struct Rotation(#[ts(type = "[number, number, number, number]")] pub [f64; 4]);

#[derive(Debug, Default, Deserialize, Serialize, PartialEq, Copy, Clone, ts_rs::TS, JsonSchema, Hash, Eq)]
#[ts(export)]
pub struct SourceRange(#[ts(type = "[number, number]")] pub [usize; 2]);

impl SourceRange {
    /// Create a new source range.
    pub fn new(start: usize, end: usize) -> Self {
        Self([start, end])
    }

    /// Get the start of the range.
    pub fn start(&self) -> usize {
        self.0[0]
    }

    /// Get the end of the range.
    pub fn end(&self) -> usize {
        self.0[1]
    }

    /// Check if the range contains a position.
    pub fn contains(&self, pos: usize) -> bool {
        pos >= self.start() && pos <= self.end()
    }

    pub fn start_to_lsp_position(&self, code: &str) -> LspPosition {
        // Calculate the line and column of the error from the source range.
        // Lines are zero indexed in vscode so we need to subtract 1.
        let mut line = code[..self.start()].lines().count();
        if line > 0 {
            line = line.saturating_sub(1);
        }
        let column = code[..self.start()].lines().last().map(|l| l.len()).unwrap_or_default();

        LspPosition {
            line: line as u32,
            character: column as u32,
        }
    }

    pub fn end_to_lsp_position(&self, code: &str) -> LspPosition {
        let lines = code[..self.end()].lines();
        if lines.clone().count() == 0 {
            return LspPosition { line: 0, character: 0 };
        }

        // Calculate the line and column of the error from the source range.
        // Lines are zero indexed in vscode so we need to subtract 1.
        let line = lines.clone().count() - 1;
        let column = lines.last().map(|l| l.len()).unwrap_or_default();

        LspPosition {
            line: line as u32,
            character: column as u32,
        }
    }

    pub fn to_lsp_range(&self, code: &str) -> LspRange {
        let start = self.start_to_lsp_position(code);
        let end = self.end_to_lsp_position(code);
        LspRange { start, end }
    }
}

#[derive(Debug, Deserialize, Serialize, PartialEq, Clone, Copy, ts_rs::TS, JsonSchema)]
#[ts(export)]
pub struct Point2d {
    pub x: f64,
    pub y: f64,
}

impl From<[f64; 2]> for Point2d {
    fn from(p: [f64; 2]) -> Self {
        Self { x: p[0], y: p[1] }
    }
}

impl From<&[f64; 2]> for Point2d {
    fn from(p: &[f64; 2]) -> Self {
        Self { x: p[0], y: p[1] }
    }
}

impl From<Point2d> for [f64; 2] {
    fn from(p: Point2d) -> Self {
        [p.x, p.y]
    }
}

impl From<Point2d> for kittycad::types::Point2D {
    fn from(p: Point2d) -> Self {
        Self { x: p.x, y: p.y }
    }
}

impl Point2d {
    pub const ZERO: Self = Self { x: 0.0, y: 0.0 };
    pub fn scale(self, scalar: f64) -> Self {
        Self {
            x: self.x * scalar,
            y: self.y * scalar,
        }
    }
}

#[derive(Debug, Deserialize, Serialize, PartialEq, Clone, ts_rs::TS, JsonSchema, ExecutionPlanValue)]
#[ts(export)]
pub struct Point3d {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

impl Point3d {
    pub fn new(x: f64, y: f64, z: f64) -> Self {
        Self { x, y, z }
    }
}

impl From<Point3d> for kittycad::types::Point3D {
    fn from(p: Point3d) -> Self {
        Self { x: p.x, y: p.y, z: p.z }
    }
}

/// Metadata.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct Metadata {
    /// The source range.
    pub source_range: SourceRange,
}

impl From<SourceRange> for Metadata {
    fn from(source_range: SourceRange) -> Self {
        Self { source_range }
    }
}

/// A base path.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct BasePath {
    /// The from point.
    #[ts(type = "[number, number]")]
    pub from: [f64; 2],
    /// The to point.
    #[ts(type = "[number, number]")]
    pub to: [f64; 2],
    /// The name of the path.
    pub name: String,
    /// Metadata.
    #[serde(rename = "__geoMeta")]
    pub geo_meta: GeoMeta,
}

/// Geometry metadata.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct GeoMeta {
    /// The id of the geometry.
    pub id: uuid::Uuid,
    /// Metadata.
    #[serde(flatten)]
    pub metadata: Metadata,
}

/// A path.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(tag = "type")]
pub enum Path {
    /// A path that goes to a point.
    ToPoint {
        #[serde(flatten)]
        base: BasePath,
    },
    /// A arc that is tangential to the last path segment that goes to a point
    TangentialArcTo {
        #[serde(flatten)]
        base: BasePath,
        /// the arc's center
        #[ts(type = "[number, number]")]
        center: [f64; 2],
        /// arc's direction
        ccw: bool,
    },
    /// A arc that is tangential to the last path segment
    TangentialArc {
        #[serde(flatten)]
        base: BasePath,
    },
    /// A path that is horizontal.
    Horizontal {
        #[serde(flatten)]
        base: BasePath,
        /// The x coordinate.
        x: f64,
    },
    /// An angled line to.
    AngledLineTo {
        #[serde(flatten)]
        base: BasePath,
        /// The x coordinate.
        x: Option<f64>,
        /// The y coordinate.
        y: Option<f64>,
    },
    /// A base path.
    Base {
        #[serde(flatten)]
        base: BasePath,
    },
}

impl Path {
    pub fn get_id(&self) -> uuid::Uuid {
        match self {
            Path::ToPoint { base } => base.geo_meta.id,
            Path::Horizontal { base, .. } => base.geo_meta.id,
            Path::AngledLineTo { base, .. } => base.geo_meta.id,
            Path::Base { base } => base.geo_meta.id,
            Path::TangentialArcTo { base, .. } => base.geo_meta.id,
            Path::TangentialArc { base } => base.geo_meta.id,
        }
    }

    pub fn get_name(&self) -> String {
        match self {
            Path::ToPoint { base } => base.name.clone(),
            Path::Horizontal { base, .. } => base.name.clone(),
            Path::AngledLineTo { base, .. } => base.name.clone(),
            Path::Base { base } => base.name.clone(),
            Path::TangentialArcTo { base, .. } => base.name.clone(),
            Path::TangentialArc { base } => base.name.clone(),
        }
    }

    pub fn get_base(&self) -> &BasePath {
        match self {
            Path::ToPoint { base } => base,
            Path::Horizontal { base, .. } => base,
            Path::AngledLineTo { base, .. } => base,
            Path::Base { base } => base,
            Path::TangentialArcTo { base, .. } => base,
            Path::TangentialArc { base } => base,
        }
    }

    pub fn get_base_mut(&mut self) -> Option<&mut BasePath> {
        match self {
            Path::ToPoint { base } => Some(base),
            Path::Horizontal { base, .. } => Some(base),
            Path::AngledLineTo { base, .. } => Some(base),
            Path::Base { base } => Some(base),
            Path::TangentialArcTo { base, .. } => Some(base),
            Path::TangentialArc { base } => Some(base),
        }
    }
}

/// An extrude surface.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum ExtrudeSurface {
    /// An extrude plane.
    ExtrudePlane(ExtrudePlane),
    ExtrudeArc(ExtrudeArc),
}

/// An extruded plane.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct ExtrudePlane {
    /// The position.
    pub position: Position,
    /// The rotation.
    pub rotation: Rotation,
    /// The face id for the extrude plane.
    pub face_id: uuid::Uuid,
    /// The name.
    pub name: String,
    /// Metadata.
    #[serde(flatten)]
    pub geo_meta: GeoMeta,
}

/// An extruded arc.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct ExtrudeArc {
    /// The position.
    pub position: Position,
    /// The rotation.
    pub rotation: Rotation,
    /// The face id for the extrude plane.
    pub face_id: uuid::Uuid,
    /// The name.
    pub name: String,
    /// Metadata.
    #[serde(flatten)]
    pub geo_meta: GeoMeta,
}

impl ExtrudeSurface {
    pub fn get_id(&self) -> uuid::Uuid {
        match self {
            ExtrudeSurface::ExtrudePlane(ep) => ep.geo_meta.id,
            ExtrudeSurface::ExtrudeArc(ea) => ea.geo_meta.id,
        }
    }

    pub fn get_name(&self) -> String {
        match self {
            ExtrudeSurface::ExtrudePlane(ep) => ep.name.to_string(),
            ExtrudeSurface::ExtrudeArc(ea) => ea.name.to_string(),
        }
    }

    pub fn get_position(&self) -> Position {
        match self {
            ExtrudeSurface::ExtrudePlane(ep) => ep.position,
            ExtrudeSurface::ExtrudeArc(ea) => ea.position,
        }
    }

    pub fn get_rotation(&self) -> Rotation {
        match self {
            ExtrudeSurface::ExtrudePlane(ep) => ep.rotation,
            ExtrudeSurface::ExtrudeArc(ea) => ea.rotation,
        }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, ts_rs::TS, JsonSchema)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct PipeInfo {
    pub previous_results: Option<MemoryItem>,
}

impl PipeInfo {
    pub fn new() -> Self {
        Self { previous_results: None }
    }
}

impl Default for PipeInfo {
    fn default() -> Self {
        Self::new()
    }
}

/// The executor context.
#[derive(Debug, Clone)]
pub struct ExecutorContext {
    pub engine: Arc<Box<dyn EngineManager>>,
    pub fs: Arc<FileManager>,
    pub stdlib: Arc<StdLib>,
    pub settings: ExecutorSettings,
    /// Mock mode is only for the modeling app when they just want to mock engine calls and not
    /// actually make them.
    pub is_mock: bool,
}

/// The executor settings.
#[derive(Debug, Clone)]
pub struct ExecutorSettings {
    /// The unit to use in modeling dimensions.
    pub units: crate::settings::types::UnitLength,
    /// Highlight edges of 3D objects?
    pub highlight_edges: bool,
    /// Whether or not Screen Space Ambient Occlusion (SSAO) is enabled.
    pub enable_ssao: bool,
}

impl Default for ExecutorSettings {
    fn default() -> Self {
        Self {
            units: Default::default(),
            highlight_edges: true,
            enable_ssao: false,
        }
    }
}

impl From<crate::settings::types::Configuration> for ExecutorSettings {
    fn from(config: crate::settings::types::Configuration) -> Self {
        Self {
            units: config.settings.modeling.base_unit,
            highlight_edges: config.settings.modeling.highlight_edges.into(),
            enable_ssao: config.settings.modeling.enable_ssao.into(),
        }
    }
}

impl From<crate::settings::types::project::ProjectConfiguration> for ExecutorSettings {
    fn from(config: crate::settings::types::project::ProjectConfiguration) -> Self {
        Self {
            units: config.settings.modeling.base_unit,
            highlight_edges: config.settings.modeling.highlight_edges.into(),
            enable_ssao: config.settings.modeling.enable_ssao.into(),
        }
    }
}

impl From<crate::settings::types::ModelingSettings> for ExecutorSettings {
    fn from(modeling: crate::settings::types::ModelingSettings) -> Self {
        Self {
            units: modeling.base_unit,
            highlight_edges: modeling.highlight_edges.into(),
            enable_ssao: modeling.enable_ssao.into(),
        }
    }
}

impl ExecutorContext {
    /// Create a new default executor context.
    #[cfg(not(target_arch = "wasm32"))]
    pub async fn new(client: &kittycad::Client, settings: ExecutorSettings) -> Result<Self> {
        let ws = client
            .modeling()
            .commands_ws(
                None,
                None,
                if settings.enable_ssao {
                    Some(kittycad::types::PostEffectType::Ssao)
                } else {
                    None
                },
                None,
                None,
                None,
                Some(false),
            )
            .await?;

        let engine: Arc<Box<dyn EngineManager>> =
            Arc::new(Box::new(crate::engine::conn::EngineConnection::new(ws).await?));

        // Set the edge visibility.
        engine
            .send_modeling_cmd(
                uuid::Uuid::new_v4(),
                SourceRange::default(),
                kittycad::types::ModelingCmd::EdgeLinesVisible {
                    hidden: !settings.highlight_edges,
                },
            )
            .await?;

        Ok(Self {
            engine,
            fs: Arc::new(FileManager::new()),
            stdlib: Arc::new(StdLib::new()),
            settings,
            is_mock: false,
        })
    }

    /// Perform the execution of a program.
    /// You can optionally pass in some initialization memory.
    /// Kurt uses this for partial execution.
    pub async fn run(
        &self,
        program: crate::ast::types::Program,
        memory: Option<ProgramMemory>,
    ) -> Result<ProgramMemory, KclError> {
        // Before we even start executing the program, set the units.
        self.engine
            .send_modeling_cmd(
                uuid::Uuid::new_v4(),
                SourceRange::default(),
                kittycad::types::ModelingCmd::SetSceneUnits {
                    unit: self.settings.units.clone().into(),
                },
            )
            .await?;
        let mut memory = if let Some(memory) = memory {
            memory.clone()
        } else {
            Default::default()
        };
        self.inner_execute(program, &mut memory, crate::executor::BodyType::Root)
            .await
    }

    /// Execute an AST's program.
    #[async_recursion]
    pub(crate) async fn inner_execute(
        &self,
        program: crate::ast::types::Program,
        memory: &mut ProgramMemory,
        _body_type: BodyType,
    ) -> Result<ProgramMemory, KclError> {
        let pipe_info = PipeInfo::default();

        // Iterate over the body of the program.
        for statement in &program.body {
            match statement {
                BodyItem::ExpressionStatement(expression_statement) => {
                    if let Value::PipeExpression(pipe_expr) = &expression_statement.expression {
                        pipe_expr.get_result(memory, &pipe_info, self).await?;
                    } else if let Value::CallExpression(call_expr) = &expression_statement.expression {
                        let fn_name = call_expr.callee.name.to_string();
                        let mut args: Vec<MemoryItem> = Vec::new();
                        for arg in &call_expr.arguments {
                            match arg {
                                Value::Literal(literal) => args.push(literal.into()),
                                Value::Identifier(identifier) => {
                                    let memory_item = memory.get(&identifier.name, identifier.into())?;
                                    args.push(memory_item.clone());
                                }
                                Value::CallExpression(call_expr) => {
                                    let result = call_expr.execute(memory, &pipe_info, self).await?;
                                    args.push(result);
                                }
                                Value::BinaryExpression(binary_expression) => {
                                    let result = binary_expression.get_result(memory, &pipe_info, self).await?;
                                    args.push(result);
                                }
                                Value::UnaryExpression(unary_expression) => {
                                    let result = unary_expression.get_result(memory, &pipe_info, self).await?;
                                    args.push(result);
                                }
                                Value::ObjectExpression(object_expression) => {
                                    let result = object_expression.execute(memory, &pipe_info, self).await?;
                                    args.push(result);
                                }
                                Value::ArrayExpression(array_expression) => {
                                    let result = array_expression.execute(memory, &pipe_info, self).await?;
                                    args.push(result);
                                }
                                // We do nothing for the rest.
                                _ => (),
                            }
                        }
                        match self.stdlib.get_either(&call_expr.callee.name) {
                            FunctionKind::Core(func) => {
                                let args = crate::std::Args::new(args, call_expr.into(), self.clone());
                                let result = func.std_lib_fn()(args).await?;
                                memory.return_ = Some(ProgramReturn::Value(result));
                            }
                            FunctionKind::Std(func) => {
                                let mut newmem = memory.clone();
                                let result = self
                                    .inner_execute(func.program().to_owned(), &mut newmem, BodyType::Block)
                                    .await?;
                                memory.return_ = result.return_;
                            }
                            FunctionKind::UserDefined => {
                                if let Some(func) = memory.clone().root.get(&fn_name) {
                                    let result = func.call_fn(args.clone(), memory.clone(), self.clone()).await?;

                                    memory.return_ = result;
                                } else {
                                    return Err(KclError::Semantic(KclErrorDetails {
                                        message: format!("No such name {} defined", fn_name),
                                        source_ranges: vec![call_expr.into()],
                                    }));
                                }
                            }
                        }
                    }
                }
                BodyItem::VariableDeclaration(variable_declaration) => {
                    for declaration in &variable_declaration.declarations {
                        let var_name = declaration.id.name.to_string();
                        let source_range: SourceRange = declaration.init.clone().into();
                        let metadata = Metadata { source_range };

                        match &declaration.init {
                            Value::None(none) => {
                                memory.add(&var_name, none.into(), source_range)?;
                            }
                            Value::Literal(literal) => {
                                memory.add(&var_name, literal.into(), source_range)?;
                            }
                            Value::Identifier(identifier) => {
                                let value = memory.get(&identifier.name, identifier.into())?;
                                memory.add(&var_name, value.clone(), source_range)?;
                            }
                            Value::BinaryExpression(binary_expression) => {
                                let result = binary_expression.get_result(memory, &pipe_info, self).await?;
                                memory.add(&var_name, result, source_range)?;
                            }
                            Value::FunctionExpression(function_expression) => {
                                let mem_func = force_memory_function(
                                    |args: Vec<MemoryItem>,
                                     memory: ProgramMemory,
                                     function_expression: Box<FunctionExpression>,
                                     _metadata: Vec<Metadata>,
                                     ctx: ExecutorContext| {
                                        Box::pin(async move {
                                            let mut fn_memory =
                                                assign_args_to_params(&function_expression, args, memory.clone())?;

                                            let result = ctx
                                                .inner_execute(
                                                    function_expression.body.clone(),
                                                    &mut fn_memory,
                                                    BodyType::Block,
                                                )
                                                .await?;

                                            Ok(result.return_)
                                        })
                                    },
                                );
                                memory.add(
                                    &var_name,
                                    MemoryItem::Function {
                                        expression: function_expression.clone(),
                                        meta: vec![metadata],
                                        func: Some(mem_func),
                                    },
                                    source_range,
                                )?;
                            }
                            Value::CallExpression(call_expression) => {
                                let result = call_expression.execute(memory, &pipe_info, self).await?;
                                memory.add(&var_name, result, source_range)?;
                            }
                            Value::PipeExpression(pipe_expression) => {
                                let result = pipe_expression.get_result(memory, &pipe_info, self).await?;
                                memory.add(&var_name, result, source_range)?;
                            }
                            Value::PipeSubstitution(pipe_substitution) => {
                                return Err(KclError::Semantic(KclErrorDetails {
                                    message: format!(
                                        "pipe substitution not implemented for declaration of variable {}",
                                        var_name
                                    ),
                                    source_ranges: vec![pipe_substitution.into()],
                                }));
                            }
                            Value::ArrayExpression(array_expression) => {
                                let result = array_expression.execute(memory, &pipe_info, self).await?;
                                memory.add(&var_name, result, source_range)?;
                            }
                            Value::ObjectExpression(object_expression) => {
                                let result = object_expression.execute(memory, &pipe_info, self).await?;
                                memory.add(&var_name, result, source_range)?;
                            }
                            Value::MemberExpression(member_expression) => {
                                let result = member_expression.get_result(memory)?;
                                memory.add(&var_name, result, source_range)?;
                            }
                            Value::UnaryExpression(unary_expression) => {
                                let result = unary_expression.get_result(memory, &pipe_info, self).await?;
                                memory.add(&var_name, result, source_range)?;
                            }
                        }
                    }
                }
                BodyItem::ReturnStatement(return_statement) => match &return_statement.argument {
                    Value::BinaryExpression(bin_expr) => {
                        let result = bin_expr.get_result(memory, &pipe_info, self).await?;
                        memory.return_ = Some(ProgramReturn::Value(result));
                    }
                    Value::UnaryExpression(unary_expr) => {
                        let result = unary_expr.get_result(memory, &pipe_info, self).await?;
                        memory.return_ = Some(ProgramReturn::Value(result));
                    }
                    Value::Identifier(identifier) => {
                        let value = memory.get(&identifier.name, identifier.into())?.clone();
                        memory.return_ = Some(ProgramReturn::Value(value));
                    }
                    Value::Literal(literal) => {
                        memory.return_ = Some(ProgramReturn::Value(literal.into()));
                    }
                    Value::ArrayExpression(array_expr) => {
                        let result = array_expr.execute(memory, &pipe_info, self).await?;
                        memory.return_ = Some(ProgramReturn::Value(result));
                    }
                    Value::ObjectExpression(obj_expr) => {
                        let result = obj_expr.execute(memory, &pipe_info, self).await?;
                        memory.return_ = Some(ProgramReturn::Value(result));
                    }
                    Value::CallExpression(call_expr) => {
                        let result = call_expr.execute(memory, &pipe_info, self).await?;
                        memory.return_ = Some(ProgramReturn::Value(result));
                    }
                    Value::MemberExpression(member_expr) => {
                        let result = member_expr.get_result(memory)?;
                        memory.return_ = Some(ProgramReturn::Value(result));
                    }
                    Value::PipeExpression(pipe_expr) => {
                        let result = pipe_expr.get_result(memory, &pipe_info, self).await?;
                        memory.return_ = Some(ProgramReturn::Value(result));
                    }
                    Value::PipeSubstitution(_) => {}
                    Value::FunctionExpression(_) => {}
                    Value::None(none) => {
                        memory.return_ = Some(ProgramReturn::Value(MemoryItem::from(none)));
                    }
                },
            }
        }

        // Flush the batch queue.
        self.engine.flush_batch(SourceRange([program.end, program.end])).await?;

        Ok(memory.clone())
    }

    /// Update the units for the executor.
    pub fn update_units(&mut self, units: crate::settings::types::UnitLength) {
        self.settings.units = units;
    }
}

/// For each argument given,
/// assign it to a parameter of the function, in the given block of function memory.
/// Returns Err if too few/too many arguments were given for the function.
fn assign_args_to_params(
    function_expression: &FunctionExpression,
    args: Vec<MemoryItem>,
    mut fn_memory: ProgramMemory,
) -> Result<ProgramMemory, KclError> {
    let num_args = function_expression.number_of_args();
    let (min_params, max_params) = num_args.into_inner();
    let n = args.len();

    // Check if the user supplied too many arguments
    // (we'll check for too few arguments below).
    let err_wrong_number_args = KclError::Semantic(KclErrorDetails {
        message: if min_params == max_params {
            format!("Expected {min_params} arguments, got {n}")
        } else {
            format!("Expected {min_params}-{max_params} arguments, got {n}")
        },
        source_ranges: vec![function_expression.into()],
    });
    if n > max_params {
        return Err(err_wrong_number_args);
    }

    // Add the arguments to the memory.
    for (index, param) in function_expression.params.iter().enumerate() {
        if let Some(arg) = args.get(index) {
            // Argument was provided.
            fn_memory.add(&param.identifier.name, arg.clone(), (&param.identifier).into())?;
        } else {
            // Argument was not provided.
            if param.optional {
                // If the corresponding parameter is optional,
                // then it's fine, the user doesn't need to supply it.
                let none = KclNone {
                    start: param.identifier.start,
                    end: param.identifier.end,
                };
                fn_memory.add(
                    &param.identifier.name,
                    MemoryItem::from(&none),
                    (&param.identifier).into(),
                )?;
            } else {
                // But if the corresponding parameter was required,
                // then the user has called with too few arguments.
                return Err(err_wrong_number_args);
            }
        }
    }
    Ok(fn_memory)
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use pretty_assertions::assert_eq;

    use super::*;
    use crate::ast::types::{Identifier, Parameter};

    pub async fn parse_execute(code: &str) -> Result<ProgramMemory> {
        let tokens = crate::token::lexer(code)?;
        let parser = crate::parser::Parser::new(tokens);
        let program = parser.ast()?;
        let ctx = ExecutorContext {
            engine: Arc::new(Box::new(crate::engine::conn_mock::EngineConnection::new().await?)),
            fs: Arc::new(crate::fs::FileManager::new()),
            stdlib: Arc::new(crate::std::StdLib::new()),
            settings: Default::default(),
            is_mock: false,
        };
        let memory = ctx.run(program, None).await?;

        Ok(memory)
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_execute_assign_two_variables() {
        let ast = r#"const myVar = 5
const newVar = myVar + 1"#;
        let memory = parse_execute(ast).await.unwrap();
        assert_eq!(
            serde_json::json!(5),
            memory.root.get("myVar").unwrap().get_json_value().unwrap()
        );
        assert_eq!(
            serde_json::json!(6.0),
            memory.root.get("newVar").unwrap().get_json_value().unwrap()
        );
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_execute_angled_line_that_intersects() {
        let ast_fn = |offset: &str| -> String {
            format!(
                r#"const part001 = startSketchOn('XY')
  |> startProfileAt([0, 0], %)
  |> lineTo([2, 2], %, "yo")
  |> lineTo([3, 1], %)
  |> angledLineThatIntersects({{
  angle: 180,
  intersectTag: 'yo',
  offset: {},
}}, %, 'yo2')
const intersect = segEndX('yo2', part001)"#,
                offset
            )
        };

        let memory = parse_execute(&ast_fn("-1")).await.unwrap();
        assert_eq!(
            serde_json::json!(1.0 + 2.0f64.sqrt()),
            memory.root.get("intersect").unwrap().get_json_value().unwrap()
        );

        let memory = parse_execute(&ast_fn("0")).await.unwrap();
        assert_eq!(
            serde_json::json!(1.0000000000000002),
            memory.root.get("intersect").unwrap().get_json_value().unwrap()
        );
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_execute_fn_definitions() {
        let ast = r#"fn def = (x) => {
  return x
}
fn ghi = (x) => {
  return x
}
fn jkl = (x) => {
  return x
}
fn hmm = (x) => {
  return x
}

const yo = 5 + 6

const abc = 3
const identifierGuy = 5
const part001 = startSketchOn('XY')
|> startProfileAt([-1.2, 4.83], %)
|> line([2.8, 0], %)
|> angledLine([100 + 100, 3.01], %)
|> angledLine([abc, 3.02], %)
|> angledLine([def(yo), 3.03], %)
|> angledLine([ghi(2), 3.04], %)
|> angledLine([jkl(yo) + 2, 3.05], %)
|> close(%)
const yo2 = hmm([identifierGuy + 5])"#;

        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_execute_with_pipe_substitutions_unary() {
        let ast = r#"const myVar = 3
const part001 = startSketchOn('XY')
  |> startProfileAt([0, 0], %)
  |> line([3, 4], %, 'seg01')
  |> line([
  min(segLen('seg01', %), myVar),
  -legLen(segLen('seg01', %), myVar)
], %)
"#;

        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_execute_with_pipe_substitutions() {
        let ast = r#"const myVar = 3
const part001 = startSketchOn('XY')
  |> startProfileAt([0, 0], %)
  |> line([3, 4], %, 'seg01')
  |> line([
  min(segLen('seg01', %), myVar),
  legLen(segLen('seg01', %), myVar)
], %)
"#;

        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_execute_with_inline_comment() {
        let ast = r#"const baseThick = 1
const armAngle = 60

const baseThickHalf = baseThick / 2
const halfArmAngle = armAngle / 2

const arrExpShouldNotBeIncluded = [1, 2, 3]
const objExpShouldNotBeIncluded = { a: 1, b: 2, c: 3 }

const part001 = startSketchOn('XY')
  |> startProfileAt([0, 0], %)
  |> yLineTo(1, %)
  |> xLine(3.84, %) // selection-range-7ish-before-this

const variableBelowShouldNotBeIncluded = 3
"#;

        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_execute_with_function_literal_in_pipe() {
        let ast = r#"const w = 20
const l = 8
const h = 10

fn thing = () => {
  return -8
}

const firstExtrude = startSketchOn('XY')
  |> startProfileAt([0,0], %)
  |> line([0, l], %)
  |> line([w, 0], %)
  |> line([0, thing()], %)
  |> close(%)
  |> extrude(h, %)"#;

        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_execute_with_function_unary_in_pipe() {
        let ast = r#"const w = 20
const l = 8
const h = 10

fn thing = (x) => {
  return -x
}

const firstExtrude = startSketchOn('XY')
  |> startProfileAt([0,0], %)
  |> line([0, l], %)
  |> line([w, 0], %)
  |> line([0, thing(8)], %)
  |> close(%)
  |> extrude(h, %)"#;

        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_execute_with_function_array_in_pipe() {
        let ast = r#"const w = 20
const l = 8
const h = 10

fn thing = (x) => {
  return [0, -x]
}

const firstExtrude = startSketchOn('XY')
  |> startProfileAt([0,0], %)
  |> line([0, l], %)
  |> line([w, 0], %)
  |> line(thing(8), %)
  |> close(%)
  |> extrude(h, %)"#;

        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_execute_with_function_call_in_pipe() {
        let ast = r#"const w = 20
const l = 8
const h = 10

fn other_thing = (y) => {
  return -y
}

fn thing = (x) => {
  return other_thing(x)
}

const firstExtrude = startSketchOn('XY')
  |> startProfileAt([0,0], %)
  |> line([0, l], %)
  |> line([w, 0], %)
  |> line([0, thing(8)], %)
  |> close(%)
  |> extrude(h, %)"#;

        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_execute_with_function_sketch() {
        let ast = r#"fn box = (h, l, w) => {
 const myBox = startSketchOn('XY')
    |> startProfileAt([0,0], %)
    |> line([0, l], %)
    |> line([w, 0], %)
    |> line([0, -l], %)
    |> close(%)
    |> extrude(h, %)

  return myBox
}

const fnBox = box(3, 6, 10)"#;

        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_get_member_of_object_with_function_period() {
        let ast = r#"fn box = (obj) => {
 let myBox = startSketchOn('XY')
    |> startProfileAt(obj.start, %)
    |> line([0, obj.l], %)
    |> line([obj.w, 0], %)
    |> line([0, -obj.l], %)
    |> close(%)
    |> extrude(obj.h, %)

  return myBox
}

const thisBox = box({start: [0,0], l: 6, w: 10, h: 3})
"#;
        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_get_member_of_object_with_function_brace() {
        let ast = r#"fn box = (obj) => {
 let myBox = startSketchOn('XY')
    |> startProfileAt(obj["start"], %)
    |> line([0, obj["l"]], %)
    |> line([obj["w"], 0], %)
    |> line([0, -obj["l"]], %)
    |> close(%)
    |> extrude(obj["h"], %)

  return myBox
}

const thisBox = box({start: [0,0], l: 6, w: 10, h: 3})
"#;
        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_get_member_of_object_with_function_mix_period_brace() {
        let ast = r#"fn box = (obj) => {
 let myBox = startSketchOn('XY')
    |> startProfileAt(obj["start"], %)
    |> line([0, obj["l"]], %)
    |> line([obj["w"], 0], %)
    |> line([10 - obj["w"], -obj.l], %)
    |> close(%)
    |> extrude(obj["h"], %)

  return myBox
}

const thisBox = box({start: [0,0], l: 6, w: 10, h: 3})
"#;
        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    #[ignore] // ignore til we get loops
    async fn test_execute_with_function_sketch_loop_objects() {
        let ast = r#"fn box = (obj) => {
let myBox = startSketchOn('XY')
    |> startProfileAt(obj.start, %)
    |> line([0, obj.l], %)
    |> line([obj.w, 0], %)
    |> line([0, -obj.l], %)
    |> close(%)
    |> extrude(obj.h, %)

  return myBox
}

for var in [{start: [0,0], l: 6, w: 10, h: 3}, {start: [-10,-10], l: 3, w: 5, h: 1.5}] {
  const thisBox = box(var)
}"#;

        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    #[ignore] // ignore til we get loops
    async fn test_execute_with_function_sketch_loop_array() {
        let ast = r#"fn box = (h, l, w, start) => {
 const myBox = startSketchOn('XY')
    |> startProfileAt([0,0], %)
    |> line([0, l], %)
    |> line([w, 0], %)
    |> line([0, -l], %)
    |> close(%)
    |> extrude(h, %)

  return myBox
}


for var in [[3, 6, 10, [0,0]], [1.5, 3, 5, [-10,-10]]] {
  const thisBox = box(var[0], var[1], var[2], var[3])
}"#;

        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_get_member_of_array_with_function() {
        let ast = r#"fn box = (array) => {
 let myBox =startSketchOn('XY')
    |> startProfileAt(array[0], %)
    |> line([0, array[1]], %)
    |> line([array[2], 0], %)
    |> line([0, -array[1]], %)
    |> close(%)
    |> extrude(array[3], %)

  return myBox
}

const thisBox = box([[0,0], 6, 10, 3])

"#;
        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_math_execute_with_functions() {
        let ast = r#"const myVar = 2 + min(100, -1 + legLen(5, 3))"#;
        let memory = parse_execute(ast).await.unwrap();
        assert_eq!(
            serde_json::json!(5.0),
            memory.root.get("myVar").unwrap().get_json_value().unwrap()
        );
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_math_execute() {
        let ast = r#"const myVar = 1 + 2 * (3 - 4) / -5 + 6"#;
        let memory = parse_execute(ast).await.unwrap();
        assert_eq!(
            serde_json::json!(7.4),
            memory.root.get("myVar").unwrap().get_json_value().unwrap()
        );
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_math_execute_start_negative() {
        let ast = r#"const myVar = -5 + 6"#;
        let memory = parse_execute(ast).await.unwrap();
        assert_eq!(
            serde_json::json!(1.0),
            memory.root.get("myVar").unwrap().get_json_value().unwrap()
        );
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_math_execute_with_pi() {
        let ast = r#"const myVar = pi() * 2"#;
        let memory = parse_execute(ast).await.unwrap();
        assert_eq!(
            serde_json::json!(std::f64::consts::TAU),
            memory.root.get("myVar").unwrap().get_json_value().unwrap()
        );
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_math_define_decimal_without_leading_zero() {
        let ast = r#"let thing = .4 + 7"#;
        let memory = parse_execute(ast).await.unwrap();
        assert_eq!(
            serde_json::json!(7.4),
            memory.root.get("thing").unwrap().get_json_value().unwrap()
        );
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_zero_param_fn() {
        let ast = r#"const sigmaAllow = 35000 // psi
const leg1 = 5 // inches
const leg2 = 8 // inches
fn thickness = () => { return 0.56 }

const bracket = startSketchOn('XY')
  |> startProfileAt([0,0], %)
  |> line([0, leg1], %)
  |> line([leg2, 0], %)
  |> line([0, -thickness()], %)
  |> line([-leg2 + thickness(), 0], %)
"#;
        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_math_negative_variable_in_binary_expression() {
        let ast = r#"const sigmaAllow = 35000 // psi
const width = 1 // inch

const p = 150 // lbs
const distance = 6 // inches
const FOS = 2

const leg1 = 5 // inches
const leg2 = 8 // inches

const thickness_squared = distance * p * FOS * 6 / sigmaAllow
const thickness = 0.56 // inches. App does not support square root function yet

const bracket = startSketchOn('XY')
  |> startProfileAt([0,0], %)
  |> line([0, leg1], %)
  |> line([leg2, 0], %)
  |> line([0, -thickness], %)
  |> line([-leg2 + thickness, 0], %)
"#;
        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_math_doubly_nested_parens() {
        let ast = r#"const sigmaAllow = 35000 // psi
const width = 4 // inch
const p = 150 // Force on shelf - lbs
const distance = 6 // inches
const FOS = 2
const leg1 = 5 // inches
const leg2 = 8 // inches
const thickness_squared = (distance * p * FOS * 6 / (sigmaAllow - width))
const thickness = 0.32 // inches. App does not support square root function yet
const bracket = startSketchOn('XY')
  |> startProfileAt([0,0], %)
    |> line([0, leg1], %)
  |> line([leg2, 0], %)
  |> line([0, -thickness], %)
  |> line([-1 * leg2 + thickness, 0], %)
  |> line([0, -1 * leg1 + thickness], %)
  |> close(%)
  |> extrude(width, %)
"#;
        parse_execute(ast).await.unwrap();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_math_nested_parens_one_less() {
        let ast = r#"const sigmaAllow = 35000 // psi
const width = 4 // inch
const p = 150 // Force on shelf - lbs
const distance = 6 // inches
const FOS = 2
const leg1 = 5 // inches
const leg2 = 8 // inches
const thickness_squared = distance * p * FOS * 6 / (sigmaAllow - width)
const thickness = 0.32 // inches. App does not support square root function yet
const bracket = startSketchOn('XY')
  |> startProfileAt([0,0], %)
    |> line([0, leg1], %)
  |> line([leg2, 0], %)
  |> line([0, -thickness], %)
  |> line([-1 * leg2 + thickness, 0], %)
  |> line([0, -1 * leg1 + thickness], %)
  |> close(%)
  |> extrude(width, %)
"#;
        parse_execute(ast).await.unwrap();
    }

    #[test]
    fn test_assign_args_to_params() {
        // Set up a little framework for this test.
        fn mem(number: usize) -> MemoryItem {
            MemoryItem::UserVal(UserVal {
                value: number.into(),
                meta: Default::default(),
            })
        }
        fn ident(s: &'static str) -> Identifier {
            Identifier {
                start: 0,
                end: 0,
                name: s.to_owned(),
            }
        }
        fn opt_param(s: &'static str) -> Parameter {
            Parameter {
                identifier: ident(s),
                type_: None,
                optional: true,
            }
        }
        fn req_param(s: &'static str) -> Parameter {
            Parameter {
                identifier: ident(s),
                type_: None,
                optional: false,
            }
        }
        fn additional_program_memory(items: &[(String, MemoryItem)]) -> ProgramMemory {
            let mut program_memory = ProgramMemory::new();
            for (name, item) in items {
                program_memory.root.insert(name.to_string(), item.clone());
            }
            program_memory
        }
        // Declare the test cases.
        for (test_name, params, args, expected) in [
            ("empty", Vec::new(), Vec::new(), Ok(ProgramMemory::new())),
            (
                "all params required, and all given, should be OK",
                vec![req_param("x")],
                vec![mem(1)],
                Ok(additional_program_memory(&[("x".to_owned(), mem(1))])),
            ),
            (
                "all params required, none given, should error",
                vec![req_param("x")],
                vec![],
                Err(KclError::Semantic(KclErrorDetails {
                    source_ranges: vec![SourceRange([0, 0])],
                    message: "Expected 1 arguments, got 0".to_owned(),
                })),
            ),
            (
                "all params optional, none given, should be OK",
                vec![opt_param("x")],
                vec![],
                Ok(additional_program_memory(&[(
                    "x".to_owned(),
                    MemoryItem::from(&KclNone::default()),
                )])),
            ),
            (
                "mixed params, too few given",
                vec![req_param("x"), opt_param("y")],
                vec![],
                Err(KclError::Semantic(KclErrorDetails {
                    source_ranges: vec![SourceRange([0, 0])],
                    message: "Expected 1-2 arguments, got 0".to_owned(),
                })),
            ),
            (
                "mixed params, minimum given, should be OK",
                vec![req_param("x"), opt_param("y")],
                vec![mem(1)],
                Ok(additional_program_memory(&[
                    ("x".to_owned(), mem(1)),
                    ("y".to_owned(), MemoryItem::from(&KclNone::default())),
                ])),
            ),
            (
                "mixed params, maximum given, should be OK",
                vec![req_param("x"), opt_param("y")],
                vec![mem(1), mem(2)],
                Ok(additional_program_memory(&[
                    ("x".to_owned(), mem(1)),
                    ("y".to_owned(), mem(2)),
                ])),
            ),
            (
                "mixed params, too many given",
                vec![req_param("x"), opt_param("y")],
                vec![mem(1), mem(2), mem(3)],
                Err(KclError::Semantic(KclErrorDetails {
                    source_ranges: vec![SourceRange([0, 0])],
                    message: "Expected 1-2 arguments, got 3".to_owned(),
                })),
            ),
        ] {
            // Run each test.
            let func_expr = &FunctionExpression {
                start: 0,
                end: 0,
                params,
                body: crate::ast::types::Program {
                    start: 0,
                    end: 0,
                    body: Vec::new(),
                    non_code_meta: Default::default(),
                },
                return_type: None,
            };
            let actual = assign_args_to_params(func_expr, args, ProgramMemory::new());
            assert_eq!(
                actual, expected,
                "failed test '{test_name}':\ngot {actual:?}\nbut expected\n{expected:?}"
            );
        }
    }

    #[test]
    fn test_serialize_memory_item() {
        let mem = MemoryItem::ExtrudeGroups {
            value: Default::default(),
        };
        let json = serde_json::to_string(&mem).unwrap();
        assert_eq!(json, r#"{"type":"ExtrudeGroups","value":[]}"#);
    }
}
