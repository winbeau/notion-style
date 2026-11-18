import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import {
  CategoryBadge,
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  NotionArticleCard,
  NotionButton,
  NotionCard,
  StatusBadge,
  splitHighlight,
  type ArticleCardData,
} from '../../frameworks/react-ts'
import type { SkeletonPreset } from '../../frameworks/react-ts/components/StateTriad'

type AsyncViewState = 'ready' | 'loading' | 'empty' | 'error'

const INITIAL_CARDS: ArticleCardData[] = [
  {
    id: 'n1',
    title: '单一色源 Token 驱动的跨框架样式同步机制',
    summary:
      '以 core/tokens.json 为唯一事实源，自动推导 shadcn HSL 槽位、Element Plus 桥接、SwiftUI 动态色与 WPF ResourceDictionary。',
    category: 'tools',
    authorName: 'winbeau',
    readMinutes: 6,
    createdAtLabel: '2 小时前',
    likes: 48,
    comments: 12,
    liked: true,
  },
  {
    id: 'n2',
    title: 'FastAPI 无信封 CamelModel 与前端 Zod 零改动切换实践',
    summary:
      '后端直接返回裸 JSON 并统一扁平化 {"detail": "..."} 异常体，前端通过单一 request() 兼顾本地 Mock 与生产联调。',
    category: 'research',
    authorName: 'arlab',
    readMinutes: 8,
    createdAtLabel: '1 天前',
    likes: 35,
    comments: 7,
    liked: false,
  },
  {
    id: 'n3',
    title: '从 xju-feiyue 到 xju-OJ：双字体排版体系在严肃工具中的落地',
    summary:
      '标题与正文采用 Source Serif 4 + Noto Serif SC 保持人文书卷气，高密度题单与操作栏采用 Inter Tight 保证扫读效率。',
    category: 'course',
    authorName: 'feiyue',
    readMinutes: 5,
    createdAtLabel: '3 天前',
    likes: 29,
    comments: 5,
    liked: false,
  },
]

const TABLE_ROWS = [
  { name: 'xju-feiyue API Gateway', stack: 'FastAPI · Pydantic v2', latency: '14 ms', status: 'success' as const, statusLabel: 'Healthy', highlight: false },
  { name: 'xju-OJ Judge Dispatcher', stack: 'Vue 3 · Element Plus', latency: '38 ms', status: 'warning' as const, statusLabel: 'High Load', highlight: true },
  { name: 'EmailSift Sync Worker', stack: 'Swift 6 · Actor Pool', latency: '9 ms', status: 'success' as const, statusLabel: 'Synced', highlight: false },
  { name: 'Panthera WAM Cockpit', stack: 'C# · .NET 8 WPF-UI', latency: '—', status: 'neutral' as const, statusLabel: 'Standby', highlight: false },
]

