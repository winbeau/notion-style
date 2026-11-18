#!/usr/bin/env node
/**
 * Multi-Target Design Token Compiler — Notion-Style
 * ---------------------------------------------------------------------------
 * Reads `core/tokens.json` (Single Source of Truth) and compiles deterministic
 * token artifacts across all 5 target ecosystems:
 *   1. core/generated/tokens.css                                (Web CSS + shadcn HSL bridge)
 *   2. core/generated/tokens.ts                                 (React-TS / Vue-TS typed tokens)
 *   3. frameworks/vue-ts/styles/element-plus-bridge.css         (Vue 3 Element Plus Light/Dark bridge)
 *   4. frameworks/swift/Sources/NotionStyleKit/GeneratedTokens.swift (macOS/iOS SwiftUI adaptive tokens)
 *   5. frameworks/csharp/NotionStyle.Wpf/Themes/NotionTokens.Light.xaml & NotionTokens.Dark.xaml (WPF XAML)
 *   6. frameworks/fastapi/notion_style_api/tokens.py            (Python FastAPI server-side tokens)
 *
 * Usage:
 *   node scripts/build-tokens.mjs           # Write all generated artifacts
 *   node scripts/build-tokens.mjs --check   # Verify artifacts are up-to-date (CI)
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE_PATH = resolve(ROOT, 'core/tokens.json')
const CHECK_MODE = process.argv.includes('--check')

/** Parse `#rrggbb` or `rgba(r, g, b, a)` into `{ r, g, b, a }` (0..255, a: 0..1). */
function parseColor(input) {
  const s = input.trim()
  if (s.startsWith('#')) {
    const hex = s.slice(1)
    const full =
      hex.length === 3
        ? hex
            .split('')
            .map((c) => c + c)
            .join('')
        : hex
    const n = Number.parseInt(full, 16)
    return {
      r: (n >> 16) & 255,
      g: (n >> 8) & 255,
      b: n & 255,
      a: 1,
    }
  }
  const m = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i)
  if (m) {
    return {
      r: Math.round(Number(m[1])),
      g: Math.round(Number(m[2])),
      b: Math.round(Number(m[3])),
      a: m[4] !== undefined ? Number(m[4]) : 1,
    }
  }
  throw new Error(`Unsupported color literal: ${input}`)
}

