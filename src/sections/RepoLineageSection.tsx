import { ExternalLink, GitBranch } from 'lucide-react'
import { CategoryBadge, NotionCard } from '../../frameworks/react-ts'
import type { CategoryId } from './tokenImports'

interface RepoItem {
  repo: string
  url: string
  stack: string
  cat: CategoryId
  contribution: string
}

const REPO_LINEAGE: RepoItem[] = [
  {
    repo: 'xju-arlab/xju-feiyue',
    url: 'https://github.com/xju-arlab/xju-feiyue',
    stack: 'React 18 · TS Strict · Tailwind · shadcn · FastAPI',
    cat: 'research',
    contribution:
      '主视觉母版：暖白纸感色板、7 类领域色、prose-claude 衬线排版、胶囊滚动条、三态组件、Zod 单一 fetcher 与 FastAPI CamelModel 契约。',
  },
  {
    repo: 'xju-arlab/xju-OJ',
    url: 'https://github.com/xju-arlab/xju-OJ',
    stack: 'Vue · Element Plus · Less · Python',
    cat: 'competition',
    contribution:
      'Vue 桥接母版：feiyue-theme.less 将 Element Plus --el-* 全量映射至 Notion 色源，沉淀判题四态标签与紧凑工具栏规范。',
  },
  {
    repo: 'xju-arlab/auth-login',
    url: 'https://github.com/xju-arlab/auth-login',
    stack: 'React · TS · Vite · Token Compiler',
    cat: 'tools',
    contribution:
      '编译器母版：design/tokens.json + --check 校验流、CSS @layer 架构，以及暖琥珀/冷青微光 + 32px 纸纹网格背景。',
  },
  {
    repo: 'winbeau/xju-feiyue-cs336',
    url: 'https://github.com/winbeau',
    stack: 'React 18 · TS · Monaco · SSE · FastAPI',
    cat: 'course',
    contribution:
      '暗色与流式母版：补齐 .dark 开发者冷灰阶 (#0d1117/#161b22/#388bfd)、双主题 shadcn HSL 对照表与 SSE 流式解析。',
  },
  {
    repo: 'winbeau/email-sift & pptx-precise-mac',
    url: 'https://github.com/winbeau/email-sift',
    stack: 'Swift · SwiftUI · AppKit (macOS)',
    cat: 'life',
    contribution:
      'Swift 原生桌面母版：Design.swift 的 TagPill、Avatar、1.2pt 字距大写眉题、Quiet/Primary 按钮样式与 AppKit 工具布局。',
  },
  {
    repo: 'winbeau/FastFinder & Panthera-WAM',
    url: 'https://github.com/winbeau/FastFinder',
    stack: 'C# · .NET 8 · WPF · WPF-UI',
    cat: 'kaggle',
    contribution:
      'C# 桌面终端母版：WPF ResourceDictionary 动态主题字典、CompactButtonStyle、MVVM RelayCommand 与守护服务通信。',
  },
]

export function RepoLineageSection() {
  return (
    <section id="lineage" className="space-y-6 scroll-mt-20">
      <div className="border-b border-border-subtle pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-text-faint">
          06 · Portfolio Design Lineage
        </p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-text">
          GitHub 仓库风格溯源与复用谱系
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          盘点整合自 <code className="font-mono text-xs">@xju-arlab</code> 与{' '}
          <code className="font-mono text-xs">@winbeau</code> 旗下多端项目的真实生产实践。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {REPO_LINEAGE.map((item) => (
          <NotionCard key={item.repo} className="flex flex-col justify-between p-4">
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <CategoryBadge categoryId={item.cat} variant="chip" />
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-text-faint hover:text-link"
                >
                  GitHub <ExternalLink size={11} />
                </a>
              </div>
              <h3 className="flex items-center gap-1.5 font-mono text-sm font-semibold text-text">
                <GitBranch size={13} className="text-text-faint shrink-0" />
                <span className="truncate">{item.repo}</span>
              </h3>
              <p className="mt-0.5 font-mono text-[11px] text-text-faint">{item.stack}</p>
              <p className="mt-2.5 text-xs leading-relaxed text-text-muted">
                {item.contribution}
              </p>
            </div>
          </NotionCard>
        ))}
      </div>
    </section>
  )
}
