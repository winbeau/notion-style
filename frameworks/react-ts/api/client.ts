/**
 * Unified Bare-JSON + FastAPI `{ detail }` + Mock-Capable Fetcher (React-TS & Vue-TS)
 * Distilled from xju-feiyue `src/api/client.ts` + xju-feiyue-cs336 SSE streaming.
 *
 * Contract:
 * - Bare JSON responses (no `{ code, data }` envelope)
 * - camelCase wire keys + ISO-8601 UTC `Z` timestamps
 * - FastAPI `{"detail": "..."}` error extraction into `ApiError`
 * - Zero business-code diff when switching from in-memory mock to real FastAPI
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ParserLike<T> {
  parse: (data: unknown) => T
}

export interface CursorPage<T> {
  items: T[]
  nextCursor: string | null
}

export class ApiError extends Error {
  override readonly name = 'ApiError'
  constructor(
    message: string,
    public readonly status: number,
    public readonly path: string,
  ) {
    super(message)
  }
}

export type QueryValue =
  | string
  | number
  | boolean
  | ReadonlyArray<string | number | boolean>
  | undefined

export type MockReq = {
  method: HttpMethod
  path: string
  query: URLSearchParams
  body: unknown
  headers: Headers
}

export type MockHandler = (req: MockReq) => Promise<unknown> | unknown

const mockHandlers = new Map<string, MockHandler>()
const mockPatterns: Array<{ method: HttpMethod; regex: RegExp; handler: MockHandler }> = []

export function registerMock(method: HttpMethod, path: string, handler: MockHandler): void {
  if (path.includes(':')) {
    const pattern = path.replace(/:[A-Za-z_]+/g, '[^/]+')
    mockPatterns.push({ method, regex: new RegExp(`^${pattern}$`), handler })
    return
  }
  mockHandlers.set(`${method} ${path}`, handler)
}

function findMock(method: HttpMethod, path: string): MockHandler | undefined {
  return (
    mockHandlers.get(`${method} ${path}`) ??
    mockPatterns.find((p) => p.method === method && p.regex.test(path))?.handler
  )
}

export interface RequestOptions<T> {
  method: HttpMethod
  path: string
  schema?: ParserLike<T>
  body?: unknown
  query?: Record<string, QueryValue>
  headers?: Record<string, string>
  baseURL?: string
  useMock?: boolean
}

export async function request<T>(opts: RequestOptions<T>): Promise<T> {
  const queryParams = new URLSearchParams()
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v === undefined) continue
      if (Array.isArray(v)) {
        for (const item of v) queryParams.append(k, String(item))
      } else {
        queryParams.set(k, String(v))
      }
    }
  }

  let raw: unknown

  if (opts.useMock) {
    const handler = findMock(opts.method, opts.path)
    if (!handler) {
      throw new ApiError(`No mock registered for ${opts.method} ${opts.path}`, 501, opts.path)
    }
    raw = await handler({
      method: opts.method,
      path: opts.path,
      query: queryParams,
      body: opts.body,
      headers: new Headers(opts.headers ?? {}),
    })
  } else {
    const url = new URL(`${opts.baseURL ?? ''}${opts.path}`, window.location.origin)
    queryParams.forEach((v, k) => url.searchParams.append(k, v))
    const isFormData = typeof FormData !== 'undefined' && opts.body instanceof FormData
    const init: RequestInit = {
      method: opts.method,
      headers: isFormData
        ? { ...(opts.headers ?? {}) }
        : { 'Content-Type': 'application/json', ...(opts.headers ?? {}) },
    }
    if (opts.body !== undefined) {
      init.body = isFormData ? (opts.body as FormData) : JSON.stringify(opts.body)
    }
    const res = await fetch(url, init)
    if (!res.ok) {
      let message = `HTTP ${res.status}`
      try {
        const errBody = (await res.json()) as { detail?: unknown } | null
        if (errBody && typeof errBody.detail === 'string' && errBody.detail.length > 0) {
          message = errBody.detail
        }
      } catch {
        /* fallback to HTTP status */
      }
      throw new ApiError(message, res.status, opts.path)
    }
    raw = res.status === 204 ? null : await res.json()
  }

  return opts.schema ? opts.schema.parse(raw) : (raw as T)
}

/**
 * Lightweight SSE `ReadableStream` parser matching FastAPI `sse.py` event frames.
 */
export async function streamSse(
  url: string,
  init: RequestInit,
  onEvent: (event: string, data: string) => void,
): Promise<void> {
  const res = await fetch(url, init)
  if (!res.ok || !res.body) {
    throw new ApiError(`SSE HTTP ${res.status}`, res.status, url)
  }
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const chunks = buffer.split('\n\n')
    buffer = chunks.pop() ?? ''
    for (const chunk of chunks) {
      let eventName = 'message'
      const dataLines: string[] = []
      for (const line of chunk.split('\n')) {
        if (line.startsWith('event:')) eventName = line.slice(6).trim()
        else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim())
      }
      if (dataLines.length > 0) onEvent(eventName, dataLines.join('\n'))
    }
  }
}
