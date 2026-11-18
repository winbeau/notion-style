# Notion-Style · 跨框架设计范式与风格资源站

> **一套沉稳纸感 × 严肃工具感的设计系统，贯通 React-TS · Vue-TS · Swift · C# · FastAPI，并提供全平台 AI Agent Skills 一键注册。**

整合提炼自 [`xju-arlab/xju-feiyue`](https://github.com/xju-arlab/xju-feiyue)、[`xju-arlab/xju-OJ`](https://github.com/xju-arlab/xju-OJ)、[`xju-arlab/auth-login`](https://github.com/xju-arlab/auth-login)、`winbeau/xju-feiyue-cs336`、[`winbeau/email-sift`](https://github.com/winbeau/email-sift)、[`winbeau/pptx-precise-mac`](https://github.com/winbeau/pptx-precise-mac)、[`winbeau/FastFinder`](https://github.com/winbeau/FastFinder) 与 [`winbeau/Panthera-WAM`](https://github.com/winbeau/Panthera-WAM) 的生产级设计决策。以后开发新项目时无需从零配样式或前后端契约——**只需微调 `core/tokens.json` 并一键同步五端代码与 Agent 技能**。

---

## 仓库架构

```text
notion-style/
├── core/                        # 共用核心范式 & 单一事实源
│   ├── tokens.json              # Single Source of Truth（亮/暗双主题、7 分类、4 状态、字体、圆角三档）
│   ├── css/
│   │   ├── prose-notion.css     # Source Serif 4 + Noto Serif SC 长文排版与批注高亮 (Light + Dark)
│   │   └── scrollbar-notion.css # Notion 胶囊细滚动条
│   ├── generated/               # 由 scripts/build-tokens.mjs 自动编译
│   │   ├── tokens.css           # CSS 变量 + 自动推导的 shadcn HSL 槽位
│   │   └── tokens.ts            # TypeScript 强类型 Token 常量与运行时读取函数
│   └── specs/
│       ├── PARADIGM.md          # 跨框架统一设计范式总纲（含 30 秒微调指南）
│       └── REPO_LINEAGE.md      # GitHub 全仓库设计谱系与可复用资产盘点
├── frameworks/                  # 五大技术栈开箱即用可复用组件与通信底座
│   ├── react-ts/                # Tailwind Preset + 6 态按钮/卡片/徽章 + 异步三态组件 + Zod/SSE 请求器
│   ├── vue-ts/                  # Element Plus 双主题桥接 CSS + Vue 3 <script setup> 组件与 Composables
│   ├── swift/                   # NotionStyleKit Swift Package (macOS 14+/iOS 17+ 动态外观组件 + Actor API)
│   ├── csharp/                  # NotionStyle.Wpf (.NET 8 XAML 双主题字典 + DynamicResource 模板 + MVVM)
│   └── fastapi/                 # notion_style_api (CamelModel + UtcDateTime + 统一 {detail} 异常 + SSE)
├── skills/                      # 6 个渐进式披露 Agent Skills（含 Codex openai.yaml 元信息）
│   ├── notion-style-core/
│   ├── notion-style-react-ts/
│   ├── notion-style-vue-ts/
│   ├── notion-style-swift/
│   ├── notion-style-csharp/
│   └── notion-style-fastapi/
├── scripts/
│   ├── build-tokens.mjs         # tokens.json -> CSS / TS / Vue / Swift / XAML / Python 多端编译器
│   ├── register-skills.sh       # macOS / Linux 一键跨 Agent 平台注册 CLI
│   └── register-skills.ps1      # Windows PowerShell 一键跨 Agent 平台注册脚本
├── plugin.json                  # Google Antigravity 原生插件清单
└── src/                         # 交互式风格资源站（支持在线微调、组件沙盒、五端源码复制、命令生成）
```

---

## 快速开始

### 1. 启动交互式风格资源站

```bash
pnpm install
pnpm dev          # 本地实时预览微调工作台与组件沙盒
pnpm build        # 校验 Token 同步 + TS 严格类型检查 + 产出静态站点 dist/
```

### 2. 一键跨 Agent 平台注册 Skills

支持 **Claude Code · OpenAI Codex · Google Antigravity · Cursor · Gemini CLI (`.agents`)** 五大平台：

```bash
# 全局注册全部 6 个框架 Skills 到所有 Agent 平台（默认软链，改仓即生效）
./scripts/register-skills.sh --global

# 按需安装指定平台与指定技术栈（自动附带 notion-style-core）
./scripts/register-skills.sh --global --agent claude,codex,antigravity --skill vue-ts,fastapi

# 仅对某个业务仓库注入（自动生成 .claude/skills、.agents/skills 与 Cursor .cursor/rules/*.mdc）
./scripts/register-skills.sh --project /path/to/your-project --skill react-ts,fastapi

# 查看当前机器各平台注册状态 / 一键卸载
./scripts/register-skills.sh --status
./scripts/register-skills.sh --global --uninstall
```

Windows PowerShell 用户可执行：

```powershell
.\scripts\register-skills.ps1 -Scope global -Agent "all" -Skill "csharp,fastapi"
```

### 3. 新项目 30 秒微调流程

1. 编辑 [`core/tokens.json`](./core/tokens.json)（修改 `themes.light.brand.primary` 或切换 `radii` 的 `compact` / `editorial` / `native` 档位）；或在网页资源站顶部的「微调工作台」实时调色并导出片段。
2. 重新编译全平台产物：
   ```bash
   pnpm tokens:build
   pnpm tokens:check
   ```
3. 将对应框架目录下的套件（如 `frameworks/vue-ts/` 或 `frameworks/swift/`）引入新项目，或在安装了上述 Skill 的任意 AI 编程工具中直接用自然语言召唤对应范式。

---

## 核心规范文档

- [跨框架设计范式总纲 (`core/specs/PARADIGM.md`)](./core/specs/PARADIGM.md)
- [GitHub 全仓库风格溯源 (`core/specs/REPO_LINEAGE.md`)](./core/specs/REPO_LINEAGE.md)
