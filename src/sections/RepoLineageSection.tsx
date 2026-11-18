import { ExternalLink } from 'lucide-react'
import { CategoryBadge } from '../../frameworks/react-ts'
import type { CategoryId } from './tokenImports'
import { SectionHeader } from '../components/SectionHeader'

interface LineageRow {
  repo: string
  url: string
  cat: CategoryId
  stack: string
  modules: string[]
}

const LINEAGE_ROWS: LineageRow[] = [
  {
    repo: 'xju-arlab/xju-feiyue',
    url: 'https://github.com/xju-arlab/xju-feiyue',
    cat: 'research',
    stack: 'React 18 · TS · FastAPI',
    modules: ['Warm Paper Palette', '7 Categories', 'prose-claude', 'StateTriad', 'CamelModel + {detail}'],
  },
  {
    repo: 'xju-arlab/xju-OJ',
    url: 'https://github.com/xju-arlab/xju-OJ',
    cat: 'competition',
    stack: 'Vue · Element Plus',
    modules: ['feiyue-theme.less', '--el-* Bridge', 'Verdict Status Tags', 'scale(0.985) Press'],
  },
  {
    repo: 'xju-arlab/auth-login',
    url: 'https://github.com/xju-arlab/auth-login',
    cat: 'tools',
    stack: 'React · Vite · Node',
    modules: ['tokens.json Compiler', '--check CI Guard', 'Paper Grid & Glow'],
  },
  {
    repo: 'winbeau/xju-feiyue-cs336',
    url: 'https://github.com/winbeau',
    cat: 'course',
    stack: 'React · Monaco · SSE',
    modules: ['.dark Neutral Palette', 'Dual HSL Bridge', 'SSE Stream Parser'],
  },
  {
    repo: 'winbeau/email-sift',
    url: 'https://github.com/winbeau/email-sift',
    cat: 'life',
    stack: 'Swift · SwiftUI · AppKit',
    modules: ['NotionCard', '1.2pt Eyebrow', 'Quiet & Primary ButtonStyle'],
  },
  {
    repo: 'winbeau/FastFinder & Panthera-WAM',
    url: 'https://github.com/winbeau/FastFinder',
    cat: 'kaggle',
    stack: 'C# · .NET 8 WPF-UI',
    modules: ['XAML ResourceDictionary', 'RelayCommand', 'Registry Theme Sync'],
  },
]

export function RepoLineageSection() {
  return (
    <section id="lineage" className="space-y-5 scroll-mt-20">
      <SectionHeader
        index="06"
        title="Upstream Lineage"
        right={
          <span className="rounded-xs border border-border-subtle bg-bg-subtle px-2 py-0.5 font-mono text-[11px] text-text-muted">
            @xju-arlab · @winbeau
          </span>
        }
      />

      <div className="overflow-x-auto rounded-md border border-border-subtle bg-bg shadow-card">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-subtle font-mono text-[11px] uppercase tracking-wider text-text-muted">
              <th className="px-4 py-2.5">Repository</th>
              <th className="px-4 py-2.5">Stack</th>
              <th className="px-4 py-2.5">Consolidated Modules</th>
              <th className="px-4 py-2.5 text-right">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {LINEAGE_ROWS.map((row) => (
              <tr key={row.repo} className="transition hover:bg-bg-subtle/70">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CategoryBadge categoryId={row.cat} variant="dot" className="text-xs" />
                    <span className="font-mono text-xs font-semibold text-text">{row.repo}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-text-muted whitespace-nowrap">
                  {row.stack}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {row.modules.map((m) => (
                      <span
                        key={m}
                        className="rounded-xs border border-border-subtle bg-bg-subtle px-2 py-0.5 font-mono text-[11px] text-text-muted"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${row.repo}`}
                    className="inline-flex items-center gap-1 font-mono text-xs text-text-faint hover:text-link"
                  >
                    <ExternalLink size={13} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
