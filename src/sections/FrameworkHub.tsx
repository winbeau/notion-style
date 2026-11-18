import { useState } from 'react'
import { FileCode2, Layers } from 'lucide-react'
import { CodeBlock, NotionCard } from '../../frameworks/react-ts'
import { SectionHeader } from '../components/SectionHeader'

import coreTokensJson from '../../core/tokens.json?raw'
import coreTokensCss from '../../core/generated/tokens.css?raw'
import coreProseCss from '../../core/css/prose-notion.css?raw'

import reactPreset from '../../frameworks/react-ts/tailwind.preset.ts?raw'
import reactButton from '../../frameworks/react-ts/components/NotionButton.tsx?raw'
import reactBadges from '../../frameworks/react-ts/components/Badges.tsx?raw'
import reactTriad from '../../frameworks/react-ts/components/StateTriad.tsx?raw'
import reactClient from '../../frameworks/react-ts/api/client.ts?raw'

import vueBridgeCss from '../../frameworks/vue-ts/styles/element-plus-bridge.css?raw'
import vueThemeHook from '../../frameworks/vue-ts/composables/useNotionTheme.ts?raw'
import vueQueryHook from '../../frameworks/vue-ts/composables/useApiClient.ts?raw'
import vueCardSfc from '../../frameworks/vue-ts/components/NotionCard.vue?raw'
import vueBadgeSfc from '../../frameworks/vue-ts/components/NotionBadge.vue?raw'
import vueTriadSfc from '../../frameworks/vue-ts/components/StateTriad.vue?raw'

import swiftPackage from '../../frameworks/swift/Package.swift?raw'
import swiftTokens from '../../frameworks/swift/Sources/NotionStyleKit/GeneratedTokens.swift?raw'
import swiftComponents from '../../frameworks/swift/Sources/NotionStyleKit/Components.swift?raw'
import swiftApi from '../../frameworks/swift/Sources/NotionStyleKit/APIClient.swift?raw'

import csharpLightXaml from '../../frameworks/csharp/NotionStyle.Wpf/Themes/NotionTokens.Light.xaml?raw'
import csharpControlsXaml from '../../frameworks/csharp/NotionStyle.Wpf/Themes/NotionControls.xaml?raw'
import csharpThemeMgr from '../../frameworks/csharp/NotionStyle.Wpf/Infrastructure/NotionThemeManager.cs?raw'
import csharpRelay from '../../frameworks/csharp/NotionStyle.Wpf/Infrastructure/RelayCommand.cs?raw'
import csharpApi from '../../frameworks/csharp/NotionStyle.Wpf/Api/NotionApiClient.cs?raw'

import pySchemas from '../../frameworks/fastapi/notion_style_api/schemas.py?raw'
import pyErrors from '../../frameworks/fastapi/notion_style_api/errors.py?raw'
import pySecurity from '../../frameworks/fastapi/notion_style_api/security.py?raw'
import pySse from '../../frameworks/fastapi/notion_style_api/sse.py?raw'
import pyTokens from '../../frameworks/fastapi/notion_style_api/tokens.py?raw'

type StackKey = 'core' | 'react-ts' | 'vue-ts' | 'swift' | 'csharp' | 'fastapi'

interface FileEntry {
  path: string
  lang: string
  tag: string
  code: string
}

