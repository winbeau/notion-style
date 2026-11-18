import { useState } from 'react'
import { ChevronDown, ChevronRight, FolderTree } from 'lucide-react'
import { CodeBlock, NotionCard } from '../../frameworks/react-ts'
import { SectionHeader } from '../components/SectionHeader'

import skillCore from '../../skills/notion-style-core/SKILL.md?raw'
import skillReact from '../../skills/notion-style-react-ts/SKILL.md?raw'
import skillVue from '../../skills/notion-style-vue-ts/SKILL.md?raw'
import skillSwift from '../../skills/notion-style-swift/SKILL.md?raw'
import skillCsharp from '../../skills/notion-style-csharp/SKILL.md?raw'
import skillFastapi from '../../skills/notion-style-fastapi/SKILL.md?raw'

const AGENT_PLATFORMS = [
  { id: 'claude', label: 'Claude Code', globalPath: '~/.claude/skills/', projectPath: '.claude/skills/' },
  { id: 'codex', label: 'OpenAI Codex', globalPath: '~/.codex/skills/', projectPath: '.agents/skills/' },
  { id: 'antigravity', label: 'Antigravity', globalPath: '~/.gemini/config/plugins/notion-style/', projectPath: '.agents/skills/' },
  { id: 'cursor', label: 'Cursor IDE', globalPath: '~/.cursor/skills/', projectPath: '.cursor/rules/*.mdc' },
  { id: 'gemini', label: 'Gemini CLI', globalPath: '~/.agents/skills/', projectPath: '.agents/skills/' },
] as const

const SKILL_ITEMS = [
  { id: 'core', slug: 'notion-style-core', label: 'Core', md: skillCore },
  { id: 'react-ts', slug: 'notion-style-react-ts', label: 'React-TS', md: skillReact },
  { id: 'vue-ts', slug: 'notion-style-vue-ts', label: 'Vue-TS', md: skillVue },
  { id: 'swift', slug: 'notion-style-swift', label: 'Swift', md: skillSwift },
  { id: 'csharp', slug: 'notion-style-csharp', label: 'C# WPF', md: skillCsharp },
  { id: 'fastapi', slug: 'notion-style-fastapi', label: 'FastAPI', md: skillFastapi },
] as const

type CmdTab = 'bash' | 'clone' | 'pwsh'

