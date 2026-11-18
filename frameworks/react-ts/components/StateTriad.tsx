import type { ReactNode } from 'react'
import { AlertCircle, Inbox, type LucideIcon } from 'lucide-react'
import { NotionButton } from './NotionButton'
import { cn } from '../utils/cn'

export type SkeletonPreset = 'list' | 'card' | 'paragraph'

export function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-xs bg-bg-hover', className)}
    />
  )
}

export function LoadingSkeleton({
  preset = 'list',
  count = 3,
  className,
}: {
  preset?: SkeletonPreset
  count?: number
  className?: string
}) {
  const items = Array.from({ length: count }, (_, i) => i)
  return (
    <div
      role="status"
      aria-label="加载中"
      aria-live="polite"
      className={cn('space-y-3', className)}
    >
      {items.map((i) =>
        preset === 'card' ? (
          <div key={i} className="space-y-2.5 rounded-md border border-border-subtle bg-bg p-4">
            <SkeletonBar className="h-24 w-full rounded-sm" />
            <SkeletonBar className="h-3.5 w-3/4" />
            <SkeletonBar className="h-3 w-1/2" />
          </div>
        ) : preset === 'paragraph' ? (
          <div key={i} className="space-y-2">
            <SkeletonBar className="h-3 w-11/12" />
            <SkeletonBar className="h-3 w-10/12" />
            <SkeletonBar className="h-3 w-8/12" />
          </div>
        ) : (
          <div key={i} className="flex items-center gap-3 py-1.5">
            <SkeletonBar className="size-8 rounded-sm" />
            <div className="flex-1 space-y-2">
              <SkeletonBar className="h-3 w-1/2" />
              <SkeletonBar className="h-2.5 w-1/3" />
            </div>
          </div>
        ),
      )}
    </div>
  )
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
  children,
}: {
  icon?: LucideIcon
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border-strong bg-bg-subtle/50 px-6 py-10 text-center',
        className,
      )}
    >
      <Icon aria-hidden className="text-text-faint" size={34} strokeWidth={1.5} />
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        {description ? (
          <p className="max-w-sm text-xs leading-relaxed text-text-muted">{description}</p>
        ) : null}
      </div>
      {action ? (
        <NotionButton variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </NotionButton>
      ) : null}
      {children}
    </div>
  )
}

export function ErrorState({
  title = '加载失败',
  message,
  onRetry,
  retryLabel = '重试',
  className,
}: {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-md border border-status-danger-border bg-status-danger-bg/40 px-6 py-10 text-center',
        className,
      )}
    >
      <AlertCircle
        aria-hidden
        className="text-status-danger-fg"
        size={34}
        strokeWidth={1.75}
      />
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        <p className="max-w-md text-xs leading-relaxed text-text-muted">{message}</p>
      </div>
      {onRetry ? (
        <NotionButton variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </NotionButton>
      ) : null}
    </div>
  )
}