const STACKS: Array<{
  key: StackKey
  label: string
  specs: Array<[string, string]>
  files: FileEntry[]
}> = [
  {
    key: 'core',
    label: 'Shared Core',
    specs: [
      ['Source', 'core/tokens.json'],
      ['Compiler', 'scripts/build-tokens.mjs'],
      ['Bridge', 'Hex + Auto HSL'],
      ['Prose', '720px Serif'],
    ],
    files: [
      { path: 'core/tokens.json', lang: 'json', tag: 'SSOT', code: coreTokensJson },
      { path: 'core/generated/tokens.css', lang: 'css', tag: 'Compiled', code: coreTokensCss },
      { path: 'core/css/prose-notion.css', lang: 'css', tag: 'Prose', code: coreProseCss },
    ],
  },
  {
    key: 'react-ts',
    label: 'React + TS',
    specs: [
      ['Style', 'Tailwind 3.4 + shadcn'],
      ['TS', 'Strict Quartet'],
      ['Async', 'StateTriad.tsx'],
      ['Wire', 'Zod + SSE Client'],
    ],
    files: [
      { path: 'frameworks/react-ts/tailwind.preset.ts', lang: 'typescript', tag: 'Preset', code: reactPreset },
      { path: 'frameworks/react-ts/components/NotionButton.tsx', lang: 'tsx', tag: 'Button', code: reactButton },
      { path: 'frameworks/react-ts/components/Badges.tsx', lang: 'tsx', tag: 'Badges', code: reactBadges },
      { path: 'frameworks/react-ts/components/StateTriad.tsx', lang: 'tsx', tag: 'Triad', code: reactTriad },
      { path: 'frameworks/react-ts/api/client.ts', lang: 'typescript', tag: 'Wire', code: reactClient },
    ],
  },
  {
    key: 'vue-ts',
    label: 'Vue 3 + TS',
    specs: [
      ['UI Bridge', 'Element Plus --el-*'],
      ['Theme', 'html.dark Sync'],
      ['Async', 'StateTriad.vue'],
      ['Script', '<script setup ts>'],
    ],
    files: [
      { path: 'frameworks/vue-ts/styles/element-plus-bridge.css', lang: 'css', tag: 'Compiled', code: vueBridgeCss },
      { path: 'frameworks/vue-ts/composables/useNotionTheme.ts', lang: 'typescript', tag: 'Hook', code: vueThemeHook },
      { path: 'frameworks/vue-ts/composables/useApiClient.ts', lang: 'typescript', tag: 'Query', code: vueQueryHook },
      { path: 'frameworks/vue-ts/components/StateTriad.vue', lang: 'vue', tag: 'Triad', code: vueTriadSfc },
      { path: 'frameworks/vue-ts/components/NotionCard.vue', lang: 'vue', tag: 'Card', code: vueCardSfc },
      { path: 'frameworks/vue-ts/components/NotionBadge.vue', lang: 'vue', tag: 'Badge', code: vueBadgeSfc },
    ],
  },
  {
    key: 'swift',
    label: 'Swift',
    specs: [
      ['Target', 'macOS 14+ / iOS 17+'],
      ['Appearance', 'NSColor / UIColor'],
      ['Hit Area', '.contentShape(Rect)'],
      ['Concurrency', 'Sendable Actor'],
    ],
    files: [
      { path: 'frameworks/swift/Package.swift', lang: 'swift', tag: 'SPM', code: swiftPackage },
      { path: 'frameworks/swift/Sources/NotionStyleKit/GeneratedTokens.swift', lang: 'swift', tag: 'Compiled', code: swiftTokens },
      { path: 'frameworks/swift/Sources/NotionStyleKit/Components.swift', lang: 'swift', tag: 'Views', code: swiftComponents },
      { path: 'frameworks/swift/Sources/NotionStyleKit/APIClient.swift', lang: 'swift', tag: 'Actor', code: swiftApi },
    ],
  },
  {
    key: 'csharp',
    label: 'C# WPF',
    specs: [
      ['Target', '.NET 8 WPF / WPF-UI'],
      ['Binding', 'DynamicResource'],
      ['Theme', 'Registry Auto-Sync'],
      ['MVVM', 'AsyncRelayCommand'],
    ],
    files: [
      { path: 'frameworks/csharp/NotionStyle.Wpf/Themes/NotionTokens.Light.xaml', lang: 'xml', tag: 'Compiled', code: csharpLightXaml },
      { path: 'frameworks/csharp/NotionStyle.Wpf/Themes/NotionControls.xaml', lang: 'xml', tag: 'Styles', code: csharpControlsXaml },
      { path: 'frameworks/csharp/NotionStyle.Wpf/Infrastructure/NotionThemeManager.cs', lang: 'csharp', tag: 'Theme', code: csharpThemeMgr },
      { path: 'frameworks/csharp/NotionStyle.Wpf/Infrastructure/RelayCommand.cs', lang: 'csharp', tag: 'MVVM', code: csharpRelay },
      { path: 'frameworks/csharp/NotionStyle.Wpf/Api/NotionApiClient.cs', lang: 'csharp', tag: 'Wire', code: csharpApi },
    ],
  },
  {
    key: 'fastapi',
    label: 'FastAPI',
    specs: [
      ['DTO', 'CamelModel'],
      ['Time', 'UtcDateTime (Z)'],
      ['Errors', '422 → {"detail"}'],
      ['Uploads', 'nosniff + DenyList'],
    ],
    files: [
      { path: 'frameworks/fastapi/notion_style_api/schemas.py', lang: 'python', tag: 'Schemas', code: pySchemas },
      { path: 'frameworks/fastapi/notion_style_api/errors.py', lang: 'python', tag: 'Errors', code: pyErrors },
      { path: 'frameworks/fastapi/notion_style_api/security.py', lang: 'python', tag: 'Security', code: pySecurity },
      { path: 'frameworks/fastapi/notion_style_api/sse.py', lang: 'python', tag: 'SSE', code: pySse },
      { path: 'frameworks/fastapi/notion_style_api/tokens.py', lang: 'python', tag: 'Compiled', code: pyTokens },
    ],
  },
]

