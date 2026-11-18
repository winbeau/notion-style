import type { CSSProperties } from 'react'
import {
  BarChart3,
  BookOpen,
  Coffee,
  GraduationCap,
  Microscope,
  Trophy,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import {
  getCategoryMeta,
  type CategoryId,
  type StatusId,
} from '../../../core/generated/tokens'
import { cn } from '../utils/cn'

const ICON_MAP: Record<CategoryId, LucideIcon> = {
  research: Microscope,
  course: BookOpen,
  recommend: GraduationCap,
  competition: Trophy,
  kaggle: BarChart3,
  tools: Wrench,
  life: Coffee,
}

export type CategoryBadgeVariant = 'dot' | 'chip' | 'icon-chip' | 'full'

export function CategoryBadge({
  categoryId,
  variant = 'chip',
  className,
}: {
  categoryId: CategoryId
  variant?: CategoryBadgeVariant
  className?: string
}) {
  const meta = getCategoryMeta(categoryId)
  const Icon = ICON_MAP[categoryId]
  const fgStyle: CSSProperties = { color: `var(${meta.colorVar})` }
  const bgStyle: CSSProperties = { backgroundColor: `var(${meta.tagBgVar})` }

  if (variant === 'dot') {
    return (
      <span
        data-cat={meta.id}
        className={cn('inline-flex items-center gap-1.5 text-sm text-text-muted', className)}
      >
        <span
          aria-hidden
          className="inline-block size-2 rounded-full"
          style={{ backgroundColor: `var(${meta.colorVar})` }}
        />
        <span>{meta.label}</span>
      </span>
    )
  }

  if (variant === 'chip') {
    return (
      <span
        data-cat={meta.id}
        className={cn(
          'inline-flex items-center rounded-xs px-2 py-0.5 text-xs font-medium',
          className,
        )}
        style={{ ...fgStyle, ...bgStyle }}
      >
        {meta.label}
      </span>
    )
  }

  if (variant === 'icon-chip') {
    return (
      <span
        data-cat={meta.id}
        className={cn(
          'inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-xs font-medium',
          className,
        )}
        style={{ ...fgStyle, ...bgStyle }}
      >
        <Icon size={12} strokeWidth={1.75} aria-hidden />
        {meta.label}
      </span>
    )
  }

  return (
    <div data-cat={meta.id} className={cn('flex flex-col gap-1', className)}>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={fgStyle}>
        <Icon size={15} strokeWidth={1.75} aria-hidden />
        {meta.label}
      </span>
      <span className="text-xs text-text-muted">{meta.desc}</span>
    </div>
  )
}

/**
 * Universal 4-state semantic badge (unifies OJ AC/WA, CS336 Pass/Fail, AI Diff, System Status).
 */
export function StatusBadge({
  status,
  label,
  outlined = true,
  className,
}: {
  status: StatusId
  label: string
  outlined?: boolean
  className?: string
}) {
  return (
    <span
      data-status={status}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xs px-2 py-0.5 text-xs font-medium',
        outlined && 'border',
        className,
      )}
      style={{
        color: `var(--status-${status}-fg)`,
        backgroundColor: `var(--status-${status}-bg)`,
        borderColor: outlined ? `var(--status-${status}-border)` : 'transparent',
      }}
    >
      <span
        aria-hidden
        className="size-1.5 rounded-full"
        style={{ backgroundColor: `var(--status-${status}-fg)` }}
      />
      {label}
    </span>
  )
}
