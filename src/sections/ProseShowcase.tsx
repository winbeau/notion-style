import { CodeBlock, NotionCard } from '../../frameworks/react-ts'

const SAMPLE_PROSE_CODE = `// 任何框架统一遵循无信封 camelCase + { detail } 异常契约
const page = await request({
  method: 'GET',
  path: '/notes',
  query: { cat: 'research', limit: 6 },
  schema: PaginatedNotesSchema,
})`

export function ProseShowcase() {
  return (
    <section id="prose" className="space-y-6 scroll-mt-20">
      <div className="border-b border-border-subtle pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-text-faint">
          03 · Editorial Typography & AI Diff
        </p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-text">
          Claude / Notion 衬线阅读容器 (<code>.prose-notion</code>)
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          提炼自 <code className="font-mono text-xs">prose-claude.css</code> 并补齐暗色主题：720px 最佳行宽、H2 底边线、引用批注高亮与 AI 语义增删对比。
        </p>
      </div>

      <NotionCard className="p-6 sm:p-10">
        <div className="prose-notion">
          <h1>沉稳、耐读、可持续演进的知识排版</h1>
          <p>
            当产品承载课程讲义、科研笔记或技术规范时，正文使用{' '}
            <code>Source Serif 4 + Noto Serif SC</code> 能够显著降低长文阅读疲劳。可点击带虚线的{' '}
            <mark className="anchor-mark" title="悬停激琥珀批注高亮">
              行内锚点批注标记 (anchor-mark)
            </mark>{' '}
            在正文与侧栏讨论间双向联动。
          </p>

          <h2>设计约束与 AI 协同审阅对比</h2>
          <blockquote>
            好的设计系统不是堆砌炫技动效，而是让五个不同语言栈写出的软件拥有同一种呼吸感。
          </blockquote>

          <p>内置 AI 写作润色或代码审阅 Diff 令牌（亮/暗自适应）：</p>
          <div className="my-4 rounded-md border border-border-subtle bg-bg-subtle p-4 font-sans text-sm leading-relaxed">
            <span>接口响应格式由传统的 </span>
            <span
              className="rounded-xs border px-1.5 py-0.5 line-through"
              style={{
                color: 'var(--ai-del-fg)',
                backgroundColor: 'var(--ai-del-bg)',
                borderColor: 'var(--ai-del-border)',
              }}
            >
              {'{ code: 200, msg: "ok", data: payload }'}
            </span>{' '}
            <span>精简为 </span>
            <span
              className="rounded-xs border px-1.5 py-0.5 font-medium"
              style={{
                color: 'var(--ai-add-fg)',
                backgroundColor: 'var(--ai-add-bg)',
                borderColor: 'var(--ai-add-border)',
              }}
            >
              裸 JSON 直出 + FastAPI 标准 {'{"detail": "..."}'} 错误体
            </span>
            <span>，消除前后端多余解包层。</span>
          </div>

          <CodeBlock
            language="typescript"
            title="Unified API Request"
            code={SAMPLE_PROSE_CODE}
          />
        </div>
      </NotionCard>
    </section>
  )
}
