import { UnitLength } from 'wasm-lib/kcl/bindings/UnitLength'

export enum LspWorker {
  Kcl = 'kcl',
  Copilot = 'copilot',
}
export interface KclWorkerOptions {
  wasmUrl: string
  token: string
  baseUnit: UnitLength
  apiBaseUrl: string
}

export interface CopilotWorkerOptions {
  wasmUrl: string
  token: string
  apiBaseUrl: string
}

export enum LspWorkerEventType {
  Init = 'init',
  Call = 'call',
}

export interface LspWorkerEvent {
  eventType: LspWorkerEventType
  eventData: Uint8Array | KclWorkerOptions | CopilotWorkerOptions
  worker: LspWorker
}
