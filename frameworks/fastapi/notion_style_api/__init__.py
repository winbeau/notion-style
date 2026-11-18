"""Notion-Style FastAPI Reusable Foundation."""
from .errors import ApiException, register_notion_exception_handlers
from .schemas import CamelModel, CursorPage, DiffSegment, ErrorDetail, SnakeModel, UtcDateTime, paginate_cursor, to_camel
from .security import DENY_UPLOAD_EXTS, HardenedStaticFiles, configure_notion_cors, validate_upload_filename
from .sse import format_sse_event, sse_response
from .tokens import CATEGORY_IDS, DARK_PALETTE, LIGHT_PALETTE, STATUS_IDS, CategoryId, StatusId, notion_status_page_css

__all__ = [
    "ApiException",
    "CATEGORY_IDS",
    "CamelModel",
    "CategoryId",
    "CursorPage",
    "DARK_PALETTE",
    "DENY_UPLOAD_EXTS",
    "DiffSegment",
    "ErrorDetail",
    "HardenedStaticFiles",
    "LIGHT_PALETTE",
    "STATUS_IDS",
    "SnakeModel",
    "StatusId",
    "UtcDateTime",
    "configure_notion_cors",
    "format_sse_event",
    "notion_status_page_css",
    "paginate_cursor",
    "register_notion_exception_handlers",
    "sse_response",
    "to_camel",
    "validate_upload_filename",
]
