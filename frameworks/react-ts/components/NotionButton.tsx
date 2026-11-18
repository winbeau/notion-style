import * as React from 'react'
import { cn } from '../utils/cn'

export type NotionButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'

export type NotionButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export interface NotionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NotionButtonVariant
  size?: NotionButtonSize
}

const VARIANT_CLASSES: Record<NotionButtonVariant, string> = {
  primary:
    'bg-brand text-brand-fg border border-transparent shadow-card hover:bg-brand-hover',
  secondary:
    'bg-bg-subtle text-text border border-border-subtle hover:bg-bg-hover hover:border-border-strong',
  outline:
    'bg-bg text-text border border-border-subtle shadow-card hover:bg-bg-hover hover:border-border-strong',
  ghost:
    'bg-transparent text-text-muted border border-transparent hover:bg-bg-hover hover:text-text',
  danger:
    'bg-status-danger-bg text-status-danger-fg border border-status-danger-border hover:opacity-90',
  success:
    'bg-status-success-bg text-status-success-fg border border-status-success-border hover:opacity-90',
}

const SIZE_CLASSES: Record<NotionButtonSize, string> = {
  sm: 'h-8 px-2.5 text-xs rounded-sm gap-1.5',
  md: 'h-9 px-3.5 text-sm rounded-sm gap-2',
  lg: 'h-10 px-5 text-sm rounded-md gap-2',
  icon: 'size-9 rounded-sm p-0',
}

export const NotionButton = React.forwardRef<
  HTMLButtonElement,
  NotionButtonProps
>(({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap font-medium transition duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      className,
    )}
    {...props}
  />
))
NotionButton.displayName = 'NotionButton'
