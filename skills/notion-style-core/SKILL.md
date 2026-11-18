---
name: notion-style-core
description: >-
  Applies the shared Notion-Style cross-framework design paradigm: warm editorial paper
  light theme (#ffffff/#f7f6f3/#37352f), neutral GitHub/VSCode dark theme (#0d1117/#161b22),
  7 category accents, 4 status triads, Source Serif 4 + Inter Tight + JetBrains Mono
  typography, three-state async UI (Loading/Empty/Error), and bare-JSON {detail} wire contract.
  Use when designing, scaffolding, reviewing, or micro-tuning UI/API style across any framework.
---

# Notion-Style Core Design Paradigm

Use this skill to establish or audit visual, interaction, and wire-format consistency before writing framework-specific code.

## 1. Non-Negotiable Visual Rules

1. **No AI Neon Purple/Blue Gradients**:
   - **Light (`:root`)**: `#ffffff` canvas, `#f7f6f3` subtle surface, `#f1f1ef` hover, `#37352f` primary ink, `#787774` muted text, `#edece9` 1px border, `#37352f` charcoal primary CTA (or micro-tuned brand hex), `#2383e2` link/focus.
   - **Dark (`.dark`)**: `#0d1117` canvas, `#161b22` subtle surface, `#21262d` elevated popover, `#e6edf3` primary ink, `#8b949e` muted text, `#30363d` border, `#388bfd` primary CTA & focus.
2. **Tri-Font Division**:
   - **UI Controls & Dense Tables**: `Inter Tight / Geist / PingFang SC` (`15px`, line-height `1.5`).
   - **Brand Marks, Card Titles & Long-Form Prose (`.prose-notion`)**: `Source Serif 4 / Noto Serif SC` (`16px`, line-height `1.75`, max reading width `720px`).
   - **Code, Shortcuts, Eyebrows & IDs**: `JetBrains Mono / SF Mono`.
3. **1px Hairline Border > Heavy Drop Shadows**:
   - Flat cards use `1px solid var(--color-border)` + `0 1px 2px rgba(0,0,0,0.04)`. Reserve medium/large shadows strictly for popovers and dialogs.
4. **Universal 4-State Semantic Triads (`fg` + `12-15% bg` + `32% border`)**:
   - Reuse `success`, `warning`, `danger`, `neutral` across form validation, OJ verdicts, AI diffs, and status pills.

## 2. Mandatory Behavioral Contracts

- **Async Three-State Triad**: Every async panel/page MUST implement `LoadingSkeleton` (`role="status"`), `EmptyState`, and `ErrorState` (`role="alert"` + retry button). Never leave blank containers or call `window.alert()`.
- **Wire Contract**: Bare JSON responses (no `{ code, data }` wrapper), `camelCase` keys, `ISO-8601 UTC` timestamps ending in `Z`, `{"detail": "<msg>"}` error payloads, and `{ items, nextCursor }` cursor pagination.
- **Motion & A11y**: `150ms ease` transitions, `rAF` CSS-variable scroll progress, mandatory `@media (prefers-reduced-motion: reduce)` short-circuit, and `html { caret-color: transparent }` re-enabled only on editable inputs.

## 3. Micro-Tuning Workflow (30 Seconds)

1. Edit canonical source: [`core/tokens.json`](../../core/tokens.json) (e.g. switch radius preset between `compact` `4/6/8`, `editorial` `6/8/12`, or `native` `8/12/16`, or tweak `themes.light.brand.primary`).
2. Recompile all 5 framework targets:
   ```bash
   node scripts/build-tokens.mjs
   node scripts/build-tokens.mjs --check
   ```
3. Deep spec & repo lineage references:
   - [`core/specs/PARADIGM.md`](../../core/specs/PARADIGM.md)
   - [`core/specs/REPO_LINEAGE.md`](../../core/specs/REPO_LINEAGE.md)