/** Convert `#rrggbb` to shadcn bare HSL triplet string `"H S% L%"`. */
function hexToShadcnHsl(hex) {
  const { r: r255, g: g255, b: b255 } = parseColor(hex)
  const r = r255 / 255
  const g = g255 / 255
  const b = b255 / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/** Convert parsed color to XAML `#AARRGGBB` or `#RRGGBB`. */
function toXamlHex(input) {
  const { r, g, b, a } = parseColor(input)
  const hex2 = (v) => v.toString(16).padStart(2, '0').toUpperCase()
  if (a >= 0.999) {
    return `#${hex2(r)}${hex2(g)}${hex2(b)}`
  }
  return `#${hex2(Math.round(a * 255))}${hex2(r)}${hex2(g)}${hex2(b)}`
}

/** Convert parsed color to Swift `(r, g, b, a)` tuple literal. */
function toSwiftRgba(input) {
  const { r, g, b, a } = parseColor(input)
  const f = (v) => (v / 255).toFixed(4)
  return `(${f(r)}, ${f(g)}, ${f(b)}, ${a.toFixed(2)})`
}

function pascalCase(str) {
  return str
    .split(/[-_\s]+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('')
}

/* -------------------------------------------------------------------------- */
/* 1. CSS Generator (core/generated/tokens.css)                               */
/* -------------------------------------------------------------------------- */
function generateCss(t) {
  const L = t.themes.light
  const D = t.themes.dark
  const catIds = Object.keys(t.categories)
  const statusIds = Object.keys(t.statuses)

  const renderThemeVars = (mode, theme) => {
    const lines = [
      `  /* Surfaces */`,
      `  --color-bg: ${theme.surface.bg};`,
      `  --color-bg-subtle: ${theme.surface.bgSubtle};`,
      `  --bg-hover: ${theme.surface.bgHover};`,
      `  --color-bg-elevated: ${theme.surface.bgElevated};`,
      `  --brand-panel-grid: ${theme.surface.gridLine};`,
      `  --brand-panel-glow-warm: ${theme.surface.glowWarm};`,
      `  --brand-panel-glow-cool: ${theme.surface.glowCool};`,
      ``,
      `  /* Text */`,
      `  --color-text: ${theme.text.primary};`,
      `  --color-text-muted: ${theme.text.muted};`,
      `  --color-text-faint: ${theme.text.faint};`,
      ``,
      `  /* Borders */`,
      `  --color-border: ${theme.border.subtle};`,
      `  --line-strong: ${theme.border.strong};`,
      ``,
      `  /* Brand & Focus */`,
      `  --color-primary: ${theme.brand.primary};`,
      `  --color-primary-hover: ${theme.brand.primaryHover};`,
      `  --color-primary-fg: ${theme.brand.primaryFg};`,
      `  --color-link: ${theme.brand.link};`,
      `  --color-focus: ${theme.brand.focus};`,
      ``,
      `  /* Code & Highlight */`,
      `  --code-inline-bg: ${theme.code.inlineBg};`,
      `  --code-inline-fg: ${theme.code.inlineFg};`,
      `  --highlight-flash-bg: ${theme.highlight.flashBg};`,
      ``,
      `  /* Charts */`,
      `  --chart-blue: ${theme.chart.primary};`,
      `  --chart-teal: ${theme.chart.secondary};`,
      `  --chart-grid: ${theme.chart.grid};`,
      ``,
      `  /* Shadows */`,
      `  --shadow-card: ${theme.shadow.card};`,
      `  --shadow-panel: ${theme.shadow.panel};`,
      `  --shadow-dialog: ${theme.shadow.dialog};`,
      ``,
      `  /* 7 Semantic Categories */`,
      ...catIds.map((id) => `  --cat-${id}: ${t.categories[id][mode].fg};`),
      ...catIds.map((id) => `  --tag-${id}-bg: ${t.categories[id][mode].bg};`),
      `  --tag-tool-bg: var(--tag-tools-bg);`,
      ``,
      `  /* 4 Universal Status Triads (unifies AI diff / OJ status / notice) */`,
      ...statusIds.flatMap((id) => [
        `  --status-${id}-fg: ${t.statuses[id][mode].fg};`,
        `  --status-${id}-bg: ${t.statuses[id][mode].bg};`,
        `  --status-${id}-border: ${t.statuses[id][mode].border};`,
      ]),
      `  --ai-add-fg: var(--status-success-fg);`,
      `  --ai-add-bg: var(--status-success-bg);`,
      `  --ai-add-border: var(--status-success-border);`,
      `  --ai-del-fg: var(--status-danger-fg);`,
      `  --ai-del-bg: var(--status-danger-bg);`,
      `  --ai-del-border: var(--status-danger-border);`,
      ``,
      `  /* shadcn/ui HSL Bridge (auto-derived from hex tokens) */`,
      `  --background: ${hexToShadcnHsl(theme.surface.bg)};`,
      `  --foreground: ${hexToShadcnHsl(theme.text.primary)};`,
      `  --card: ${hexToShadcnHsl(mode === 'dark' ? theme.surface.bgSubtle : theme.surface.bg)};`,
      `  --card-foreground: ${hexToShadcnHsl(theme.text.primary)};`,
      `  --popover: ${hexToShadcnHsl(theme.surface.bgElevated)};`,
      `  --popover-foreground: ${hexToShadcnHsl(theme.text.primary)};`,
      `  --primary: ${hexToShadcnHsl(theme.brand.primary)};`,
      `  --primary-foreground: ${hexToShadcnHsl(theme.brand.primaryFg)};`,
      `  --secondary: ${hexToShadcnHsl(theme.surface.bgSubtle)};`,
      `  --secondary-foreground: ${hexToShadcnHsl(theme.text.primary)};`,
      `  --muted: ${hexToShadcnHsl(theme.surface.bgSubtle)};`,
      `  --muted-foreground: ${hexToShadcnHsl(theme.text.muted)};`,
      `  --accent: ${hexToShadcnHsl(theme.surface.bgSubtle)};`,
      `  --accent-foreground: ${hexToShadcnHsl(theme.text.primary)};`,
      `  --destructive: ${hexToShadcnHsl(t.categories.research[mode].fg)};`,
      `  --destructive-foreground: 0 0% 100%;`,
      `  --border: ${hexToShadcnHsl(theme.border.subtle)};`,
      `  --input: ${hexToShadcnHsl(theme.border.subtle)};`,
      `  --ring: ${hexToShadcnHsl(mode === 'dark' ? theme.brand.focus : theme.text.muted)};`,
    ]
    return lines.join('\n')
  }

  return [
    `/* ==========================================================================`,
    `   AUTO-GENERATED FROM core/tokens.json — DO NOT EDIT DIRECTLY`,
    `   Run \`pnpm tokens:build\` (node scripts/build-tokens.mjs) after micro-tuning.`,
    `   ========================================================================== */`,
    ``,
    `:root {`,
    renderThemeVars('light', L),
    ``,
    `  /* Typography */`,
    `  --font-sans: ${t.typography.sans};`,
    `  --font-serif: ${t.typography.serif};`,
    `  --font-mono: ${t.typography.mono};`,
    `  --ui-font-size: ${t.typography.uiFontSize};`,
    `  --prose-font-size: ${t.typography.proseFontSize};`,
    `  --line-height-ui: ${t.typography.lineHeightUi};`,
    `  --line-height-prose: ${t.typography.lineHeightProse};`,
    ``,
    `  /* Radii */`,
    `  --radius-xs: ${t.radii.xs}px;`,
    `  --radius-sm: ${t.radii.sm}px;`,
    `  --radius-md: ${t.radii.md}px;`,
    `  --radius-lg: ${t.radii.lg}px;`,
    `  --radius-xl: ${t.radii.xl}px;`,
    `  --radius-pill: ${t.radii.pill}px;`,
    `  --radius: ${t.radii.md}px;`,
    ``,
    `  /* Motion & Layout */`,
    `  --transition: ${t.motion.fast};`,
    `  --transition-spring: ${t.motion.spring};`,
    `  --layout-reading-width: ${t.layout.readingWidth}px;`,
    `  --layout-content-width: ${t.layout.contentWidth}px;`,
    `  --layout-wide-width: ${t.layout.wideWidth}px;`,
    `  --layout-header-height: ${t.layout.headerHeight}px;`,
    `  --size-target: ${t.layout.touchTarget}px;`,
    ``,
    `  /* Legacy Short Aliases (xju-feiyue / xju-OJ compatibility) */`,
    `  --bg: var(--color-bg);`,
    `  --bg-soft: var(--color-bg-subtle);`,
    `  --fg: var(--color-text);`,
    `  --fg-muted: var(--color-text-muted);`,
    `  --fg-faint: var(--color-text-faint);`,
    `  --line: var(--color-border);`,
    `  --link: var(--color-link);`,
    `  --t-fast: var(--transition);`,
    `  --font-ui: var(--font-sans);`,
    `  --r-sm: var(--radius-xs);`,
    `  --r-md: var(--radius-sm);`,
    `  --r-lg: var(--radius-md);`,
    `}`,
    ``,
    `.dark {`,
    renderThemeVars('dark', D),
    `}`,
    ``,
  ].join('\n')
}

/* -------------------------------------------------------------------------- */
/* 2. TypeScript Generator (core/generated/tokens.ts)                         */
/* -------------------------------------------------------------------------- */
function generateTs(t) {
  const catIds = Object.keys(t.categories)
  const statusIds = Object.keys(t.statuses)
  return `/* AUTO-GENERATED FROM core/tokens.json — DO NOT EDIT DIRECTLY */

export const NOTION_TOKENS = ${JSON.stringify(t, null, 2)} as const

export type ThemeMode = 'light' | 'dark'
export type RadiusPresetId = keyof typeof NOTION_TOKENS.radii.presets

export const CATEGORY_IDS = ${JSON.stringify(catIds)} as const
export type CategoryId = (typeof CATEGORY_IDS)[number]

export const STATUS_IDS = ${JSON.stringify(statusIds)} as const
export type StatusId = (typeof STATUS_IDS)[number]

export type CategoryMeta = {
  id: CategoryId
  label: string
  labelEn: string
  desc: string
  icon: string
  colorVar: \`--cat-\${CategoryId}\`
  tagBgVar: \`--tag-\${CategoryId}-bg\`
}

export const CATEGORIES: readonly CategoryMeta[] = [
${catIds
  .map((id) => {
    const c = t.categories[id]
    return `  {
    id: '${id}',
    label: ${JSON.stringify(c.label)},
    labelEn: ${JSON.stringify(c.labelEn)},
    desc: ${JSON.stringify(c.desc)},
    icon: ${JSON.stringify(c.icon)},
    colorVar: '--cat-${id}',
    tagBgVar: '--tag-${id}-bg',
  },`
  })
  .join('\n')}
] as const

export function getCategoryMeta(id: CategoryId): CategoryMeta {
  const found = CATEGORIES.find((c) => c.id === id)
  if (!found) throw new Error(\`Unknown CategoryId: \${id}\`)
  return found
}

/** Read resolved CSS custom property at runtime (useful for Canvas / ECharts / Monaco). */
export function readCssToken(varName: string, fallback = '#37352f'): string {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  return v || fallback
}
`
}

/* -------------------------------------------------------------------------- */
/* 3. Vue Element Plus Bridge (frameworks/vue-ts/styles/element-plus-bridge.css) */
/* -------------------------------------------------------------------------- */
function generateVueElementPlusCss(t) {
  return `/* ==========================================================================
   AUTO-GENERATED FROM core/tokens.json — Vue 3 Element Plus Notion Bridge
   Distilled & upgraded from xju-OJ/frontend/src/styles/feiyue-theme.less
   Supports both Light (:root) and Dark (.dark) themes automatically.
   ========================================================================== */

:root,
.dark {
  --el-color-primary: var(--color-primary);
  --el-color-primary-light-3: color-mix(in srgb, var(--color-primary) 72%, var(--color-bg));
  --el-color-primary-light-5: color-mix(in srgb, var(--color-primary) 52%, var(--color-bg));
  --el-color-primary-light-7: color-mix(in srgb, var(--color-primary) 30%, var(--color-bg));
  --el-color-primary-light-8: color-mix(in srgb, var(--color-primary) 18%, var(--color-bg));
  --el-color-primary-light-9: var(--color-bg-subtle);
  --el-color-primary-dark-2: var(--color-primary-hover);

  --el-color-success: var(--status-success-fg);
  --el-color-warning: var(--status-warning-fg);
  --el-color-danger: var(--status-danger-fg);
  --el-color-info: var(--cat-kaggle);

  --el-text-color-primary: var(--color-text);
  --el-text-color-regular: var(--color-text-muted);
  --el-text-color-secondary: var(--color-text-faint);
  --el-text-color-placeholder: var(--color-text-faint);

  --el-border-color: var(--color-border);
  --el-border-color-light: var(--color-border);
  --el-border-color-lighter: var(--color-border);

  --el-bg-color: var(--color-bg);
  --el-bg-color-page: var(--color-bg);
  --el-bg-color-overlay: var(--color-bg-elevated);
  --el-fill-color: var(--color-bg-subtle);
  --el-fill-color-light: var(--color-bg-subtle);
  --el-fill-color-blank: var(--color-bg);

  --el-box-shadow-light: var(--shadow-card);
  --el-box-shadow: var(--shadow-panel);
  --el-border-radius-base: var(--radius-sm);
  --el-border-radius-small: var(--radius-xs);
  --el-border-radius-round: var(--radius-pill);
  --el-font-family: var(--font-sans);
}

.el-button {
  min-height: ${t.layout.controlHeightMd}px;
  border-radius: var(--radius-sm);
  border-color: var(--color-border);
  color: var(--color-text);
  background: var(--color-bg);
  font-weight: 500;
  transition:
    background-color var(--transition),
    border-color var(--transition),
    color var(--transition),
    transform 150ms ease;
}
.el-button:hover {
  color: var(--color-text);
  border-color: var(--line-strong);
  background: var(--bg-hover);
}
.el-button:active {
  transform: scale(0.985);
}
.el-button--primary {
  color: var(--color-primary-fg);
  background: var(--color-primary);
  border-color: var(--color-primary);
}
.el-button--primary:hover,
.el-button--primary:focus {
  color: var(--color-primary-fg);
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}
.el-button--success {
  color: var(--status-success-fg);
  border-color: var(--status-success-border);
  background: var(--status-success-bg);
}
.el-button--warning {
  color: var(--status-warning-fg);
  border-color: var(--status-warning-border);
  background: var(--status-warning-bg);
}
.el-button--danger {
  color: var(--status-danger-fg);
  border-color: var(--status-danger-border);
  background: var(--status-danger-bg);
}

.el-input__wrapper,
.el-textarea__inner {
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  box-shadow: 0 0 0 1px var(--color-border) inset;
  transition: box-shadow var(--transition), background-color var(--transition);
}
.el-input__wrapper:hover {
  box-shadow: 0 0 0 1px var(--line-strong) inset;
}
.el-input__wrapper.is-focus,
.el-textarea__inner:focus {
  box-shadow:
    0 0 0 1px var(--color-focus) inset,
    0 0 0 3px color-mix(in srgb, var(--color-focus) 14%, transparent);
}

.el-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  box-shadow: var(--shadow-card);
}
.el-card__header {
  border-bottom: 1px solid var(--color-border);
  padding: 16px 20px;
}

.el-table {
  --el-table-border-color: var(--color-border);
  --el-table-header-bg-color: var(--color-bg-subtle);
  --el-table-row-hover-bg-color: var(--color-bg-subtle);
  color: var(--color-text);
}
.el-table th.el-table__cell {
  color: var(--color-text-muted);
  font-weight: 600;
  background: var(--color-bg-subtle);
}

.el-tag {
  border-radius: var(--radius-xs);
  border-color: transparent;
  font-weight: 500;
}
.el-tag--success { color: var(--status-success-fg); background: var(--status-success-bg); }
.el-tag--warning { color: var(--status-warning-fg); background: var(--status-warning-bg); }
.el-tag--danger  { color: var(--status-danger-fg);  background: var(--status-danger-bg); }
.el-tag--info    { color: var(--status-neutral-fg); background: var(--status-neutral-bg); }

.el-dialog {
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-bg-elevated);
  box-shadow: var(--shadow-dialog);
}
`
}

/* -------------------------------------------------------------------------- */
/* 4. SwiftUI Generator (frameworks/swift/Sources/NotionStyleKit/GeneratedTokens.swift) */
/* -------------------------------------------------------------------------- */
function generateSwift(t) {
  const L = t.themes.light
  const D = t.themes.dark
  const catIds = Object.keys(t.categories)
  const statusIds = Object.keys(t.statuses)

  const dynProp = (name, lightVal, darkVal) =>
    `    public static let ${name} = NotionDynamicColor.make(light: ${toSwiftRgba(lightVal)}, dark: ${toSwiftRgba(darkVal)})`

  return `// AUTO-GENERATED FROM core/tokens.json — DO NOT EDIT DIRECTLY
import SwiftUI
#if canImport(AppKit)
import AppKit
#elseif canImport(UIKit)
import UIKit
#endif

public enum NotionDynamicColor {
    public static func make(
        light: (Double, Double, Double, Double),
        dark: (Double, Double, Double, Double)
    ) -> Color {
        #if canImport(AppKit)
        let nsColor = NSColor(name: nil) { appearance in
            let isDark = appearance.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua
            let c = isDark ? dark : light
            return NSColor(srgbRed: c.0, green: c.1, blue: c.2, alpha: c.3)
        }
        return Color(nsColor: nsColor)
        #elseif canImport(UIKit)
        let uiColor = UIColor { traits in
            let c = traits.userInterfaceStyle == .dark ? dark : light
            return UIColor(red: c.0, green: c.1, blue: c.2, alpha: c.3)
        }
        return Color(uiColor: uiColor)
        #else
        return Color(.sRGB, red: light.0, green: light.1, blue: light.2, opacity: light.3)
        #endif
    }
}

public enum NotionTokens {
    public enum Colors {
${dynProp('bg', L.surface.bg, D.surface.bg)}
${dynProp('bgSubtle', L.surface.bgSubtle, D.surface.bgSubtle)}
${dynProp('bgHover', L.surface.bgHover, D.surface.bgHover)}
${dynProp('bgElevated', L.surface.bgElevated, D.surface.bgElevated)}
${dynProp('text', L.text.primary, D.text.primary)}
${dynProp('textMuted', L.text.muted, D.text.muted)}
${dynProp('textFaint', L.text.faint, D.text.faint)}
${dynProp('border', L.border.subtle, D.border.subtle)}
${dynProp('borderStrong', L.border.strong, D.border.strong)}
${dynProp('primary', L.brand.primary, D.brand.primary)}
${dynProp('primaryHover', L.brand.primaryHover, D.brand.primaryHover)}
${dynProp('primaryFg', L.brand.primaryFg, D.brand.primaryFg)}
${dynProp('link', L.brand.link, D.brand.link)}
${dynProp('focus', L.brand.focus, D.brand.focus)}
${dynProp('codeInlineBg', L.code.inlineBg, D.code.inlineBg)}
${dynProp('codeInlineFg', L.code.inlineFg, D.code.inlineFg)}
    }

    public enum Radius {
        public static let xs: CGFloat = ${t.radii.xs}
        public static let sm: CGFloat = ${t.radii.sm}
        public static let md: CGFloat = ${t.radii.md}
        public static let lg: CGFloat = ${t.radii.lg}
        public static let xl: CGFloat = ${t.radii.xl}
        public static let pill: CGFloat = ${t.radii.pill}
    }

    public enum Layout {
        public static let readingWidth: CGFloat = ${t.layout.readingWidth}
        public static let contentWidth: CGFloat = ${t.layout.contentWidth}
        public static let headerHeight: CGFloat = ${t.layout.headerHeight}
        public static let controlHeightSm: CGFloat = ${t.layout.controlHeightSm}
        public static let controlHeightMd: CGFloat = ${t.layout.controlHeightMd}
    }
}

public enum NotionCategory: String, CaseIterable, Sendable {
${catIds.map((id) => `    case ${id}`).join('\n')}

    public var label: String {
        switch self {
${catIds.map((id) => `        case .${id}: return ${JSON.stringify(t.categories[id].label)}`).join('\n')}
        }
    }

    public var foreground: Color {
        switch self {
${catIds
  .map(
    (id) =>
      `        case .${id}: return NotionDynamicColor.make(light: ${toSwiftRgba(t.categories[id].light.fg)}, dark: ${toSwiftRgba(t.categories[id].dark.fg)})`,
  )
  .join('\n')}
        }
    }

    public var tintBackground: Color {
        switch self {
${catIds
  .map(
    (id) =>
      `        case .${id}: return NotionDynamicColor.make(light: ${toSwiftRgba(t.categories[id].light.bg)}, dark: ${toSwiftRgba(t.categories[id].dark.bg)})`,
  )
  .join('\n')}
        }
    }
}

public enum NotionStatus: String, CaseIterable, Sendable {
${statusIds.map((id) => `    case ${id}`).join('\n')}

    public var foreground: Color {
        switch self {
${statusIds
  .map(
    (id) =>
      `        case .${id}: return NotionDynamicColor.make(light: ${toSwiftRgba(t.statuses[id].light.fg)}, dark: ${toSwiftRgba(t.statuses[id].dark.fg)})`,
  )
  .join('\n')}
        }
    }

    public var background: Color {
        switch self {
${statusIds
  .map(
    (id) =>
      `        case .${id}: return NotionDynamicColor.make(light: ${toSwiftRgba(t.statuses[id].light.bg)}, dark: ${toSwiftRgba(t.statuses[id].dark.bg)})`,
  )
  .join('\n')}
        }
    }

    public var border: Color {
        switch self {
${statusIds
  .map(
    (id) =>
      `        case .${id}: return NotionDynamicColor.make(light: ${toSwiftRgba(t.statuses[id].light.border)}, dark: ${toSwiftRgba(t.statuses[id].dark.border)})`,
  )
  .join('\n')}
        }
    }
}
`
}

/* -------------------------------------------------------------------------- */
/* 5. C# WPF XAML Generator (NotionTokens.Light.xaml & Dark.xaml)             */
/* -------------------------------------------------------------------------- */
function generateWpfXaml(t, mode) {
  const theme = t.themes[mode]
  const catIds = Object.keys(t.categories)
  const statusIds = Object.keys(t.statuses)

  const colorBrushPair = (key, rawColor) => {
    const hex = toXamlHex(rawColor)
    return [
      `    <Color x:Key="Notion.${key}.Color">${hex}</Color>`,
      `    <SolidColorBrush x:Key="Notion.${key}.Brush" Color="{StaticResource Notion.${key}.Color}" />`,
    ].join('\n')
  }

  return `<!-- AUTO-GENERATED FROM core/tokens.json (${mode.toUpperCase()} THEME) — DO NOT EDIT DIRECTLY -->
<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">

    <!-- Surfaces & Text -->
${colorBrushPair('Bg', theme.surface.bg)}
${colorBrushPair('BgSubtle', theme.surface.bgSubtle)}
${colorBrushPair('BgHover', theme.surface.bgHover)}
${colorBrushPair('BgElevated', theme.surface.bgElevated)}
${colorBrushPair('Text', theme.text.primary)}
${colorBrushPair('TextMuted', theme.text.muted)}
${colorBrushPair('TextFaint', theme.text.faint)}
${colorBrushPair('Border', theme.border.subtle)}
${colorBrushPair('BorderStrong', theme.border.strong)}

    <!-- Brand & Focus -->
${colorBrushPair('Primary', theme.brand.primary)}
${colorBrushPair('PrimaryHover', theme.brand.primaryHover)}
${colorBrushPair('PrimaryFg', theme.brand.primaryFg)}
${colorBrushPair('Link', theme.brand.link)}
${colorBrushPair('Focus', theme.brand.focus)}

    <!-- Categories -->
${catIds
  .flatMap((id) => [
    colorBrushPair(`Cat.${pascalCase(id)}.Fg`, t.categories[id][mode].fg),
    colorBrushPair(`Cat.${pascalCase(id)}.Bg`, t.categories[id][mode].bg),
  ])
  .join('\n')}

    <!-- Status Triads -->
${statusIds
  .flatMap((id) => [
    colorBrushPair(`Status.${pascalCase(id)}.Fg`, t.statuses[id][mode].fg),
    colorBrushPair(`Status.${pascalCase(id)}.Bg`, t.statuses[id][mode].bg),
    colorBrushPair(`Status.${pascalCase(id)}.Border`, t.statuses[id][mode].border),
  ])
  .join('\n')}

    <!-- Radii & Typography -->
    <CornerRadius x:Key="Notion.Radius.Xs">${t.radii.xs}</CornerRadius>
    <CornerRadius x:Key="Notion.Radius.Sm">${t.radii.sm}</CornerRadius>
    <CornerRadius x:Key="Notion.Radius.Md">${t.radii.md}</CornerRadius>
    <CornerRadius x:Key="Notion.Radius.Lg">${t.radii.lg}</CornerRadius>
    <FontFamily x:Key="Notion.Font.Sans">Inter Tight, Segoe UI Variable Text, Segoe UI, Microsoft YaHei UI</FontFamily>
    <FontFamily x:Key="Notion.Font.Serif">Source Serif 4, Noto Serif SC, Georgia, Songti SC</FontFamily>
    <FontFamily x:Key="Notion.Font.Mono">JetBrains Mono, Cascadia Mono, Consolas</FontFamily>
</ResourceDictionary>
`
}

/* -------------------------------------------------------------------------- */
/* 6. Python FastAPI Generator (frameworks/fastapi/notion_style_api/tokens.py)*/
/* -------------------------------------------------------------------------- */
function generatePython(t) {
  const L = t.themes.light
  const D = t.themes.dark
  const catIds = Object.keys(t.categories)
  const statusIds = Object.keys(t.statuses)

  return `"""AUTO-GENERATED FROM core/tokens.json — DO NOT EDIT DIRECTLY.

Provides canonical Notion-Style palette & typography tokens for FastAPI backends:
- Server-rendered status / OpenAPI docs pages
- Transactional HTML emails & SVG/PDF report badges
- Shared CategoryId / StatusId Literal types aligned byte-for-byte with TS/Swift/C#
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Final, Literal

CategoryId = Literal[${catIds.map((id) => `"${id}"`).join(', ')}]
StatusId = Literal[${statusIds.map((id) => `"${id}"`).join(', ')}]

CATEGORY_IDS: Final[tuple[CategoryId, ...]] = (${catIds.map((id) => `"${id}"`).join(', ')},)
STATUS_IDS: Final[tuple[StatusId, ...]] = (${statusIds.map((id) => `"${id}"`).join(', ')},)


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
    bg="${L.surface.bg}",
    bg_subtle="${L.surface.bgSubtle}",
    bg_hover="${L.surface.bgHover}",
    bg_elevated="${L.surface.bgElevated}",
    text="${L.text.primary}",
    text_muted="${L.text.muted}",
    text_faint="${L.text.faint}",
    border="${L.border.subtle}",
    border_strong="${L.border.strong}",
    primary="${L.brand.primary}",
    primary_hover="${L.brand.primaryHover}",
    primary_fg="${L.brand.primaryFg}",
    link="${L.brand.link}",
)

DARK_PALETTE: Final[ThemePalette] = ThemePalette(
    bg="${D.surface.bg}",
    bg_subtle="${D.surface.bgSubtle}",
    bg_hover="${D.surface.bgHover}",
    bg_elevated="${D.surface.bgElevated}",
    text="${D.text.primary}",
    text_muted="${D.text.muted}",
    text_faint="${D.text.faint}",
    border="${D.border.subtle}",
    border_strong="${D.border.strong}",
    primary="${D.brand.primary}",
    primary_hover="${D.brand.primaryHover}",
    primary_fg="${D.brand.primaryFg}",
    link="${D.brand.link}",
)

CATEGORY_LABELS: Final[dict[CategoryId, str]] = {
${catIds.map((id) => `    "${id}": ${JSON.stringify(t.categories[id].label)},`).join('\n')}
}


def notion_status_page_css() -> str:
    """Minimal self-contained CSS snippet for FastAPI HTML status / docs pages."""
    return (
        f":root{{--bg:{LIGHT_PALETTE.bg};--bg-subtle:{LIGHT_PALETTE.bg_subtle};"
        f"--fg:{LIGHT_PALETTE.text};--muted:{LIGHT_PALETTE.text_muted};"
        f"--border:{LIGHT_PALETTE.border};--link:{LIGHT_PALETTE.link};}}"
        "body{margin:0;padding:48px 24px;background:var(--bg-subtle);color:var(--fg);"
        ${JSON.stringify(`font-family:${t.typography.sans};line-height:1.6;-webkit-font-smoothing:antialiased;}`)}
        ".card{max-width:720px;margin:0 auto;padding:28px 32px;background:var(--bg);"
        ${JSON.stringify(`border:1px solid var(--border);border-radius:${t.radii.lg}px;box-shadow:${L.shadow.card};}`)}
        ${JSON.stringify(`h1{font-family:${t.typography.serif};margin:0 0 8px;font-size:1.75rem;}`)}
    )
`
}