export function FrameworkHub() {
  const [activeStack, setActiveStack] = useState<StackKey>('react-ts')
  const [fileIndex, setFileIndex] = useState<number>(0)

  const currentStack = STACKS.find((s) => s.key === activeStack) ?? STACKS[0]!
  const currentFile = currentStack.files[fileIndex] ?? currentStack.files[0]!

  return (
    <section id="frameworks" className="space-y-5 scroll-mt-20">
      <SectionHeader
        index="04"
        title="Cross-Framework Kits"
        right={
          <span className="rounded-xs border border-border-subtle bg-bg-subtle px-2 py-0.5 font-mono text-[11px] text-text-muted">
            Live ?raw Source
          </span>
        }
      />

      {/* Stack Selector Bar */}
      <div className="flex flex-wrap gap-1.5">
        {STACKS.map((st) => {
          const on = st.key === activeStack
          return (
            <button
              key={st.key}
              type="button"
              onClick={() => {
                setActiveStack(st.key)
                setFileIndex(0)
              }}
              className={`inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-semibold transition ${
                on
                  ? 'border-border-strong bg-brand text-brand-fg shadow-card'
                  : 'border-border-subtle bg-bg text-text-muted hover:border-border-strong hover:bg-bg-subtle hover:text-text'
              }`}
            >
              <Layers size={12} />
              <span>{st.label}</span>
              <span className="rounded-xs bg-black/10 px-1.5 font-mono text-[10px]">
                {st.files.length}
              </span>
            </button>
          )
        })}
      </div>

      {/* IDE Split Card: Structured Contract Strip + File Tree + Code Viewer */}
      <NotionCard className="overflow-hidden p-0">
        {/* 4-Slot Contract Strip (Replaces prose paragraph) */}
        <div className="grid grid-cols-2 divide-x divide-y divide-border-subtle border-b border-border-subtle bg-bg-subtle/60 sm:grid-cols-4 sm:divide-y-0">
          {currentStack.specs.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between px-3.5 py-2 font-mono text-[11px]">
              <span className="text-text-faint">{k}</span>
              <span className="font-semibold text-text">{v}</span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Compact File Tree */}
          <div className="flex flex-col gap-1 border-b border-border-subtle bg-bg-subtle/30 p-2.5 lg:border-b-0 lg:border-r">
            {currentStack.files.map((f, idx) => {
              const active = idx === fileIndex
              const shortName = f.path.split('/').pop() ?? f.path
              return (
                <button
                  key={f.path}
                  type="button"
                  onClick={() => setFileIndex(idx)}
                  className={`flex items-center justify-between gap-2 rounded-sm border px-2.5 py-2 text-left font-mono text-xs transition ${
                    active
                      ? 'border-border-strong bg-bg font-semibold text-text shadow-card'
                      : 'border-transparent text-text-muted hover:bg-bg/60 hover:text-text'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <FileCode2 size={13} className="shrink-0 text-text-faint" />
                    <span className="truncate">{shortName}</span>
                  </span>
                  <span className="shrink-0 rounded-xs border border-border-subtle bg-bg-subtle px-1.5 py-0.2 text-[9.5px] font-normal text-text-faint">
                    {f.tag}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Code Viewer */}
          <div className="min-w-0 p-3">
            <CodeBlock
              language={currentFile.lang}
              title={currentFile.path}
              code={currentFile.code}
              maxHeightClass="max-h-[440px]"
            />
          </div>
        </div>
      </NotionCard>
    </section>
  )
}
