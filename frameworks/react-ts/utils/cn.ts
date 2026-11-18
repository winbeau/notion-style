import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * XSS-safe highlight splitter (distilled from xju-feiyue `lib/highlight.tsx`).
 * Splits text using a capture group: odd indices are matched segments.
 */
export function splitHighlight(
  text: string,
  query: string,
): Array<{ text: string; matched: boolean }> {
  const q = query.trim()
  if (!q) return [{ text, matched: false }]
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return parts
    .filter((p) => p.length > 0)
    .map((part, idx) => ({
      text: part,
      matched: idx % 2 === 1,
    }))
}
