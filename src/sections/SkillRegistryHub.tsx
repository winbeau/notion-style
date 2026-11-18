import { useState } from 'react'
import { Terminal } from 'lucide-react'
import { CodeBlock, NotionCard, StatusBadge } from '../../frameworks/react-ts'

import skillCore from '../../skills/notion-style-core/SKILL.md?raw'
import skillReact from '../../skills/notion-style-react-ts/SKILL.md?raw'
import skillVue from '../../skills/notion-style-vue-ts/SKILL.md?raw'
import skillSwift from '../../skills/notion-style-swift/SKILL.md?raw'
import skillCsharp from '../../skills/notion-style-csharp/SKILL.md?raw'
import skillFastapi from '../../skills/notion-style-fastapi/SKILL.md?raw'

const AGENT_PLATFORMS = [
  { id: 'claude', label: 'Claude Code', target: '~/.claude/skills | .claude/skills' },
  { id: 'codex', label: 'OpenAI Codex', target: '~/.codex/skills | .agents/skills' },
  { id: 'antigravity', label: 'Google Antigravity', target: '~/.gemini/config/plugins/notion-style' },
  { id: 'cursor', label: 'Cursor IDE', target: '~/.cursor/skills | .cursor/rules/*.mdc' },
  { id: 'gemini', label: 'Gemini CLI / .agents', target: '~/.agents/skills | .agents/skills' },
] as const

