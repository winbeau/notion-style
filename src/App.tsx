import { BookOpen, Github, Moon, Sparkles, Sun } from 'lucide-react'
import {
  CategoryBadge,
  NotionButton,
  useNotionTheme,
} from '../frameworks/react-ts'
import { TokenWorkbench } from './sections/TokenWorkbench'
import { ComponentSandbox } from './sections/ComponentSandbox'
import { ProseShowcase } from './sections/ProseShowcase'
import { FrameworkHub } from './sections/FrameworkHub'
import { SkillRegistryHub } from './sections/SkillRegistryHub'
import { RepoLineageSection } from './sections/RepoLineageSection'

const NAV_ITEMS = [
  { href: '#tokens', label: '微调与色板' },
  { href: '#sandbox', label: '组件沙盒' },
  { href: '#prose', label: '衬线排版' },
  { href: '#frameworks', label: '五框架源码' },
  { href: '#skills', label: 'Skill 注册台' },
  { href: '#lineage', label: '仓库溯源' },
] as const

export function App() {
  const { resolvedTheme, toggleTheme } = useNotionTheme('light')

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Sticky Editorial Header */}
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

          <nav aria-label="站点导航" className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-sm px-2.5 py-1.5 text-xs font-medium text-text-muted transition hover:bg-bg-subtle hover:text-text"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <NotionButton
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={resolvedTheme === 'dark' ? '切换至亮色纸感模式' : '切换至暗色开发者模式'}
              title={resolvedTheme === 'dark' ? '切换亮色模式' : '切换暗色模式'}
            >
              {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
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

      {/* Ambient Paper Hero */}
      <section className="hero-paper-backdrop border-b border-border-subtle">
        <div className="mx-auto max-w-[1160px] px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge categoryId="tools" variant="icon-chip" />
            <span className="font-mono text-xs text-text-faint">
              React-TS · Vue-TS · Swift · C# · FastAPI · Multi-Agent Skills
            </span>
          </div>

          <h1 className="mt-4 max-w-3xl font-serif text-3xl font-bold leading-tight tracking-tight text-text sm:text-5xl">
            一套沉稳纸感范式，贯通五端开发与全平台 Agent 技能。
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
            萃取自 <code className="rounded-xs bg-bg-subtle px-1.5 py-0.5 font-mono text-xs text-text">xju-feiyue</code>、
            <code className="rounded-xs bg-bg-subtle px-1.5 py-0.5 font-mono text-xs text-text">xju-OJ</code>、
            <code className="rounded-xs bg-bg-subtle px-1.5 py-0.5 font-mono text-xs text-text">auth-login</code>、
            <code className="rounded-xs bg-bg-subtle px-1.5 py-0.5 font-mono text-xs text-text">email-sift</code> 与{' '}
            <code className="rounded-xs bg-bg-subtle px-1.5 py-0.5 font-mono text-xs text-text">FastFinder</code>。
            由单一 <code className="rounded-xs bg-bg-subtle px-1.5 py-0.5 font-mono text-xs text-text">core/tokens.json</code>{' '}
            驱动亮暗双主题、组件原语、无信封通信契约与一键跨平台 Skill 注册，新项目开箱只需微调。
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#skills">
              <NotionButton variant="primary" size="lg">
                <Sparkles size={15} /> 一键注册全平台 Skills
              </NotionButton>
            </a>
            <a href="#frameworks">
              <NotionButton variant="outline" size="lg">
                <BookOpen size={15} /> 浏览五框架源码套件
              </NotionButton>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-[1160px] space-y-20 px-4 py-14 sm:px-6">
        <TokenWorkbench resolvedTheme={resolvedTheme} />
        <ComponentSandbox />
        <ProseShowcase />
        <FrameworkHub />
        <SkillRegistryHub />
        <RepoLineageSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-bg-subtle/60">
        <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-4 px-4 py-8 text-xs text-text-muted sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-text">Notion-Style</span>
            <span>·</span>
            <span>Cross-Framework Design Paradigm & Skill Resource Station</span>
          </div>
          <div className="font-mono text-[11px] text-text-faint">
            Single Source: core/tokens.json → CSS · TS · Vue · Swift · XAML · FastAPI
          </div>
        </div>
      </footer>
    </div>
  )
}
