import type { Config } from 'tailwindcss'

/**
 * Reusable Tailwind v3.4 Preset for Notion-Style React-TS & Vue-TS apps.
 * Pair with `core/generated/tokens.css`.
 */
export const notionTailwindPreset: Partial<Config> = {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        'bg-subtle': 'var(--color-bg-subtle)',
        'bg-hover': 'var(--bg-hover)',
        'bg-elevated': 'var(--color-bg-elevated)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-faint': 'var(--color-text-faint)',
        'border-subtle': 'var(--color-border)',
        'border-strong': 'var(--line-strong)',
        link: 'var(--color-link)',
        brand: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          fg: 'var(--color-primary-fg)',
        },
        cat: {
          research: 'var(--cat-research)',
          course: 'var(--cat-course)',
          recommend: 'var(--cat-recommend)',
          competition: 'var(--cat-competition)',
          kaggle: 'var(--cat-kaggle)',
          tools: 'var(--cat-tools)',
          life: 'var(--cat-life)',
        },
        tag: {
          research: 'var(--tag-research-bg)',
          course: 'var(--tag-course-bg)',
          recommend: 'var(--tag-recommend-bg)',
          competition: 'var(--tag-competition-bg)',
          kaggle: 'var(--tag-kaggle-bg)',
          tools: 'var(--tag-tools-bg)',
          life: 'var(--tag-life-bg)',
        },
        status: {
          'success-fg': 'var(--status-success-fg)',
          'success-bg': 'var(--status-success-bg)',
          'success-border': 'var(--status-success-border)',
          'warning-fg': 'var(--status-warning-fg)',
          'warning-bg': 'var(--status-warning-bg)',
          'warning-border': 'var(--status-warning-border)',
          'danger-fg': 'var(--status-danger-fg)',
          'danger-bg': 'var(--status-danger-bg)',
          'danger-border': 'var(--status-danger-border)',
          'neutral-fg': 'var(--status-neutral-fg)',
          'neutral-bg': 'var(--status-neutral-bg)',
          'neutral-border': 'var(--status-neutral-border)',
        },
        // shadcn/ui HSL semantic slots
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        panel: 'var(--shadow-panel)',
        dialog: 'var(--shadow-dialog)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
}

export default notionTailwindPreset
