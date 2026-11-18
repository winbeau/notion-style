"""Canonical Pydantic v2 wire schemas (camelCase + ISO-8601 UTC Z + CursorPage).

Distilled from `xju-feiyue/backend/app/schemas/_base.py` and `BACKEND_SPEC.md`.
"""
from __future__ import annotations

from collections.abc import Callable, Sequence
from datetime import datetime, timezone
from typing import Annotated, Generic, Literal, TypeVar

from pydantic import BaseModel, ConfigDict, Field, PlainSerializer

T = TypeVar("T")


def to_camel(s: str) -> str:
    head, *tail = s.split("_")
    return head + "".join(part.title() for part in tail)


def _utc_iso_z(value: datetime) -> str:
    """Always emit ISO-8601 UTC string ending in `Z` (handles naive SQLite datetimes)."""
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


UtcDateTime = Annotated[datetime, PlainSerializer(_utc_iso_z, return_type=str)]


class CamelModel(BaseModel):
    """Base schema emitting camelCase JSON while accepting both casings on input."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class SnakeModel(BaseModel):
    """Base schema preserving snake_case verbatim for external dataset exports."""

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )


class ErrorDetail(BaseModel):
    detail: str


class CursorPage(CamelModel, Generic[T]):
    items: list[T]
    next_cursor: str | None = Field(default=None)


class DiffSegment(CamelModel):
    type: Literal["equal", "add", "del"]
    text: str


def paginate_cursor(
    rows: Sequence[T],
    *,
    limit: int,
    get_id: Callable[[T], str],
) -> CursorPage[T]:
    """Slice `limit + 1` queried rows into a `CursorPage[T]`."""
    has_more = len(rows) > limit
    sliced = list(rows[:limit])
    next_cursor = get_id(sliced[-1]) if has_more and sliced else None
    return CursorPage(items=sliced, next_cursor=next_cursor)
