import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '../utils/cn'

export function CodeBlock({
  code,
  language,
  title,
  maxHeightClass = 'max-h-[440px]',
  highlightedChildren,
  className,
}: {
  code: string
  language?: string
  title?: string
  maxHeightClass?: string
  highlightedChildren?: ReactNode
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore clipboard denial in non-secure context */
    }
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-md border border-border-subtle bg-bg-subtle',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg/60 px-3 py-1.5">
        <div className="flex items-center gap-2">
          {language ? (
            <span className="rounded-xs bg-bg-subtle px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-text-muted border border-border-subtle">
              {language}
            </span>
          ) : null}
          {title ? (
            <span className="font-mono text-xs text-text-muted">{title}</span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? '已复制代码' : '复制代码'}
          className={cn(
            'inline-flex items-center gap-1 rounded-xs border px-2 py-0.5 font-mono text-[11px] transition',
            copied
              ? 'border-status-success-border bg-status-success-bg text-status-success-fg'
              : 'border-border-subtle bg-bg text-text-muted hover:border-border-strong hover:text-text',
          )}
        >
          {copied ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <pre
        className={cn(
          'scrollbar-notion overflow-auto p-3.5 font-mono text-[12.5px] leading-relaxed text-text',
          maxHeightClass,
        )}
      >
        <code>{highlightedChildren ?? code}</code>
      </pre>
    </div>
  )
}
