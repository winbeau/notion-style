import { useState } from 'react'
import { Check, ChevronRight, Code2, RotateCcw } from 'lucide-react'
import {
  CATEGORIES,
  NOTION_TOKENS,
  STATUS_IDS,
  type CategoryBadgeVariant,
  type RadiusPresetId,
  type ThemeMode,
} from './tokenImports'
import {
  CategoryBadge,
  CodeBlock,
  NotionButton,
  NotionCard,
  StatusBadge,
} from '../../frameworks/react-ts'
import { SectionHeader } from '../components/SectionHeader'

const BRAND_PRESETS = [
  { id: 'charcoal', label: 'Charcoal', hex: '#37352f', hover: '#25231f' },
  { id: 'forest', label: 'Forest', hex: '#316d5c', hover: '#265648' },
  { id: 'ocean', label: 'Ocean', hex: '#0b6e99', hover: '#085577' },
  { id: 'crimson', label: 'Crimson', hex: '#b8405e', hover: '#96324b' },
] as const

function hexToHslTriplet(hex: string): string {
  const clean = hex.replace('#', '')
  const n = Number.parseInt(clean, 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
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

export function TokenWorkbench({ resolvedTheme }: { resolvedTheme: ThemeMode }) {
  const [brandHex, setBrandHex] = useState<string>('#37352f')
  const [radiusPreset, setRadiusPreset] = useState<RadiusPresetId>('editorial')
  const [badgeVariant, setBadgeVariant] = useState<CategoryBadgeVariant>('icon-chip')
  const [showPatch, setShowPatch] = useState(false)
  const [copiedVar, setCopiedVar] = useState<string | null>(null)

  const applyBrand = (hex: string, hoverHex?: string) => {
    setBrandHex(hex)
    const root = document.documentElement
    root.style.setProperty('--color-primary', hex)
    root.style.setProperty('--color-primary-hover', hoverHex ?? hex)
    root.style.setProperty('--primary', hexToHslTriplet(hex))
  }

  const applyRadius = (presetId: RadiusPresetId) => {
    setRadiusPreset(presetId)
    const p = NOTION_TOKENS.radii.presets[presetId]
    const root = document.documentElement
    root.style.setProperty('--radius-sm', `${p.sm}px`)
    root.style.setProperty('--radius-md', `${p.md}px`)
    root.style.setProperty('--radius-lg', `${p.lg}px`)
  }

  const resetAll = () => {
    setBrandHex('#37352f')
    setRadiusPreset('editorial')
    const root = document.documentElement
    for (const k of [
      '--color-primary',
      '--color-primary-hover',
      '--primary',
      '--radius-sm',
      '--radius-md',
      '--radius-lg',
    ]) {
      root.style.removeProperty(k)
    }
  }

  const copyToken = async (tokenName: string) => {
    try {
      await navigator.clipboard.writeText(`var(${tokenName})`)
      setCopiedVar(tokenName)
      setTimeout(() => setCopiedVar(null), 1400)
    } catch {
      /* ignore */
    }
  }

  const activePalette = NOTION_TOKENS.themes[resolvedTheme]
  const activeRadius = NOTION_TOKENS.radii.presets[radiusPreset]

  const patchJson = JSON.stringify(
    {
      themes: {
        light: { brand: { primary: brandHex, primaryHover: brandHex, primaryFg: '#ffffff' } },
      },
      radii: { sm: activeRadius.sm, md: activeRadius.md, lg: activeRadius.lg },
    },
    null,
    2,
  )

  const coreSwatches = [
    { name: '--color-bg', role: 'Canvas', val: activePalette.surface.bg },
    { name: '--color-bg-subtle', role: 'Subtle', val: activePalette.surface.bgSubtle },
    { name: '--bg-hover', role: 'Hover', val: activePalette.surface.bgHover },
    { name: '--color-text', role: 'Ink', val: activePalette.text.primary },
    { name: '--color-text-muted', role: 'Muted', val: activePalette.text.muted },
    { name: '--color-text-faint', role: 'Faint', val: activePalette.text.faint },
    { name: '--color-border', role: 'Border', val: activePalette.border.subtle },
    { name: '--line-strong', role: 'Strong', val: activePalette.border.strong },
    { name: '--color-primary', role: 'Primary', val: brandHex },
    { name: '--color-link', role: 'Link', val: activePalette.brand.link },
  ]

  return (
    <section id="tokens" className="space-y-5 scroll-mt-20">
      <SectionHeader
        index="01"
        title="Tokens & Micro-Tune"
        right={
          <span className="rounded-xs border border-border-subtle bg-bg-subtle px-2 py-0.5 font-mono text-[11px] text-text-muted">
            core/tokens.json → 7 Outputs
          </span>
        }
      />

      {/* 3-Slot Spatial Stepper: ① Brand -> ② Radius -> ③ Export/Build */}
      <NotionCard subtle className="p-3.5">
        <div className="grid items-center gap-3 lg:grid-cols-[1.15fr_auto_1.05fr_auto_auto]">
          {/* Step 1: Brand */}
          <div className="rounded-sm border border-border-subtle bg-bg p-3">
            <div className="mb-2 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-text-faint">
              <span>① Brand Primary</span>
              <span>{brandHex}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {BRAND_PRESETS.map((p) => {
                const active = brandHex.toLowerCase() === p.hex.toLowerCase()
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyBrand(p.hex, p.hover)}
                    className={`inline-flex items-center gap-1.5 rounded-xs border px-2.5 py-1 text-xs font-medium transition ${
                      active
                        ? 'border-border-strong bg-bg-subtle text-text'
                        : 'border-border-subtle bg-bg text-text-muted hover:text-text'
                    }`}
                  >
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: p.hex }}
                    />
                    <span>{p.label}</span>
                  </button>
                )
              })}
              <label
                title="Custom Hex"
                className="inline-flex h-[26px] cursor-pointer items-center gap-1 rounded-xs border border-dashed border-border-strong px-2 font-mono text-[11px] text-text-muted hover:text-text"
              >
                <input
                  type="color"
                  value={brandHex}
                  onChange={(e) => applyBrand(e.target.value)}
                  className="size-3.5 cursor-pointer border-0 bg-transparent p-0"
                  aria-label="Custom Brand Hex"
                />
                <span>Custom</span>
              </label>
            </div>
          </div>

          <ChevronRight size={15} className="hidden text-text-faint lg:block" />

          {/* Step 2: Radius */}
          <div className="rounded-sm border border-border-subtle bg-bg p-3">
            <div className="mb-2 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-text-faint">
              <span>② Radius Scale</span>
              <span>
                {activeRadius.sm} / {activeRadius.md} / {activeRadius.lg}px
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(NOTION_TOKENS.radii.presets) as RadiusPresetId[]).map((id) => {
                const preset = NOTION_TOKENS.radii.presets[id]
                const active = radiusPreset === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => applyRadius(id)}
                    className={`flex items-center justify-center gap-1.5 rounded-xs border py-1 font-mono text-xs transition ${
                      active
                        ? 'border-border-strong bg-bg-subtle font-semibold text-text'
                        : 'border-border-subtle bg-bg text-text-muted hover:text-text'
                    }`}
                  >
                    <span
                      aria-hidden
                      className="inline-block size-3 border border-current"
                      style={{ borderRadius: `${Math.min(preset.sm, 6)}px` }}
                    />
                    <span>{id}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <ChevronRight size={15} className="hidden text-text-faint lg:block" />

          {/* Step 3: Output / Sync */}
          <div className="flex flex-col gap-1.5 rounded-sm border border-border-subtle bg-bg p-3">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-faint">
              ③ Sync All Stacks
            </span>
            <div className="flex items-center gap-1.5">
              <NotionButton
                variant={showPatch ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setShowPatch((s) => !s)}
              >
                <Code2 size={13} />
                tokens.json
              </NotionButton>
              <NotionButton
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={resetAll}
                title="Reset"
                aria-label="Reset tokens"
              >
                <RotateCcw size={13} />
              </NotionButton>
            </div>
          </div>
        </div>

        {showPatch ? (
          <div className="mt-3">
            <CodeBlock
              language="json"
              title="core/tokens.json → run `pnpm tokens:build`"
              code={patchJson}
              maxHeightClass="max-h-48"
            />
          </div>
        ) : null}
      </NotionCard>

      {/* Surface & Ink Swatches (Hover cue replaces text instructions) */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {coreSwatches.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => copyToken(s.name)}
            className="group relative flex flex-col overflow-hidden rounded-md border border-border-subtle bg-bg text-left shadow-card transition hover:border-border-strong"
          >
            <div
              className="h-10 w-full border-b border-border-subtle"
              style={{ backgroundColor: `var(${s.name})` }}
            />
            <span className="pointer-events-none absolute right-1.5 top-1.5 rounded-xs border border-border-subtle bg-bg/90 px-1.5 py-0.5 font-mono text-[9.5px] text-text-muted opacity-0 transition group-hover:opacity-100">
              {copiedVar === s.name ? 'Copied' : 'Copy var()'}
            </span>
            <div className="p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text">{s.role}</span>
                {copiedVar === s.name ? (
                  <Check size={12} className="text-status-success-fg" />
                ) : (
                  <span className="font-mono text-[10px] text-text-faint">{s.val}</span>
                )}
              </div>
              <div className="mt-0.5 truncate font-mono text-[10.5px] text-text-muted">
                {s.name}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 7 Categories + 4 Status Anatomy Matrix */}
      <div className="grid gap-4 lg:grid-cols-2">
        <NotionCard className="p-4">
          <div className="mb-3 flex items-center justify-between border-b border-border-subtle pb-2.5">
            <span className="font-mono text-xs font-semibold text-text">
              Domain Categories (7)
            </span>
            <div className="inline-flex rounded-xs border border-border-subtle bg-bg-subtle p-0.5 font-mono text-[11px]">
              {(['dot', 'chip', 'icon-chip', 'full'] as CategoryBadgeVariant[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setBadgeVariant(v)}
                  className={`rounded-xs px-2 py-0.5 transition ${
                    badgeVariant === v ? 'bg-bg text-text shadow-card' : 'text-text-muted hover:text-text'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div
            className={
              badgeVariant === 'full'
                ? 'grid grid-cols-2 gap-3 sm:grid-cols-3'
                : 'flex flex-wrap items-center gap-2 py-1'
            }
          >
            {CATEGORIES.map((c) => (
              <CategoryBadge key={c.id} categoryId={c.id} variant={badgeVariant} />
            ))}
          </div>
        </NotionCard>

        <NotionCard className="p-4">
          <div className="mb-3 flex items-center justify-between border-b border-border-subtle pb-2.5 font-mono text-xs">
            <span className="font-semibold text-text">Status Triads (4)</span>
            <span className="text-[10.5px] text-text-faint">fg · 12% bg · 32% border</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_IDS.map((st) => {
              const info = NOTION_TOKENS.statuses[st]
              return (
                <div
                  key={st}
                  className="flex items-center justify-between rounded-sm border border-border-subtle bg-bg-subtle/50 px-2.5 py-2"
                >
                  <StatusBadge status={st} label={info.label} />
                  <div className="flex items-center gap-1" title={`--status-${st}-{fg,bg,border}`}>
                    <span
                      className="size-3 rounded-xs border border-black/10"
                      style={{ backgroundColor: `var(--status-${st}-fg)` }}
                    />
                    <span
                      className="size-3 rounded-xs border border-black/10"
                      style={{ backgroundColor: `var(--status-${st}-bg)` }}
                    />
                    <span
                      className="size-3 rounded-xs border-2 bg-transparent"
                      style={{ borderColor: `var(--status-${st}-border)` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </NotionCard>
      </div>
    </section>
  )
}
