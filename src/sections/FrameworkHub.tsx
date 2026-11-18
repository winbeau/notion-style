import { useState } from 'react'
import { FileCode2, Layers } from 'lucide-react'
import { CodeBlock, NotionCard } from '../../frameworks/react-ts'

// Direct raw imports from canonical repo files — zero drift!
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
  desc: string
  code: string
}

const STACKS: Array<{
  key: StackKey
  label: string
  summary: string
  files: FileEntry[]
}> = [
  {
    key: 'core',
    label: 'Shared Core',
    summary: '全端共享唯一数据源 tokens.json、编译产出的双主题 CSS 变量（含 shadcn HSL 桥接）与衬线排版样式。',
    files: [
      { path: 'core/tokens.json', lang: 'json', desc: '唯一设计事实源（亮/暗、7 分类、4 状态、字体、圆角档位）', code: coreTokensJson },
      { path: 'core/generated/tokens.css', lang: 'css', desc: '自动生成的 CSS 变量与 shadcn HSL 桥接', code: coreTokensCss },
      { path: 'core/css/prose-notion.css', lang: 'css', desc: '衬线长文阅读容器与批注闪烁样式', code: coreProseCss },
    ],
  },
  {
    key: 'react-ts',
    label: 'React + TS',
    summary: 'Tailwind v3.4 Preset + 无色差 shadcn 桥接 + 6 态按钮/徽章/卡片 + 异步三态标准件 + Zod Mock/Real 单一请求器。',
    files: [
      { path: 'frameworks/react-ts/tailwind.preset.ts', lang: 'typescript', desc: 'Tailwind 3.4 可复用预设配置', code: reactPreset },
      { path: 'frameworks/react-ts/components/NotionButton.tsx', lang: 'tsx', desc: '6 变体微按压反馈按钮', code: reactButton },
      { path: 'frameworks/react-ts/components/Badges.tsx', lang: 'tsx', desc: '7 分类徽章与 4 语义状态胶囊', code: reactBadges },
      { path: 'frameworks/react-ts/components/StateTriad.tsx', lang: 'tsx', desc: 'LoadingSkeleton / EmptyState / ErrorState', code: reactTriad },
      { path: 'frameworks/react-ts/api/client.ts', lang: 'typescript', desc: 'Zod 边界校验 + Mock/真后端切换 + SSE 流解析', code: reactClient },
    ],
  },
  {
    key: 'vue-ts',
    label: 'Vue 3 + TS',
    summary: '源自 xju-OJ 的 Element Plus 全量 --el-* 双主题桥接 + Vue 3 <script setup> 卡片/徽章/三态 SFC 与响应式主题 Composable。',
    files: [
      { path: 'frameworks/vue-ts/styles/element-plus-bridge.css', lang: 'css', desc: 'Element Plus 亮/暗双主题自动桥接样式表', code: vueBridgeCss },
      { path: 'frameworks/vue-ts/composables/useNotionTheme.ts', lang: 'typescript', desc: 'html.dark 同步与持久化 Composable', code: vueThemeHook },
      { path: 'frameworks/vue-ts/composables/useApiClient.ts', lang: 'typescript', desc: '配合 StateTriad 的异步请求 Composable', code: vueQueryHook },
      { path: 'frameworks/vue-ts/components/StateTriad.vue', lang: 'vue', desc: '一键包裹异步视图的三态容器 SFC', code: vueTriadSfc },
      { path: 'frameworks/vue-ts/components/NotionCard.vue', lang: 'vue', desc: '支持具名插槽与悬浮微升的编辑风卡片', code: vueCardSfc },
      { path: 'frameworks/vue-ts/components/NotionBadge.vue', lang: 'vue', desc: '分类与状态通用徽章 SFC', code: vueBadgeSfc },
    ],
  },
  {
    key: 'swift',
    label: 'Swift (macOS/iOS)',
    summary: '独立编译通过的 NotionStyleKit Swift Package：NSColor/UIColor 动态亮暗色、macOS 全热区按钮样式与 Sendable Actor 网络层。',
    files: [
      { path: 'frameworks/swift/Package.swift', lang: 'swift', desc: 'macOS 14+ / iOS 17+ Swift Package 清单', code: swiftPackage },
      { path: 'frameworks/swift/Sources/NotionStyleKit/GeneratedTokens.swift', lang: 'swift', desc: '由 tokens.json 自动生成的动态外观令牌', code: swiftTokens },
      { path: 'frameworks/swift/Sources/NotionStyleKit/Components.swift', lang: 'swift', desc: 'NotionCard / Pill / Avatar / ButtonStyle / EmptyState', code: swiftComponents },
      { path: 'frameworks/swift/Sources/NotionStyleKit/APIClient.swift', lang: 'swift', desc: '解析 FastAPI {detail} 的并发安全 NotionAPIClient', code: swiftApi },
    ],
  },
  {
    key: 'csharp',
    label: 'C# (.NET WPF)',
    summary: '源自 FastFinder & Panthera-WAM：双主题 XAML ResourceDictionary、DynamicResource 控件模板、注册表暗色跟随与 MVVM/HttpClient。',
    files: [
      { path: 'frameworks/csharp/NotionStyle.Wpf/Themes/NotionTokens.Light.xaml', lang: 'xml', desc: '自动生成的亮色 Color / Brush / Radius 字典', code: csharpLightXaml },
      { path: 'frameworks/csharp/NotionStyle.Wpf/Themes/NotionControls.xaml', lang: 'xml', desc: 'DynamicResource 卡片、按钮、标题与输入框模板', code: csharpControlsXaml },
      { path: 'frameworks/csharp/NotionStyle.Wpf/Infrastructure/NotionThemeManager.cs', lang: 'csharp', desc: '运行时热切换 Light/Dark 字典与系统主题检测', code: csharpThemeMgr },
      { path: 'frameworks/csharp/NotionStyle.Wpf/Infrastructure/RelayCommand.cs', lang: 'csharp', desc: 'MVVM RelayCommand 与防重入 AsyncRelayCommand', code: csharpRelay },
      { path: 'frameworks/csharp/NotionStyle.Wpf/Api/NotionApiClient.cs', lang: 'csharp', desc: 'camelCase + FastAPI {detail} 强类型客户端', code: csharpApi },
    ],
  },
  {
    key: 'fastapi',
    label: 'FastAPI (Python)',
    summary: '与四端前端严丝合缝的后端底座：CamelModel 驼峰序列化、UtcDateTime Z 时区保证、422 统一扁平化 {detail}、上传防嗅探与 SSE。',
    files: [
      { path: 'frameworks/fastapi/notion_style_api/schemas.py', lang: 'python', desc: 'CamelModel + UtcDateTime + CursorPage 游标分页', code: pySchemas },
      { path: 'frameworks/fastapi/notion_style_api/errors.py', lang: 'python', desc: 'ApiException 与 422 校验错误统一扁平为 {detail}', code: pyErrors },
      { path: 'frameworks/fastapi/notion_style_api/security.py', lang: 'python', desc: 'HardenedStaticFiles nosniff 与高危扩展名拦截', code: pySecurity },
      { path: 'frameworks/fastapi/notion_style_api/sse.py', lang: 'python', desc: 'Nginx 友好的流式 SSE 响应封装', code: pySse },
      { path: 'frameworks/fastapi/notion_style_api/tokens.py', lang: 'python', desc: '自动生成的服务端同源色板与状态页 CSS', code: pyTokens },
    ],
  },
]

