"""Server-Sent Events (SSE) helpers aligned with frontend `streamSse()`."""
from __future__ import annotations

import json
from collections.abc import AsyncIterator
from typing import Any

from fastapi.responses import StreamingResponse


def format_sse_event(data: Any, *, event: str = "message") -> str:
    payload = data if isinstance(data, str) else json.dumps(data, ensure_ascii=False)
    lines = [f"event: {event}"]
    for line in payload.splitlines() or [""]:
        lines.append(f"data: {line}")
    return "\n".join(lines) + "\n\n"


def sse_response(stream: AsyncIterator[str]) -> StreamingResponse:
    """Wrap an SSE generator with proxy-safe headers (`X-Accel-Buffering: no`)."""
    return StreamingResponse(
        stream,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