export function ComponentSandbox() {
  const [query, setQuery] = useState('')
  const [cards, setCards] = useState<ArticleCardData[]>(INITIAL_CARDS)
  const [asyncState, setAsyncState] = useState<AsyncViewState>('ready')
  const [skeletonPreset, setSkeletonPreset] = useState<SkeletonPreset>('list')

  const toggleLike = (id: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c,
      ),
    )
  }

  const filtered = cards.filter(
    (c) =>
      !query.trim() ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.summary.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <section id="sandbox" className="space-y-8 scroll-mt-20">
      <div className="border-b border-border-subtle pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-text-faint">
          02 · Reusable UI Primitives & Async Triad
        </p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-text">
          交互式组件沙盒与异步三态标准件
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          本区域全部由仓库内 <code className="rounded-xs bg-bg-subtle px-1.5 py-0.5 font-mono text-xs text-text">frameworks/react-ts/</code> 真实组件渲染，微调上方主色或切换亮/暗主题会实时联动。
        </p>
      </div>

      {/* Buttons & Controls */}
      <div className="grid gap-4 lg:grid-cols-2">
        <NotionCard className="space-y-4 p-5">
          <div>
            <h3 className="text-sm font-semibold text-text">按钮层级 (6 Variants × Tactile Press)</h3>
            <p className="text-xs text-text-muted">
              150ms 过渡 + <code className="font-mono">active:scale-[0.985]</code> 微按压反馈
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <NotionButton variant="primary">
              <Plus size={14} /> 主操作 Primary
            </NotionButton>
            <NotionButton variant="secondary">次操作 Secondary</NotionButton>
            <NotionButton variant="outline">描边 Outline</NotionButton>
            <NotionButton variant="ghost">幽灵 Ghost</NotionButton>
            <NotionButton variant="success">通过 Success</NotionButton>
            <NotionButton variant="danger">危险 Danger</NotionButton>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 border-t border-border-subtle pt-3">
            <NotionButton variant="outline" size="sm">Small (32px)</NotionButton>
            <NotionButton variant="outline" size="md">Medium (36px)</NotionButton>
            <NotionButton variant="outline" size="lg">Large (40px)</NotionButton>
            <NotionButton variant="outline" disabled>Disabled</NotionButton>
          </div>
        </NotionCard>

        {/* Async Three-State Simulator */}
        <NotionCard className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-text">异步三态标准件模拟器</h3>
              <p className="text-xs text-text-muted">LoadingSkeleton / EmptyState / ErrorState</p>
            </div>
            <div className="inline-flex rounded-sm border border-border-subtle bg-bg-subtle p-0.5 text-xs">
              {(
                [
                  ['ready', '正常'],
                  ['loading', '加载中'],
                  ['empty', '空状态'],
                  ['error', '异常态'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAsyncState(key)}
                  className={`rounded-xs px-2.5 py-1 text-xs font-medium transition ${
                    asyncState === key ? 'bg-bg text-text shadow-card' : 'text-text-muted hover:text-text'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {asyncState === 'loading' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>骨架预设：</span>
                {(['list', 'card', 'paragraph'] as SkeletonPreset[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSkeletonPreset(p)}
                    className={`rounded-xs border px-2 py-0.5 font-mono text-[11px] ${
                      skeletonPreset === p
                        ? 'border-border-strong bg-bg-subtle text-text'
                        : 'border-border-subtle text-text-faint'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <LoadingSkeleton preset={skeletonPreset} count={2} />
            </div>
          ) : asyncState === 'empty' ? (
            <EmptyState
              title="暂无匹配的实验记录"
              description="当前筛选条件下尚未创建条目，可新建第一篇文档或重置过滤条件。"
              action={{ label: '切回正常视图', onClick: () => setAsyncState('ready') }}
            />
          ) : asyncState === 'error' ? (
            <ErrorState
              title="后端服务连接超时"
              message="FastAPI detail: Upstream model gateway timed out after 5000ms (HTTP 504)"
              onRetry={() => setAsyncState('ready')}
            />
          ) : (
            <div className="space-y-2 rounded-sm border border-border-subtle bg-bg-subtle/50 p-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-text">三态就绪契约已激活</span>
                <StatusBadge status="success" label="Contract Verified" />
              </div>
              <p className="leading-relaxed text-text-muted">
                点击右上角「加载中 / 空状态 / 异常态」预览各端（React / Vue / Swift）一致的无障碍占位交互，杜绝空白闪烁与原生弹窗。
              </p>
            </div>
          )}
        </NotionCard>
      </div>

      {/* Live Search + Editorial Article Cards */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-text">
              知识卡片与 XSS 安全关键词高亮 (<code className="font-mono text-xs">NotionArticleCard + splitHighlight</code>)
            </h3>
          </div>
          <div className="relative w-72 max-w-full">
            <Search
              size={14}
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入 Token / FastAPI / Serif 试看高亮…"
              className="h-9 w-full rounded-sm border border-border-subtle bg-bg pl-8 pr-3 text-sm text-text placeholder:text-text-faint focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring/25"
            />
          </div>
        </div>

        {query.trim() ? (
          <div className="rounded-sm border border-border-subtle bg-bg-subtle px-3 py-2 text-xs text-text-muted">
            高亮预览：
            {splitHighlight(
              '单一色源 Token 串联 React-TS、Vue-TS、Swift、C# 与 FastAPI 全栈工程',
              query,
            ).map((seg, idx) =>
              seg.matched ? (
                <mark
                  key={idx}
                  className="rounded-xs px-0.5 text-text"
                  style={{ backgroundColor: 'var(--highlight-flash-bg)' }}
                >
                  {seg.text}
                </mark>
              ) : (
                <span key={idx}>{seg.text}</span>
              ),
            )}
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <EmptyState
            title="未找到匹配卡片"
            description={`没有包含 "${query}" 的示例卡片`}
            action={{ label: '清空搜索词', onClick: () => setQuery('') }}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {filtered.map((item) => (
              <NotionArticleCard key={item.id} item={item} onLike={toggleLike} />
            ))}
          </div>
        )}
      </div>

      {/* Notion Data Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text">
              圆角包边数据表与语义底色行（源自 xju-feiyue <code className="font-mono text-xs">/conferences</code> & <code className="font-mono text-xs">/schools</code>）
            </h3>
          </div>
          <CategoryBadge categoryId="kaggle" variant="dot" />
        </div>
        <div className="overflow-x-auto rounded-md border border-border-subtle bg-bg shadow-card">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-subtle text-xs font-semibold text-text-muted">
                <th className="px-4 py-2.5">服务模块</th>
                <th className="px-4 py-2.5">技术栈</th>
                <th className="px-4 py-2.5 font-mono">P95 延迟</th>
                <th className="px-4 py-2.5">运行状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {TABLE_ROWS.map((row) => (
                <tr
                  key={row.name}
                  className="transition hover:bg-bg-subtle"
                  style={
                    row.highlight
                      ? { backgroundColor: 'var(--status-warning-bg)' }
                      : undefined
                  }
                >
                  <td className="px-4 py-3 font-medium text-text">{row.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">{row.stack}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">{row.latency}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} label={row.statusLabel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
