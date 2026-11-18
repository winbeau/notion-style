"""Unified `{"detail": "<msg>"}` exception handling for FastAPI.

Ensures React-TS / Vue-TS / Swift / C# clients always receive a single readable
`detail` string even on Pydantic 422 validation errors.
"""
from __future__ import annotations

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class ApiException(HTTPException):
    """Domain exception emitting `{"detail": message}` with HTTP status."""

    def __init__(self, status_code: int, detail: str) -> None:
        super().__init__(status_code=status_code, detail=detail)


def register_notion_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(RequestValidationError)
    async def _validation_exception_handler(
        _request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        parts: list[str] = []
        for err in exc.errors():
            loc = ".".join(str(x) for x in err.get("loc", ()) if x != "body")
            msg = err.get("msg", "参数校验失败")
            parts.append(f"{loc}: {msg}" if loc else msg)
        summary = "；".join(parts) if parts else "请求参数格式不正确"
        return JSONResponse(status_code=422, content={"detail": summary})