async function main() {
  const raw = await readFile(SOURCE_PATH, 'utf8')
  const tokens = JSON.parse(raw)

  const targets = [
    ['core/generated/tokens.css', generateCss(tokens)],
    ['core/generated/tokens.ts', generateTs(tokens)],
    ['frameworks/vue-ts/styles/element-plus-bridge.css', generateVueElementPlusCss(tokens)],
    ['frameworks/swift/Sources/NotionStyleKit/GeneratedTokens.swift', generateSwift(tokens)],
    ['frameworks/csharp/NotionStyle.Wpf/Themes/NotionTokens.Light.xaml', generateWpfXaml(tokens, 'light')],
    ['frameworks/csharp/NotionStyle.Wpf/Themes/NotionTokens.Dark.xaml', generateWpfXaml(tokens, 'dark')],
    ['frameworks/fastapi/notion_style_api/tokens.py', generatePython(tokens)],
  ]

  let staleCount = 0
  for (const [relPath, content] of targets) {
    const absPath = resolve(ROOT, relPath)
    if (CHECK_MODE) {
      const existing = await readFile(absPath, 'utf8').catch(() => '')
      if (existing !== content) {
        console.error(`[STALE] ${relPath}`)
        staleCount += 1
      }
    } else {
      await mkdir(dirname(absPath), { recursive: true })
      await writeFile(absPath, content, 'utf8')
      console.log(`[WROTE] ${relPath}`)
    }
  }

  if (CHECK_MODE) {
    if (staleCount > 0) {
      console.error(`\n${staleCount} generated file(s) out of sync with core/tokens.json. Run: node scripts/build-tokens.mjs`)
      process.exit(1)
    }
    console.log(`All ${targets.length} generated token files match core/tokens.json.`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
