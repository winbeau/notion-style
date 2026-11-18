import type { ReactNode } from 'react'

export function SectionHeader({
  index,
  title,
  right,
}: {
  index: string
  title: string
  right?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex h-6 items-center rounded-xs border border-border-subtle bg-bg-subtle px-2 font-mono text-[11px] font-semibold text-text-muted">
        {index}
      </span>
      <h2 className="font-serif text-xl font-bold tracking-tight text-text sm:text-2xl">
        {title}
      </h2>
      <div aria-hidden className="hidden h-px flex-1 bg-border-subtle sm:block" />
      {right ? <div className="ml-auto flex items-center gap-2">{right}</div> : null}
    </div>
  )
}