export function FrameworkHub() {
  const [activeStack, setActiveStack] = useState<StackKey>('react-ts')
  const [fileIndex, setFileIndex] = useState<number>(0)

  const currentStack = STACKS.find((s) => s.key === activeStack) ?? STACKS[0]!
  const currentFile = currentStack.files[fileIndex] ?? currentStack.files[0]!

  const handleSelectStack = (key: StackKey) => {
    setActiveStack(key)
    setFileIndex(0)
  }

  return (
    <section id="frameworks" className="space-y-6 scroll-mt-20">
      <div className="border-b border-border-subtle pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-text-faint">
          04 · Cross-Framework Reusable Kits
        </p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-text">
          五大框架可复用套件源码站（直读仓库真实源码）
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          涵盖共用核心与 <strong>React-TS · Vue-TS · Swift · C# · FastAPI</strong>，所有代码通过 Vite <code className="font-mono text-xs">?raw</code> 实时挂载仓库源文件，永不脱节。
        </p>
      </div>

      {/* Stack Tabs */}
      <div className="flex flex-wrap gap-2">
        {STACKS.map((st) => {
          const on = st.key === activeStack
          return (
            <button
              key={st.key}
              type="button"
              onClick={() => handleSelectStack(st.key)}
              className={`inline-flex items-center gap-2 rounded-sm border px-3.5 py-2 text-xs font-semibold transition ${
                on
                  ? 'border-border-strong bg-brand text-brand-fg shadow-card'
                  : 'border-border-subtle bg-bg text-text-muted hover:border-border-strong hover:bg-bg-subtle hover:text-text'
              }`}
            >
              <Layers size={13} />
              <span>{st.label}</span>
              <span className="rounded-xs bg-black/10 px-1.5 py-0.2 font-mono text-[10px]">
                {st.files.length}
              </span>
            </button>
          )
        })}
      </div>

      <NotionCard className="p-5">
        <p className="mb-4 text-sm text-text-muted">{currentStack.summary}</p>
        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* File Sidebar */}
          <div className="flex flex-col gap-1.5">
            {currentStack.files.map((f, idx) => {
              const active = idx === fileIndex
              const shortName = f.path.split('/').pop() ?? f.path
              return (
                <button
                  key={f.path}
                  type="button"
                  onClick={() => setFileIndex(idx)}
                  className={`flex flex-col items-start rounded-sm border px-3 py-2 text-left transition ${
                    active
                      ? 'border-border-strong bg-bg-subtle text-text shadow-card'
                      : 'border-transparent text-text-muted hover:bg-bg-subtle/60 hover:text-text'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-text">
                    <FileCode2 size={13} className="text-text-faint shrink-0" />
                    {shortName}
                  </span>
                  <span className="mt-0.5 line-clamp-2 text-[11px] text-text-faint">
                    {f.desc}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Code Viewer */}
          <div className="min-w-0">
            <CodeBlock
              language={currentFile.lang}
              title={currentFile.path}
              code={currentFile.code}
              maxHeightClass="max-h-[480px]"
            />
          </div>
        </div>
      </NotionCard>
    </section>
  )
}