const SKILL_ITEMS = [
  { id: 'core', slug: 'notion-style-core', label: 'Core 共用范式', md: skillCore },
  { id: 'react-ts', slug: 'notion-style-react-ts', label: 'React + TS', md: skillReact },
  { id: 'vue-ts', slug: 'notion-style-vue-ts', label: 'Vue 3 + TS', md: skillVue },
  { id: 'swift', slug: 'notion-style-swift', label: 'Swift (macOS/iOS)', md: skillSwift },
  { id: 'csharp', slug: 'notion-style-csharp', label: 'C# (.NET WPF)', md: skillCsharp },
  { id: 'fastapi', slug: 'notion-style-fastapi', label: 'FastAPI', md: skillFastapi },
] as const

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
  const [previewSkillId, setPreviewSkillId] = useState<string>('core')

  const toggleItem = (
    list: string[],
    setList: (next: string[]) => void,
    id: string,
  ) => {
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
  const scopeArg = scope === 'global' ? '--global' : '--project /path/to/your-app'
  const modeArg = copyMode ? ' --copy' : ''

  const bashCmd = `./scripts/register-skills.sh ${scopeArg}${agentArg}${skillArg}${modeArg}`
  const bootstrapCmd = [
    `git clone https://github.com/winbeau/notion-style.git ~/Developer/orgs/notion-style`,
    `~/Developer/orgs/notion-style/scripts/register-skills.sh ${scopeArg}${agentArg}${skillArg}${modeArg}`,
  ].join(' && \\\n')

  const psCmd = `.\\scripts\\register-skills.ps1 -Scope ${scope}${
    allAgentsSelected ? '' : ` -Agent "${selectedAgents.join(',')}"`
  }${allSkillsSelected ? '' : ` -Skill "${selectedSkills.join(',')}"`}`

  const previewSkill =
    SKILL_ITEMS.find((s) => s.id === previewSkillId) ?? SKILL_ITEMS[0]!

  return (
    <section id="skills" className="space-y-6 scroll-mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-faint">
            05 · One-Click Multi-Agent Skill Registration
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-text">
            跨 Agent 平台一键注册台 (6 Skills × 5 Platforms)
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            一套 <code className="font-mono text-xs">skills/</code> 明文维护，按需软链或生成插件至{' '}
            <strong>Claude Code · Codex · Antigravity · Cursor · Gemini CLI</strong>。
          </p>
        </div>
        <StatusBadge status="success" label="Bash 3.2+ & PowerShell Ready" />
      </div>

      <NotionCard className="space-y-5 p-5">
        <div className="grid gap-5 lg:grid-cols-3">
          {/* 1. Agents */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                1. 选择目标 Agent 平台
              </span>
              <button
                type="button"
                onClick={() =>
                  setSelectedAgents(AGENT_PLATFORMS.map((a) => a.id))
                }
                className="font-mono text-[11px] text-link hover:underline"
              >
                全选
              </button>
            </div>
            <div className="space-y-1.5">
              {AGENT_PLATFORMS.map((ag) => {
                const checked = selectedAgents.includes(ag.id)
                return (
                  <button
                    key={ag.id}
                    type="button"
                    onClick={() => toggleItem(selectedAgents, setSelectedAgents, ag.id)}
                    className={`flex w-full items-center justify-between rounded-sm border px-3 py-1.5 text-left text-xs transition ${
                      checked
                        ? 'border-border-strong bg-bg-subtle text-text font-medium'
                        : 'border-border-subtle bg-bg text-text-faint hover:text-text'
                    }`}
                  >
                    <span>{ag.label}</span>
                    <span className="font-mono text-[10px] text-text-faint">
                      {checked ? '✓' : ''}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Framework Skills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                2. 选择框架 Skill（自动附带 core）
              </span>
              <button
                type="button"
                onClick={() => setSelectedSkills(SKILL_ITEMS.map((s) => s.id))}
                className="font-mono text-[11px] text-link hover:underline"
              >
                全选
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {SKILL_ITEMS.map((sk) => {
                const checked = selectedSkills.includes(sk.id)
                return (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => toggleItem(selectedSkills, setSelectedSkills, sk.id)}
                    className={`flex items-center justify-between rounded-sm border px-2.5 py-2 text-left text-xs transition ${
                      checked
                        ? 'border-border-strong bg-bg-subtle text-text font-medium'
                        : 'border-border-subtle bg-bg text-text-faint hover:text-text'
                    }`}
                  >
                    <span>{sk.label}</span>
                    <span className="font-mono text-[10px]">{checked ? '✓' : ''}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. Scope & Mode */}
          <div className="space-y-3">
            <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              3. 安装作用域与链接方式
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScope('global')}
                className={`rounded-sm border p-2.5 text-left text-xs transition ${
                  scope === 'global'
                    ? 'border-border-strong bg-bg-subtle text-text shadow-card'
                    : 'border-border-subtle bg-bg text-text-muted'
                }`}
              >
                <div className="font-semibold">Global 全局生效</div>
                <div className="mt-0.5 text-[11px] text-text-faint">
                  注册到 ~/.claude / ~/.codex / ~/.gemini
                </div>
              </button>
              <button
                type="button"
                onClick={() => setScope('project')}
                className={`rounded-sm border p-2.5 text-left text-xs transition ${
                  scope === 'project'
                    ? 'border-border-strong bg-bg-subtle text-text shadow-card'
                    : 'border-border-subtle bg-bg text-text-muted'
                }`}
              >
                <div className="font-semibold">Project 单仓生效</div>
                <div className="mt-0.5 text-[11px] text-text-faint">
                  写入目标项目 .agents / .cursor/rules
                </div>
              </button>
            </div>

            <label className="flex cursor-pointer items-center gap-2 rounded-sm border border-border-subtle bg-bg px-3 py-2 text-xs text-text-muted">
              <input
                type="checkbox"
                checked={copyMode}
                onChange={(e) => setCopyMode(e.target.checked)}
                className="rounded border-border-strong"
              />
              <span>使用复制模式 (<code className="font-mono">--copy</code>)，默认使用软链改仓即生效</span>
            </label>
          </div>
        </div>

        {/* Generated Commands */}
        <div className="grid gap-3 pt-1 lg:grid-cols-2">
          <CodeBlock
            language="bash"
            title="macOS / Linux 一键注册命令"
            code={bashCmd}
          />
          <CodeBlock
            language="powershell"
            title="Windows PowerShell 一键注册命令"
            code={psCmd}
          />
        </div>

        <CodeBlock
          language="bash"
          title="新机器 Clone + 全平台一键激活"
          code={bootstrapCmd}
        />
      </NotionCard>

      {/* Live SKILL.md Viewer */}
      <NotionCard className="space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Terminal size={15} className="text-text-muted" />
            <h3 className="text-sm font-semibold text-text">预览各框架 SKILL.md 规范全文</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SKILL_ITEMS.map((sk) => (
              <button
                key={sk.id}
                type="button"
                onClick={() => setPreviewSkillId(sk.id)}
                className={`rounded-xs border px-2.5 py-1 font-mono text-[11px] transition ${
                  previewSkillId === sk.id
                    ? 'border-border-strong bg-bg-subtle font-semibold text-text'
                    : 'border-border-subtle bg-bg text-text-muted hover:text-text'
                }`}
              >
                {sk.slug}
              </button>
            ))}
          </div>
        </div>

        <CodeBlock
          language="markdown"
          title={`skills/${previewSkill.slug}/SKILL.md`}
          code={previewSkill.md}
          maxHeightClass="max-h-80"
        />
      </NotionCard>
    </section>
  )
}
