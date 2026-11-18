"""AUTO-GENERATED FROM core/tokens.json — DO NOT EDIT DIRECTLY.

Provides canonical Notion-Style palette & typography tokens for FastAPI backends:
- Server-rendered status / OpenAPI docs pages
- Transactional HTML emails & SVG/PDF report badges
- Shared CategoryId / StatusId Literal types aligned byte-for-byte with TS/Swift/C#
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Final, Literal

CategoryId = Literal["research", "course", "recommend", "competition", "kaggle", "tools", "life"]
StatusId = Literal["success", "warning", "danger", "neutral"]

CATEGORY_IDS: Final[tuple[CategoryId, ...]] = ("research", "course", "recommend", "competition", "kaggle", "tools", "life",)
STATUS_IDS: Final[tuple[StatusId, ...]] = ("success", "warning", "danger", "neutral",)


@dataclass(frozen=True, slots=True)
class ThemePalette:
    bg: str
    bg_subtle: str
    bg_hover: str
    bg_elevated: str
    text: str
    text_muted: str
    text_faint: str
    border: str
    border_strong: str
    primary: str
    primary_hover: str
    primary_fg: str
    link: str


LIGHT_PALETTE: Final[ThemePalette] = ThemePalette(
    bg="#ffffff",
    bg_subtle="#f7f6f3",
    bg_hover="#f1f1ef",
    bg_elevated="#ffffff",
    text="#37352f",
    text_muted="#787774",
    text_faint="#9b9a97",
    border="#edece9",
    border_strong="#dcdad4",
    primary="#37352f",
    primary_hover="#25231f",
    primary_fg="#ffffff",
    link="#2383e2",
)

DARK_PALETTE: Final[ThemePalette] = ThemePalette(
    bg="#0d1117",
    bg_subtle="#161b22",
    bg_hover="#1c2128",
    bg_elevated="#21262d",
    text="#e6edf3",
    text_muted="#8b949e",
    text_faint="#6e7681",
    border="#30363d",
    border_strong="#444c56",
    primary="#388bfd",
    primary_hover="#58a6ff",
    primary_fg="#ffffff",
    link="#58a6ff",
)

CATEGORY_LABELS: Final[dict[CategoryId, str]] = {
    "research": "科研",
    "course": "课程",
    "recommend": "推免",
    "competition": "竞赛",
    "kaggle": "数据",
    "tools": "工具",
    "life": "日常",
}


def notion_status_page_css() -> str:
    """Minimal self-contained CSS snippet for FastAPI HTML status / docs pages."""
    return (
        f":root{{--bg:{LIGHT_PALETTE.bg};--bg-subtle:{LIGHT_PALETTE.bg_subtle};"
        f"--fg:{LIGHT_PALETTE.text};--muted:{LIGHT_PALETTE.text_muted};"
        f"--border:{LIGHT_PALETTE.border};--link:{LIGHT_PALETTE.link};}}"
        "body{margin:0;padding:48px 24px;background:var(--bg-subtle);color:var(--fg);"
        "font-family:'Inter Tight', 'Geist', 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased;}"
        ".card{max-width:720px;margin:0 auto;padding:28px 32px;background:var(--bg);"
        "border:1px solid var(--border);border-radius:12px;box-shadow:0 1px 2px rgba(0, 0, 0, 0.04);}"
        "h1{font-family:'Source Serif 4', 'Noto Serif SC', Georgia, 'Songti SC', serif;margin:0 0 8px;font-size:1.75rem;}"
    )
