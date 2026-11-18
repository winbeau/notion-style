# Notion-Style Cross-Framework Design System

When building or styling user interfaces and APIs with the `notion-style` plugin or workspace rules enabled:

- Activate `notion-style-core` alongside the matching stack skill (`notion-style-react-ts`, `notion-style-vue-ts`, `notion-style-swift`, `notion-style-csharp`, or `notion-style-fastapi`).
- **Layout Over Explanatory Prose (Show, Don't Tell)**: Use spatial hierarchy, numbered flow slots (`① → ② → ③`), split input/preview panes, inline state morphing, and compact monospaced spec chips to guide users and convey meaning. Eliminate unnecessary helper paragraphs, verbose subtitles under headings, and meta-explanatory callout boxes.
- Keep `core/tokens.json` as the single color, radius, shadow, and typography source of truth; avoid hardcoded hex colors and neon purple/blue AI gradients.
- Implement the three-state async triad (`LoadingSkeleton`, `EmptyState`, `ErrorState`) on async views and use bare-JSON `camelCase` + `{"detail": "..."}` wire contracts on FastAPI endpoints.