export function SkillRegistryHub() {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([
    'claude',
    'codex',
    'antigravity',
    'cursor',
    'gemini',
  ])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'core',
    'react-ts',
    'vue-ts',
    'swift',
    'csharp',
    'fastapi',
  ])
  const [scope, setScope] = useState<'global' | 'project'>('global')
  const [copyMode, setCopyMode] = useState(false)
  const [cmdTab, setCmdTab] = useState<CmdTab>('bash')
  const [showSkillPreview, setShowSkillPreview] = useState(false)
  const [previewSkillId, setPreviewSkillId] = useState<string>('core')

  const toggleItem = (list: string[], setList: (next: string[]) => void, id: string) => {
    if (list.includes(id)) {
      if (list.length === 1) return
      setList(list.filter((x) => x !== id))
    } else {
      setList([...list, id])
    }
  }

  const allAgentsSelected = selectedAgents.length === AGENT_PLATFORMS.length
  const allSkillsSelected = selectedSkills.length === SKILL_ITEMS.length

  const agentArg = allAgentsSelected ? '' : ` --agent ${selectedAgents.join(',')}`
  const skillArg = allSkillsSelected ? '' : ` --skill ${selectedSkills.join(',')}`
  const scopeArg = scope === 'global' ? '--global' : '--project ./your-app'
  const modeArg = copyMode ? ' --copy' : ''

  const commands: Record<CmdTab, { lang: string; title: string; code: string }> = {
    bash: {
      lang: 'bash',
      title: 'scripts/register-skills.sh',
      code: `./scripts/register-skills.sh ${scopeArg}${agentArg}${skillArg}${modeArg}`,
    },
    clone: {
      lang: 'bash',
      title: 'One-Line Clone & Register',
      code: `git clone https://github.com/winbeau/notion-style.git ~/Developer/orgs/notion-style && \\\n~/Developer/orgs/notion-style/scripts/register-skills.sh ${scopeArg}${agentArg}${skillArg}${modeArg}`,
    },
    pwsh: {
      lang: 'powershell',
      title: 'scripts/register-skills.ps1',
      code: `.\\scripts\\register-skills.ps1 -Scope ${scope}${
        allAgentsSelected ? '' : ` -Agent "${selectedAgents.join(',')}"`
      }${allSkillsSelected ? '' : ` -Skill "${selectedSkills.join(',')}"`}`,
    },
  }

  // Deduplicated live resolved target paths
  const resolvedPaths = Array.from(
    new Set(
      AGENT_PLATFORMS.filter((a) => selectedAgents.includes(a.id)).map((a) =>
        scope === 'global' ? a.globalPath : a.projectPath,
      ),
    ),
  )

  const previewSkill = SKILL_ITEMS.find((s) => s.id === previewSkillId) ?? SKILL_ITEMS[0]!

  return (
    <section id="skills" className="space-y-5 scroll-mt-20">
      <SectionHeader
        index="05"
        title="Multi-Agent Skill Registry"
        right={
          <span className="rounded-xs border border-border-subtle bg-bg-subtle px-2 py-0.5 font-mono text-[11px] text-text-muted">
            6 Skills × 5 Platforms
          </span>
        }
      />

      {/* 3-Stage Spatial Configurator: ① Agents -> ② Skills & Scope -> ③ Resolved Paths */}
      <NotionCard className="space-y-4 p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_1.05fr_auto_1.15fr] lg:items-stretch">
          {/* Col 1: Agents */}
          <div className="rounded-sm border border-border-subtle bg-bg-subtle/40 p-3">
            <div className="mb-2 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-text-faint">
              <span>① Agents ({selectedAgents.length}/5)</span>
              <button
                type="button"
                onClick={() => setSelectedAgents(AGENT_PLATFORMS.map((a) => a.id))}
                className="text-link hover:underline"
              >
                All
              </button>
            </div>
            <div className="space-y-1">
              {AGENT_PLATFORMS.map((ag) => {
                const on = selectedAgents.includes(ag.id)
                return (
                  <button
                    key={ag.id}
                    type="button"
                    onClick={() => toggleItem(selectedAgents, setSelectedAgents, ag.id)}
                    className={`flex w-full items-center justify-between rounded-xs border px-2.5 py-1.5 text-left text-xs transition ${
                      on
                        ? 'border-border-strong bg-bg font-medium text-text shadow-card'
                        : 'border-transparent text-text-faint hover:text-text'
                    }`}
                  >
                    <span>{ag.label}</span>
                    <span className="font-mono text-[10px]">{on ? '●' : '○'}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="hidden items-center justify-center lg:flex">
            <ChevronRight size={15} className="text-text-faint" />
          </div>

          {/* Col 2: Skills + Scope */}
          <div className="flex flex-col justify-between gap-3 rounded-sm border border-border-subtle bg-bg-subtle/40 p-3">
            <div>
              <div className="mb-2 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-text-faint">
                <span>② Skills ({selectedSkills.length}/6)</span>
                <button
                  type="button"
                  onClick={() => setSelectedSkills(SKILL_ITEMS.map((s) => s.id))}
                  className="text-link hover:underline"
                >
                  All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {SKILL_ITEMS.map((sk) => {
                  const on = selectedSkills.includes(sk.id)
                  return (
                    <button
                      key={sk.id}
                      type="button"
                      onClick={() => toggleItem(selectedSkills, setSelectedSkills, sk.id)}
                      className={`flex items-center justify-between rounded-xs border px-2 py-1.5 text-xs transition ${
                        on
                          ? 'border-border-strong bg-bg font-medium text-text shadow-card'
                          : 'border-border-subtle/60 bg-bg/40 text-text-faint hover:text-text'
                      }`}
                    >
                      <span>{sk.label}</span>
                      <span className="font-mono text-[10px]">{on ? '✓' : ''}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-border-subtle pt-2.5">
              <div className="inline-flex rounded-xs border border-border-subtle bg-bg p-0.5 font-mono text-[11px]">
                {(['global', 'project'] as const).map((sc) => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => setScope(sc)}
                    className={`rounded-xs px-2 py-0.5 transition ${
                      scope === sc ? 'bg-bg-subtle font-semibold text-text' : 'text-text-faint'
                    }`}
                  >
                    --{sc}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCopyMode((v) => !v)}
                className={`rounded-xs border px-2 py-1 font-mono text-[11px] transition ${
                  copyMode
                    ? 'border-border-strong bg-bg font-semibold text-text'
                    : 'border-border-subtle bg-bg text-text-faint hover:text-text'
                }`}
              >
                {copyMode ? 'mode: copy' : 'mode: symlink'}
              </button>
            </div>
          </div>

          <div className="hidden items-center justify-center lg:flex">
            <ChevronRight size={15} className="text-text-faint" />
          </div>

          {/* Col 3: Live Resolved Target Destinations (Visual Explanation!) */}
          <div className="flex flex-col justify-between rounded-sm border border-border-subtle bg-bg-subtle/40 p-3">
            <div>
              <div className="mb-2 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-text-faint">
                <FolderTree size={12} />
                <span>③ Resolved Destinations</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                {resolvedPaths.map((p) => (
                  <div
                    key={p}
                    className="truncate rounded-xs border border-border-subtle bg-bg px-2.5 py-1.5 text-text"
                    title={p}
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-2 font-mono text-[10.5px] text-text-faint">
              <span>Auto-includes core</span>
              <span>{copyMode ? 'cp -R' : 'ln -sfn'}</span>
            </div>
          </div>
        </div>

        {/* Single Tabbed Command Output */}
        <div className="space-y-2 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex rounded-xs border border-border-subtle bg-bg-subtle p-0.5 font-mono text-[11px]">
              {(
                [
                  ['bash', 'macOS / Linux'],
                  ['clone', 'Fresh Clone'],
                  ['pwsh', 'PowerShell'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setCmdTab(k)}
                  className={`rounded-xs px-2.5 py-1 transition ${
                    cmdTab === k ? 'bg-bg font-semibold text-text shadow-card' : 'text-text-muted hover:text-text'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowSkillPreview((v) => !v)}
              className="inline-flex items-center gap-1 rounded-xs border border-border-subtle bg-bg px-2.5 py-1 font-mono text-[11px] text-text-muted hover:border-border-strong hover:text-text"
            >
              <span>Inspect SKILL.md</span>
              <ChevronDown
                size={12}
                className={`transition-transform ${showSkillPreview ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          <CodeBlock
            language={commands[cmdTab].lang}
            title={commands[cmdTab].title}
            code={commands[cmdTab].code}
          />
        </div>

        {/* Collapsible SKILL.md Drawer */}
        {showSkillPreview ? (
          <div className="space-y-2 border-t border-border-subtle pt-3">
            <div className="flex flex-wrap gap-1.5">
              {SKILL_ITEMS.map((sk) => (
                <button
                  key={sk.id}
                  type="button"
                  onClick={() => setPreviewSkillId(sk.id)}
                  className={`rounded-xs border px-2 py-0.5 font-mono text-[11px] transition ${
                    previewSkillId === sk.id
                      ? 'border-border-strong bg-bg-subtle font-semibold text-text'
                      : 'border-border-subtle bg-bg text-text-muted hover:text-text'
                  }`}
                >
                  {sk.slug}
                </button>
              ))}
            </div>
            <CodeBlock
              language="markdown"
              title={`skills/${previewSkill.slug}/SKILL.md`}
              code={previewSkill.md}
              maxHeightClass="max-h-72"
            />
          </div>
        ) : null}
      </NotionCard>
    </section>
  )
}
