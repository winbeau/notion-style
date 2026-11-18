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
  type ArticleCardData,
} from '../../frameworks/react-ts'
import type { SkeletonPreset } from '../../frameworks/react-ts/components/StateTriad'
import { SectionHeader } from '../components/SectionHeader'

type AsyncViewState = 'ready' | 'loading' | 'empty' | 'error'

const INITIAL_CARDS: ArticleCardData[] = [
  {
    id: 'n1',
    title: 'Single-Source Token Pipeline',
    summary:
      'core/tokens.json 一次微调，自动重算 shadcn HSL、Element Plus、SwiftUI 动态色与 WPF XAML 字典。',
    category: 'tools',
    authorName: 'winbeau',
    readMinutes: 6,
    createdAtLabel: '2h',
    likes: 48,
    comments: 12,
    liked: true,
  },
  {
    id: 'n2',
    title: 'Bare-JSON Wire & Zod Boundary',
    summary:
      'FastAPI CamelModel 直出裸 JSON 与 {"detail"} 错误体，前端单一 request() 零改动切换 Mock 与生产。',
    category: 'research',
    authorName: 'arlab',
    readMinutes: 8,
    createdAtLabel: '1d',
    likes: 35,
    comments: 7,
    liked: false,
  },
  {
    id: 'n3',
    title: 'Editorial Serif × Precision Sans',
    summary:
      '标题与长文采用 Source Serif 4 + Noto Serif SC，高密度题单与操作台采用 Inter Tight 保证扫读效率。',
    category: 'course',
    authorName: 'feiyue',
    readMinutes: 5,
    createdAtLabel: '3d',
    likes: 29,
    comments: 5,
    liked: false,
  },
]

const LIVE_QUEUE_ITEMS = [
  { id: 'q1', cat: 'research' as const, title: 'Sync tokens.json → 7 target files', meta: '12 ms' },
  { id: 'q2', cat: 'tools' as const, title: 'Validate SwiftUI NotionStyleKit build', meta: '0.4 s' },
  { id: 'q3', cat: 'kaggle' as const, title: 'Verify FastAPI 422 → {"detail"} handler', meta: '8 ms' },
]

