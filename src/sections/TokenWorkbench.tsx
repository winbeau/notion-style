import { useState } from 'react'
import { Check, RotateCcw, Sliders, Sparkles } from 'lucide-react'
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

const BRAND_PRESETS = [
  { id: 'charcoal', label: 'Notion 炭黑', hex: '#37352f', hover: '#25231f', note: 'xju-feiyue / xju-OJ 默认' },
  { id: 'forest', label: 'Sift 森绿', hex: '#316d5c', hover: '#265648', note: 'email-sift 原生桌面色' },
  { id: 'ocean', label: '学术深青', hex: '#0b6e99', hover: '#085577', note: '数据 / 科研工具主色' },
  { id: 'crimson', label: '新大绛红', hex: '#b8405e', hover: '#96324b', note: '竞赛 / 纪念专题主色' },
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
      setTimeout(() => setCopiedVar(null), 1500)
    } catch {
      /* ignore */
    }
  }

  const activePalette = NOTION_TOKENS.themes[resolvedTheme]
  const activeRadius = NOTION_TOKENS.radii.presets[radiusPreset]

  const patchJson = JSON.stringify(
    {
      themes: {
        light: {
          brand: {
            primary: brandHex,
            primaryHover: brandHex,
            primaryFg: '#ffffff',
          },
        },
      },
      radii: {
        sm: activeRadius.sm,
        md: activeRadius.md,
        lg: activeRadius.lg,
      },
    },
    null,
    2,
  )

  const coreSwatches = [
    { name: '--color-bg', label: 'Canvas 画布', val: activePalette.surface.bg },
    { name: '--color-bg-subtle', label: 'Subtle 次表面', val: activePalette.surface.bgSubtle },
    { name: '--bg-hover', label: 'Hover 悬停底', val: activePalette.surface.bgHover },
    { name: '--color-text', label: 'Primary 正文墨色', val: activePalette.text.primary },
    { name: '--color-text-muted', label: 'Muted 次级文字', val: activePalette.text.muted },
    { name: '--color-text-faint', label: 'Faint 辅助文字', val: activePalette.text.faint },
    { name: '--color-border', label: 'Border 发丝边', val: activePalette.border.subtle },
    { name: '--line-strong', label: 'Border Strong 强边', val: activePalette.border.strong },
    { name: '--color-primary', label: 'Brand 主操作色', val: brandHex },
    { name: '--color-link', label: 'Link 链接焦点色', val: activePalette.brand.link },
  ]

  return (
    <section id="tokens" className="space-y-8 scroll-mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-faint">
            01 · Single Source of Truth & Micro-Tuner
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-text">
            30 秒微调工作台与核心 Token 矩阵
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            以后新开项目只需微调主色与圆角档位，运行 <code className="rounded-xs bg-bg-subtle px-1.5 py-0.5 font-mono text-xs text-text">pnpm tokens:build</code> 即可同步生成五端主题文件。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NotionButton variant="outline" size="sm" onClick={() => setShowPatch((s) => !s)}>
            <Sparkles size={14} />
            {showPatch ? '收起微调配置' : '导出 tokens.json 微调补丁'}
          </NotionButton>
          <NotionButton variant="ghost" size="sm" onClick={resetAll}>
            <RotateCcw size={14} />
            还原默认
          </NotionButton>
        </div>
      </div>

      {/* Live Micro-Tuner Controls */}
      <NotionCard subtle className="p-5">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
              <Sliders size={13} />
              <span>主强调色微调 (Brand Primary)</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {BRAND_PRESETS.map((p) => {
                const active = brandHex.toLowerCase() === p.hex.toLowerCase()
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyBrand(p.hex, p.hover)}
                    className={`inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? 'border-border-strong bg-bg text-text shadow-card'
                        : 'border-border-subtle bg-bg/60 text-text-muted hover:bg-bg hover:text-text'
                    }`}
                  >
                    <span
                      className="size-3 rounded-full border border-black/10"
                      style={{ backgroundColor: p.hex }}
                    />
                    <span>{p.label}</span>
                  </button>
                )
              })}
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-border-subtle bg-bg px-2.5 py-1 text-xs text-text-muted hover:border-border-strong">
                <input
                  type="color"
                  value={brandHex}
                  onChange={(e) => applyBrand(e.target.value)}
                  className="size-4 cursor-pointer border-0 bg-transparent p-0"
                  aria-label="自定义主色"
                />
                <span className="font-mono">{brandHex}</span>
              </label>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              圆角密度档位 (Radius Scale Preset)
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {(Object.keys(NOTION_TOKENS.radii.presets) as RadiusPresetId[]).map((id) => {
                const preset = NOTION_TOKENS.radii.presets[id]
                const active = radiusPreset === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => applyRadius(id)}
                    className={`flex flex-col items-start rounded-sm border p-2.5 text-left transition ${
                      active
                        ? 'border-border-strong bg-bg text-text shadow-card'
                        : 'border-border-subtle bg-bg/60 text-text-muted hover:bg-bg hover:text-text'
                    }`}
                  >
                    <span className="font-mono text-xs font-semibold text-text">
                      {id} ({preset.sm}/{preset.md}/{preset.lg}px)
                    </span>
                    <span className="mt-0.5 line-clamp-1 text-[11px] text-text-faint">
                      {preset.desc}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {showPatch ? (
          <div className="mt-4">
            <CodeBlock
              language="json"
              title="core/tokens.json 微调片段 — 修改后执行 pnpm tokens:build"
              code={patchJson}
              maxHeightClass="max-h-56"
            />
          </div>
        ) : null}
      </NotionCard>

      {/* Surface & Ink Swatches */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">
            基底与墨色槽位（当前模式：{resolvedTheme === 'dark' ? 'Dark 开发者冷灰' : 'Light 暖白纸感'} · 点击复制 CSS 变量）
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {coreSwatches.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => copyToken(s.name)}
              className="group flex flex-col overflow-hidden rounded-md border border-border-subtle bg-bg text-left shadow-card transition hover:border-border-strong"
            >
              <div
                className="h-12 w-full border-b border-border-subtle"
                style={{ backgroundColor: `var(${s.name})` }}
              />
              <div className="p-2.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-medium text-text">{s.label}</span>
                  {copiedVar === s.name ? (
                    <Check size={12} className="text-status-success-fg" />
                  ) : null}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-text-muted">{s.name}</div>
                <div className="font-mono text-[10.5px] text-text-faint">{s.val}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 7 Categories + 4 Status Triads */}
      <div className="grid gap-4 lg:grid-cols-2">
        <NotionCard className="p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-text">7 类领域强调色与 12% Alpha 胶囊</h3>
              <p className="text-xs text-text-muted">源自 xju-feiyue / xju-OJ 多维分类体系</p>
            </div>
            <div className="inline-flex rounded-sm border border-border-subtle bg-bg-subtle p-0.5 text-xs">
              {(['dot', 'chip', 'icon-chip', 'full'] as CategoryBadgeVariant[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setBadgeVariant(v)}
                  className={`rounded-xs px-2 py-0.5 font-mono text-[11px] transition ${
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
                ? 'grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3'
                : 'flex flex-wrap items-center gap-2.5 pt-2'
            }
          >
            {CATEGORIES.map((c) => (
              <CategoryBadge key={c.id} categoryId={c.id} variant={badgeVariant} />
            ))}
          </div>
        </NotionCard>

        <NotionCard className="p-5">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-text">4 态通用语义三元组 (fg / bg / border)</h3>
            <p className="text-xs text-text-muted">
              统一 AI Diff 增删、OJ 判题 AC/WA、CS336 闯关状态与系统通知条
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {STATUS_IDS.map((st) => {
              const info = NOTION_TOKENS.statuses[st]
              return (
                <div
                  key={st}
                  className="flex items-center justify-between rounded-sm border border-border-subtle bg-bg-subtle/60 px-3 py-2"
                >
                  <StatusBadge status={st} label={info.label} />
                  <span className="font-mono text-[11px] text-text-faint">--status-{st}-*</span>
                </div>
              )
            })}
          </div>
        </NotionCard>
      </div>
    </section>
  )
}
