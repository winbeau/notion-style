import * as React from 'react'
import { Clock, Heart, MessageSquare } from 'lucide-react'
import type { CategoryId } from '../../../core/generated/tokens'
import { CategoryBadge } from './Badges'
import { cn } from '../utils/cn'

export interface NotionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
  subtle?: boolean
}

export const NotionCard = React.forwardRef<HTMLDivElement, NotionCardProps>(
  ({ className, interactive = false, subtle = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-md border border-border-subtle text-text shadow-card transition duration-150',
        subtle ? 'bg-bg-subtle' : 'bg-bg',
        interactive &&
          'cursor-pointer hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-subtle hover:shadow-panel',
        className,
      )}
      {...props}
    />
  ),
)
NotionCard.displayName = 'NotionCard'

export interface ArticleCardData {
  id: string
  title: string
  summary: string
  category: CategoryId
  authorName: string
  readMinutes: number
  createdAtLabel: string
  likes: number
  comments: number
  liked?: boolean
}

/**
 * Generalized Editorial Card (distilled from xju-feiyue `NoteCard.tsx`).
 * Combines CategoryBadge + serif title + 2-line muted summary + author footer.
 */
export function NotionArticleCard({
  item,
  compact = false,
  onLike,
  className,
}: {
  item: ArticleCardData
  compact?: boolean
  onLike?: (id: string) => void
  className?: string
}) {
  return (
    <article
      data-cat={item.category}
      className={cn(
        'group flex h-full flex-col rounded-md border border-border-subtle bg-bg p-4 shadow-card transition duration-150 hover:border-border-strong hover:bg-bg-subtle',
        compact && 'w-72 shrink-0',
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-xs text-text-faint">
        <CategoryBadge categoryId={item.category} variant="chip" />
        <span className="inline-flex items-center gap-1 font-mono text-[11px]">
          <Clock size={12} aria-hidden /> {item.readMinutes} min
        </span>
      </div>

      <h3
        className={cn(
          'mb-1.5 line-clamp-2 font-serif font-semibold leading-snug text-text',
          compact ? 'text-base' : 'text-lg',
        )}
      >
        {item.title}
      </h3>

      {!compact && (
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-text-muted">
          {item.summary}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between pt-2 text-xs text-text-faint">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-bg-subtle font-mono text-[10px] font-medium text-text border border-border-subtle">
            {item.authorName.slice(0, 1).toUpperCase()}
          </span>
          <span className="text-text-muted">{item.authorName}</span>
          <span aria-hidden>·</span>
          <span>{item.createdAtLabel}</span>
        </span>
        <span className="inline-flex items-center gap-3 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => onLike?.(item.id)}
            aria-pressed={Boolean(item.liked)}
            className={cn(
              'inline-flex items-center gap-1 rounded-xs px-1 py-0.5 transition hover:bg-bg-hover hover:text-text',
              item.liked && 'text-cat-research hover:text-cat-research',
            )}
          >
            <Heart
              size={12}
              aria-hidden
              fill={item.liked ? 'currentColor' : 'none'}
            />
            {item.likes}
          </button>
          <span className="inline-flex items-center gap-1">
            <MessageSquare size={12} aria-hidden /> {item.comments}
          </span>
        </span>
      </div>
    </article>
  )
}
