import { ArrowDownRight, ArrowRight, Github, Moon, Sparkles, Sun } from 'lucide-react'
import { NotionButton, useNotionTheme } from '../frameworks/react-ts'
import { TokenWorkbench } from './sections/TokenWorkbench'
import { ComponentSandbox } from './sections/ComponentSandbox'
import { ProseShowcase } from './sections/ProseShowcase'
import { FrameworkHub } from './sections/FrameworkHub'
import { SkillRegistryHub } from './sections/SkillRegistryHub'
import { RepoLineageSection } from './sections/RepoLineageSection'

const NAV_ITEMS = [
  { href: '#tokens', idx: '01', label: 'Tokens' },
  { href: '#sandbox', idx: '02', label: 'Primitives' },
  { href: '#prose', idx: '03', label: 'Prose' },
  { href: '#frameworks', idx: '04', label: 'Frameworks' },
  { href: '#skills', idx: '05', label: 'Skills' },
  { href: '#lineage', idx: '06', label: 'Lineage' },
] as const

const HERO_PIPELINE = [
  {
    step: '01',
    href: '#tokens',
    title: 'core/tokens.json',
    badge: 'Single Source',
    pills: ['Light #ffffff', 'Dark #0d1117', '7 Cats · 4 Statuses'],
  },
  {
    step: '02',
    href: '#frameworks',
    title: 'frameworks/*',
    badge: '5 Stacks',
    pills: ['React-TS', 'Vue-TS', 'Swift', 'C# WPF', 'FastAPI'],
  },
  {
    step: '03',
    href: '#skills',
    title: 'skills/* → register',
    badge: '5 Agents',
    pills: ['Claude', 'Codex', 'Antigravity', 'Cursor', 'Gemini'],
  },
] as const

export function App() {
  const { resolvedTheme, toggleTheme } = useNotionTheme('light')

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1160px] items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#" className="flex items-center gap-2.5 text-text">
            <span className="inline-flex size-7 items-center justify-center rounded-sm border border-border-strong bg-bg-subtle font-serif text-sm font-bold">
              N
            </span>
            <span className="font-serif text-base font-semibold tracking-tight">
              Notion-Style
            </span>
            <span className="hidden rounded-xs border border-border-subtle bg-bg-subtle px-1.5 py-0.5 font-mono text-[10px] text-text-faint sm:inline-block">
              v1.0
            </span>
          </a>

          <nav aria-label="站点导航" className="hidden items-center gap-0.5 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-medium text-text-muted transition hover:bg-bg-subtle hover:text-text"
              >
                <span className="font-mono text-[10px] text-text-faint">{item.idx}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <NotionButton
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              aria-label="切换亮暗主题"
              className="font-mono text-xs"
            >
              {resolvedTheme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
              <span>{resolvedTheme === 'dark' ? 'Dark' : 'Light'}</span>
            </NotionButton>

            <a
              href="https://github.com/winbeau/notion-style"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-border-subtle bg-bg px-2.5 text-xs font-medium text-text transition hover:border-border-strong hover:bg-bg-subtle"
            >
              <Github size={14} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Split Hero: Headline Left + Interactive System Topology Right */}
      <section className="hero-paper-backdrop border-b border-border-subtle">
        <div className="mx-auto grid max-w-[1160px] items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xs border border-border-subtle bg-bg/80 px-2.5 py-1 font-mono text-[11px] text-text-muted">
              <span className="size-1.5 rounded-full bg-cat-tools" />
              <span>Design System · Cross-Framework · Agent-Ready</span>
            </div>

            <h1 className="mt-4 font-serif text-3xl font-bold leading-[1.18] tracking-tight text-text sm:text-[2.65rem]">
              单一纸感色源，
              <br />
              微调即同步五端与全平台 Agent。
            </h1>

            <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px] text-text-muted">
              <span className="rounded-xs border border-border-subtle bg-bg/80 px-2 py-0.5">
                Source Serif 4 + Inter Tight
              </span>
              <span className="rounded-xs border border-border-subtle bg-bg/80 px-2 py-0.5">
                Bare JSON · {'{detail}'}
              </span>
              <span className="rounded-xs border border-border-subtle bg-bg/80 px-2 py-0.5">
                Layout as Guidance
              </span>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <a href="#skills">
                <NotionButton variant="primary" size="lg">
                  <Sparkles size={15} /> 一键注册 Skills
                </NotionButton>
              </a>
              <a href="#tokens">
                <NotionButton variant="outline" size="lg">
                  在线微调色板 <ArrowRight size={14} />
                </NotionButton>
              </a>
            </div>
          </div>

          {/* Spatial Topology Map (Replaces Explanatory Paragraph) */}
          <div className="rounded-lg border border-border-subtle bg-bg/90 p-4 shadow-panel backdrop-blur">
            <div className="mb-3 flex items-center justify-between border-b border-border-subtle pb-2 font-mono text-[10.5px] uppercase tracking-wider text-text-faint">
              <span>System Topology</span>
              <span>Click stage to jump</span>
            </div>

            <div className="space-y-2">
              {HERO_PIPELINE.map((stage, i) => (
                <div key={stage.step}>
                  <a
                    href={stage.href}
                    className="group flex flex-col gap-2 rounded-md border border-border-subtle bg-bg-subtle/60 p-3 transition hover:border-border-strong hover:bg-bg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-text-faint">
                          {stage.step}
                        </span>
                        <span className="font-mono text-xs font-semibold text-text">
                          {stage.title}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-xs border border-border-subtle bg-bg px-1.5 py-0.5 font-mono text-[10px] text-text-muted group-hover:border-border-strong group-hover:text-text">
                        {stage.badge}
                        <ArrowDownRight size={11} />
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.pills.map((pill) => (
                        <span
                          key={pill}
                          className="rounded-xs bg-bg px-2 py-0.5 font-mono text-[10.5px] text-text-muted border border-border-subtle/80"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  </a>
                  {i < HERO_PIPELINE.length - 1 ? (
                    <div aria-hidden className="flex justify-center py-0.5 font-mono text-[10px] text-text-faint">
                      ↓
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-[1160px] space-y-16 px-4 py-12 sm:px-6">
        <TokenWorkbench resolvedTheme={resolvedTheme} />
        <ComponentSandbox />
        <ProseShowcase />
        <FrameworkHub />
        <SkillRegistryHub />
        <RepoLineageSection />
      </main>

      {/* Minimal Spec Footer */}
      <footer className="border-t border-border-subtle bg-bg-subtle/50">
        <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-4 px-4 py-6 font-mono text-[11px] text-text-faint sm:px-6">
          <span>winbeau/notion-style · MIT</span>
          <span>core/tokens.json → CSS · TS · Vue · Swift · XAML · FastAPI</span>
        </div>
      </footer>
    </div>
  )
}