const TABLE_ROWS = [
  { name: 'xju-feiyue Gateway', stack: 'FastAPI · Pydantic v2', latency: '14 ms', status: 'success' as const, statusLabel: 'Healthy', highlight: false },
  { name: 'xju-OJ Judge Queue', stack: 'Vue 3 · Element Plus', latency: '38 ms', status: 'warning' as const, statusLabel: 'Peak Load', highlight: true },
  { name: 'EmailSift Sync Actor', stack: 'Swift 6 · macOS', latency: '9 ms', status: 'success' as const, statusLabel: 'Synced', highlight: false },
  { name: 'Panthera Cockpit', stack: 'C# · .NET 8 WPF-UI', latency: '—', status: 'neutral' as const, statusLabel: 'Standby', highlight: false },
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
    <section id="sandbox" className="space-y-6 scroll-mt-20">
      <SectionHeader
        index="02"
        title="Primitives & Async States"
        right={
          <span className="rounded-xs border border-border-subtle bg-bg-subtle px-2 py-0.5 font-mono text-[11px] text-text-muted">
            frameworks/react-ts
          </span>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* 2D Button Matrix (Self-explanatory rows/columns, zero prose) */}
        <NotionCard className="p-4">
          <div className="mb-3 flex items-center justify-between border-b border-border-subtle pb-2.5 font-mono text-xs">
            <span className="font-semibold text-text">NotionButton</span>
            <span className="text-[10.5px] text-text-faint">150ms · scale(0.985)</span>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <NotionButton variant="primary">
                <Plus size={14} /> Primary
              </NotionButton>
              <NotionButton variant="secondary">Secondary</NotionButton>
              <NotionButton variant="outline">Outline</NotionButton>
              <NotionButton variant="ghost">Ghost</NotionButton>
              <NotionButton variant="success">Success</NotionButton>
              <NotionButton variant="danger">Danger</NotionButton>
            </div>

            <div className="grid grid-cols-4 items-center gap-2 border-t border-border-subtle pt-3">
              <div className="flex flex-col items-start gap-1">
                <span className="font-mono text-[10px] text-text-faint">sm · 32px</span>
                <NotionButton variant="outline" size="sm">Compact</NotionButton>
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="font-mono text-[10px] text-text-faint">md · 36px</span>
                <NotionButton variant="outline" size="md">Default</NotionButton>
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="font-mono text-[10px] text-text-faint">lg · 40px</span>
                <NotionButton variant="outline" size="lg">Large</NotionButton>
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="font-mono text-[10px] text-text-faint">disabled</span>
                <NotionButton variant="outline" size="sm" disabled>Locked</NotionButton>
              </div>
            </div>
          </div>
        </NotionCard>

        {/* In-Place Async State Morphing Container (Replaces meta text box!) */}
        <NotionCard className="flex flex-col p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-2.5">
            <span className="font-mono text-xs font-semibold text-text">StateTriad</span>
            <div className="flex items-center gap-1.5">
              {asyncState === 'loading' ? (
                <div className="inline-flex rounded-xs border border-border-subtle bg-bg-subtle p-0.5 font-mono text-[10px]">
                  {(['list', 'card', 'paragraph'] as SkeletonPreset[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSkeletonPreset(p)}
                      className={`rounded-xs px-1.5 py-0.5 ${
                        skeletonPreset === p ? 'bg-bg text-text shadow-card' : 'text-text-faint'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              ) : null}
              <div className="inline-flex rounded-xs border border-border-subtle bg-bg-subtle p-0.5 font-mono text-[11px]">
                {(['ready', 'loading', 'empty', 'error'] as AsyncViewState[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setAsyncState(st)}
                    className={`rounded-xs px-2 py-0.5 transition ${
                      asyncState === st ? 'bg-bg text-text shadow-card font-semibold' : 'text-text-muted hover:text-text'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            {asyncState === 'ready' ? (
              <div className="divide-y divide-border-subtle rounded-sm border border-border-subtle bg-bg-subtle/30">
                {LIVE_QUEUE_ITEMS.map((row) => (
                  <div key={row.id} className="flex items-center justify-between px-3 py-2.5 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CategoryBadge categoryId={row.cat} variant="chip" />
                      <span className="truncate font-medium text-text">{row.title}</span>
                    </div>
                    <span className="font-mono text-[11px] text-text-faint shrink-0">{row.meta}</span>
                  </div>
                ))}
              </div>
            ) : asyncState === 'loading' ? (
              <LoadingSkeleton preset={skeletonPreset} count={2} />
            ) : asyncState === 'empty' ? (
              <EmptyState
                title="No tasks queued"
                action={{ label: 'Restore Ready', onClick: () => setAsyncState('ready') }}
                className="py-6"
              />
            ) : (
              <ErrorState
                title="HTTP 504"
                message='detail: "Upstream gateway timeout"'
                onRetry={() => setAsyncState('ready')}
                className="py-6"
              />
            )}
          </div>
        </NotionCard>
      </div>

      {/* Article Cards with Co-Located Inline Search Highlight */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="font-semibold text-text">NotionArticleCard</span>
            <span className="rounded-xs border border-border-subtle bg-bg-subtle px-1.5 py-0.5 text-[10.5px] text-text-faint">
              {filtered.length}/{cards.length}
            </span>
          </div>

          <div className="relative w-64 max-w-full">
            <Search
              size={13}
              aria-hidden
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-faint"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter & highlight (e.g. JSON, Serif)…"
              className="h-8 w-full rounded-sm border border-border-subtle bg-bg pl-8 pr-2.5 text-xs text-text placeholder:text-text-faint focus:border-border-strong focus:outline-none"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title={`No match for "${query}"`}
            action={{ label: 'Clear filter', onClick: () => setQuery('') }}
          />
        ) : (
          <div className="grid gap-3.5 md:grid-cols-3">
            {filtered.map((item) => (
              <NotionArticleCard
                key={item.id}
                item={item}
                highlightQuery={query}
                onLike={toggleLike}
              />
            ))}
          </div>
        )}
      </div>

      {/* Rounded Data Table with Inline Wash Legend */}
      <div className="overflow-x-auto rounded-md border border-border-subtle bg-bg shadow-card">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-subtle font-mono text-[11px] uppercase tracking-wider text-text-muted">
              <th className="px-4 py-2.5">Service</th>
              <th className="px-4 py-2.5">Stack</th>
              <th className="px-4 py-2.5">P95</th>
              <th className="px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {TABLE_ROWS.map((row) => (
              <tr
                key={row.name}
                className="transition hover:bg-bg-subtle"
                style={row.highlight ? { backgroundColor: 'var(--status-warning-bg)' } : undefined}
              >
                <td className="px-4 py-2.5 font-medium text-text">{row.name}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-text-muted">{row.stack}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-text-muted">{row.latency}</td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={row.status} label={row.statusLabel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
