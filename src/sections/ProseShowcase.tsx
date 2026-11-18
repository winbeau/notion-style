import { useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { CodeBlock, NotionCard } from '../../frameworks/react-ts'
import { SectionHeader } from '../components/SectionHeader'

const SAMPLE_PROSE_CODE = `const page = await request({
  method: 'GET',
  path: '/notes',
  query: { cat: 'research', limit: 6 },
  schema: PaginatedNotesSchema,
})`

const MARGINALIA_SPECS = [
  { slot: 'H1', spec: 'Source Serif 4 · 32px · 700 · -0.015em' },
  { slot: 'Measure', spec: 'max-width 720px · 16px · lh 1.75' },
  { slot: 'Anchor', spec: 'mark.anchor-mark · dotted → amber hover' },
  { slot: 'H2 Rule', spec: '24px · 600 · 1px bottom border' },
  { slot: 'AI Diff', spec: '--ai-del-* / --ai-add-* inline review' },
  { slot: 'Code', spec: 'JetBrains Mono · hover Copy pill' },
] as const

export function ProseShowcase() {
  const [diffAccepted, setDiffAccepted] = useState(false)

  return (
    <section id="prose" className="space-y-5 scroll-mt-20">
      <SectionHeader
        index="03"
        title="Editorial Prose & AI Diff"
        right={
          <span className="rounded-xs border border-border-subtle bg-bg-subtle px-2 py-0.5 font-mono text-[11px] text-text-muted">
            core/css/prose-notion.css
          </span>
        }
      />

      {/* Split Sheet: Authentic Specimen Left + Aligned Spec Rail Right */}
      <NotionCard className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_230px]">
        <div className="prose-notion mx-0 max-w-none">
          <h1 className="!mt-0">沉稳纸感与长文阅读秩序</h1>
          <p>
            正文容器锁定 <code>720px</code> 阅读行宽，搭配{' '}
            <mark className="anchor-mark">双向联动行内批注 (hover to highlight)</mark>{' '}
            与行内代码胶囊，兼顾技术规范与人文长文。
          </p>

          <h2>接口契约与 AI 审阅内联态</h2>
          <blockquote>
            跨框架统一的关键不在于复制组件代码，而在于共享同一套边界契约。
          </blockquote>

          {/* Interactive In-Place AI Diff Block */}
          <div className="my-4 rounded-md border border-border-subtle bg-bg-subtle p-3.5 font-sans text-sm">
            <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-text-faint">
              <span>AI Compose Review</span>
              <button
                type="button"
                onClick={() => setDiffAccepted((v) => !v)}
                className="inline-flex items-center gap-1 rounded-xs border border-border-subtle bg-bg px-2 py-0.5 text-text hover:border-border-strong"
              >
                {diffAccepted ? (
                  <>
                    <RotateCcw size={11} /> Revert Diff
                  </>
                ) : (
                  <>
                    <Check size={11} className="text-status-success-fg" /> Accept All
                  </>
                )}
              </button>
            </div>

            {diffAccepted ? (
              <p className="!m-0 text-text">
                响应体直接返回裸 JSON，异常统一遵循 FastAPI <code>{'{"detail": "..."}'}</code>。
              </p>
            ) : (
              <p className="!m-0 leading-relaxed">
                响应体由{' '}
                <span
                  className="rounded-xs border px-1.5 py-0.5 line-through"
                  style={{
                    color: 'var(--ai-del-fg)',
                    backgroundColor: 'var(--ai-del-bg)',
                    borderColor: 'var(--ai-del-border)',
                  }}
                >
                  {'{ code: 0, data: payload }'}
                </span>{' '}
                精简为{' '}
                <span
                  className="rounded-xs border px-1.5 py-0.5 font-medium"
                  style={{
                    color: 'var(--ai-add-fg)',
                    backgroundColor: 'var(--ai-add-bg)',
                    borderColor: 'var(--ai-add-border)',
                  }}
                >
                  裸 JSON 直出 + FastAPI {'{"detail": "..."}'}
                </span>
                。
              </p>
            )}
          </div>

          <CodeBlock language="typescript" title="client.ts" code={SAMPLE_PROSE_CODE} />
        </div>

        {/* Right Anatomy Spec Rail (Marginalia Layout replaces prose captioning) */}
        <aside className="flex flex-col justify-between border-t border-border-subtle pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="space-y-3">
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-text-faint">
              Typography Anatomy
            </div>
            {MARGINALIA_SPECS.map((item) => (
              <div
                key={item.slot}
                className="rounded-sm border border-border-subtle bg-bg-subtle/50 px-2.5 py-2"
              >
                <div className="font-mono text-[11px] font-semibold text-text">{item.slot}</div>
                <div className="mt-0.5 font-mono text-[10.5px] text-text-muted">{item.spec}</div>
              </div>
            ))}
          </div>
        </aside>
      </NotionCard>
    </section>
  )
}
