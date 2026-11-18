---
name: notion-style-fastapi
description: >-
  Scaffolds and standardizes Python FastAPI backends paired with Notion-Style frontends
  (distilled from xju-feiyue backend and BACKEND_SPEC.md). Enforces bare-JSON responses,
  CamelModel camelCase wire serialization, UtcDateTime ISO-8601 Z timestamps, unified
  {"detail": "<msg>"} error handlers (including 422), CursorPage pagination, HardenedStaticFiles
  nosniff upload defense, and SSE streaming. Use when building or reviewing FastAPI services.
---

# Notion-Style for Python FastAPI

Use this skill when building or refactoring FastAPI backends that serve React-TS, Vue-TS, Swift, or C# Notion-Style clients. Also adhere to [`notion-style-core`](../notion-style-core/SKILL.md).

## 1. Wire-Format Rules (Byte-for-Byte Contract)

1. **Bare JSON Responses**: Return Pydantic models or lists directly (`200` / `201` / `204`). Never wrap responses in `{ "code": 0, "data": ... }`.
2. **`CamelModel` + `UtcDateTime`**: Inherit all request/response DTOs from `CamelModel` ([`schemas.py`](../../frameworks/fastapi/notion_style_api/schemas.py)) so Python code stays idiomatic `snake_case` while JSON wire output is `camelCase`. Annotate all timestamps with `UtcDateTime` so naive SQLite datetimes still serialize as `YYYY-MM-DDTHH:MM:SSZ`.
3. **Unified `{"detail": "<msg>"}` Errors**: Call `register_notion_exception_handlers(app)` ([`errors.py`](../../frameworks/fastapi/notion_style_api/errors.py)) and raise `ApiException(status_code, detail)`. Even Pydantic 422 validation errors flatten into `{"detail": "field: message"}` so frontend toast/`ErrorState` components render human-readable strings without special-casing arrays.
4. **Cursor Pagination**: Query `limit + 1` rows ordered deterministically and return `paginate_cursor(rows, limit=limit, get_id=lambda r: r.id)` → `{ "items": [...], "nextCursor": "..." | null }`.

## 2. Security & Streaming Helpers

Copy or install [`frameworks/fastapi/notion_style_api/`](../../frameworks/fastapi/notion_style_api/__init__.py):

- **Static Upload Hardening** ([`security.py`](../../frameworks/fastapi/notion_style_api/security.py)): Validate filenames with `validate_upload_filename()` (blocks `.svg/.html/.htm/.xml/.js`) and mount uploads via `HardenedStaticFiles` (`X-Content-Type-Options: nosniff`).
- **Proxy-Safe SSE Streaming** ([`sse.py`](../../frameworks/fastapi/notion_style_api/sse.py)): Emit frames with `format_sse_event(payload, event=...)` and wrap async iterators with `sse_response()` (`X-Accel-Buffering: no`), matching `streamSse()` in `frameworks/react-ts/api/client.ts`.
- **Server-Side Brand Tokens** ([`tokens.py`](../../frameworks/fastapi/notion_style_api/tokens.py)): Import `CategoryId`, `StatusId`, `LIGHT_PALETTE`, `DARK_PALETTE`, and `notion_status_page_css()`.

## 3. Verification Checklist

- Run `pytest` / `python3 -m unittest` to verify `CamelModel` serialization, `UtcDateTime` `Z` suffix, 422 `{"detail": ...}` flattening, and upload extension rejection.
