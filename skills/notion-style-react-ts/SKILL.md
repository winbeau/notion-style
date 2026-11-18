---
name: notion-style-react-ts
description: >-
  Scaffolds and styles React 18/19 + TypeScript (strict) + Tailwind v3.4 + shadcn/ui
  applications in the Notion-Style paradigm. Provides CSS token + shadcn HSL bridge setup,
  CategoryBadge, StatusBadge, NotionCard, CodeBlock, LoadingSkeleton/EmptyState/ErrorState,
  compositor rAF motion hooks, and Zod mock/real API client. Use when building or refactoring
  React + TypeScript frontends; do not use for Vue, Swift, or C# UI code.
---

# Notion-Style for React + TypeScript

Follow this workflow when building or styling React + TypeScript applications. Also adhere to [`notion-style-core`](../notion-style-core/SKILL.md).

## 1. Stack & Compiler Guardrails

- **TypeScript Strict Quartet**: Enable `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`, `noImplicitOverride: true` in `tsconfig.app.json`.
- **Tailwind v3.4 + Preset**: Extend [`frameworks/react-ts/tailwind.preset.ts`](../../frameworks/react-ts/tailwind.preset.ts) with `darkMode: ['class']`.
- **Single Color Source**: Import [`core/generated/tokens.css`](../../core/generated/tokens.css) + [`core/css/prose-notion.css`](../../core/css/prose-notion.css) + [`core/css/scrollbar-notion.css`](../../core/css/scrollbar-notion.css) in `main.tsx` or `globals.css`. Because `tokens.css` defines both `--color-*` and auto-derived shadcn `--background / --primary` HSL slots, never hardcode hex literals in JSX.

## 2. Drop-In Reusable Primitives

Copy or import directly from [`frameworks/react-ts/`](../../frameworks/react-ts/index.ts):

1. **Buttons & Cards**: `NotionButton` (`primary` | `secondary` | `outline` | `ghost` | `danger` | `success`), `NotionCard`, `NotionArticleCard` ([`NotionCard.tsx`](../../frameworks/react-ts/components/NotionCard.tsx)).
2. **Semantic Badges**: `CategoryBadge` (`dot` | `chip` | `icon-chip` | `full`) & `StatusBadge` ([`Badges.tsx`](../../frameworks/react-ts/components/Badges.tsx)).
3. **Async Triad**: `LoadingSkeleton` (`list` | `card` | `paragraph`), `EmptyState`, `ErrorState` ([`StateTriad.tsx`](../../frameworks/react-ts/components/StateTriad.tsx)).
4. **Prose & Code**: Wrap Markdown output in `<div className="prose-notion">` and render fenced blocks with [`CodeBlock.tsx`](../../frameworks/react-ts/components/CodeBlock.tsx).
5. **Theme & Motion**: `useNotionTheme()` ([`useNotionTheme.ts`](../../frameworks/react-ts/hooks/useNotionTheme.ts)) toggles `html.dark`; `useScrollProgressVar()` ([`motion.ts`](../../frameworks/react-ts/hooks/motion.ts)) drives compositor-only scroll animations.
6. **Data Layer**: Route all HTTP calls through `request<T>({ method, path, schema })` ([`api/client.ts`](../../frameworks/react-ts/api/client.ts)) for automatic Zod boundary parsing, FastAPI `{ detail }` error extraction, `registerMock()` dev mocking, and `streamSse()` SSE streaming.

## 3. Verification Checklist

- **Layout as Guidance**: Verify section headers have zero redundant subtitle paragraphs; express workflows via numbered slots (`① → ② → ③`), split panes, or compact mono spec pills.
- Run `tsc -b --noEmit` to verify strict TypeScript compliance.
- Toggle `html.dark` and verify zero hardcoded white/black contrast regressions.
- Confirm every query view renders `LoadingSkeleton`, `EmptyState`, and `ErrorState` in-place within the same container.
