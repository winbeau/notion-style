"""Static upload hardening & CORS conventions (from xju-feiyue `main.py`)."""
from __future__ import annotations

from pathlib import PurePosixPath
from typing import Final

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .errors import ApiException

# Stored-XSS defense #1: reject active browser-executable markup extensions at upload time.
DENY_UPLOAD_EXTS: Final[frozenset[str]] = frozenset(
    {".svg", ".html", ".htm", ".xhtml", ".xml", ".js", ".mjs"}
)


def validate_upload_filename(filename: str) -> str:
    ext = PurePosixPath(filename).suffix.lower()
    if ext in DENY_UPLOAD_EXTS:
        raise ApiException(400, f"不允许上传可执行标记格式文件 ({ext})")
    return filename


class HardenedStaticFiles(StaticFiles):
    """StaticFiles mount that always attaches `X-Content-Type-Options: nosniff`."""

    async def get_response(self, path: str, scope):  # type: ignore[override]
        response = await super().get_response(path, scope)
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        return response


def configure_notion_cors(app: FastAPI, origins: list[str]) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
