# GitHub 全仓库设计谱系与可复用资产盘点

本报告汇总自 GitHub 组织 `@xju-arlab`（36 个仓库）与个人账号 `@winbeau`（134 个仓库）的设计与工程资产扫描结果，明确 `notion-style` 各模块的上游来源与融合关系。

---

## 1. 核心风格源头仓库（Design Lineage）

| 仓库 | 技术栈 | 提炼进 `notion-style` 的核心资产 |
|---|---|---|
| [`xju-arlab/xju-feiyue`](https://github.com/xju-arlab/xju-feiyue) | React 18 · TS Strict · Tailwind 3.4 · shadcn/ui · FastAPI | **主视觉与全栈母版**：暖白纸感色板 (`#ffffff`/`#f7f6f3`/`#37352f`)、7 类学科强调色 + 12% tint、`prose-claude.css` 衬线长文容器、`.scrollbar-notion`、`CategoryBadge` / `NoteCard` / `CodeBlock`、三态组件 (`LoadingSkeleton`/`EmptyState`/`ErrorState`)、rAF 动效 Hook、Zod 单一 `request()`、`CamelModel` + `{detail}` FastAPI 契约、`HardenedStaticFiles`、`skills/install.sh` 软链机制 |
| [`xju-arlab/xju-OJ`](https://github.com/xju-arlab/xju-OJ) | Vue · Element Plus · Less · Python | **Vue 端桥接母版**：`feiyue-theme.less` 将 Element Plus `--el-*` 体系完整挂载到飞跃 Notion 色板，沉淀了判题四态标签 (`success`/`warning`/`danger`/`info`)、紧凑按钮按压缩放 (`scale(0.985)`) 与圆角表格规范 |
| [`xju-arlab/auth-login`](https://github.com/xju-arlab/auth-login) | React · TS · Vite · Authentik | **Token 编译器与品牌着陆页母版**：`design/tokens.json` + `generate-design-tokens.mjs`（含 `--check` CI 校验模式）、CSS `@layer` 分层架构、暖琥珀/冷青径向微光背景与 `32px` 纸纹网格蒙版 |
| `winbeau/xju-feiyue-cs336` | React 18 · TS · Tailwind · Monaco · FastAPI | **暗色主题与流式交互母版**：补齐 `.dark` 严肃开发者冷灰阶 (`#0d1117`/`#161b22`/`#e6edf3`/`#388bfd`)、双主题 shadcn HSL 桥接对照表、15% alpha 暗底高对比语义色、SSE `ReadableStream` 增量解析器 |
| [`winbeau/email-sift`](https://github.com/winbeau/email-sift) & [`winbeau/pptx-precise-mac`](https://github.com/winbeau/pptx-precise-mac) | Swift · SwiftUI · AppKit (macOS) | **Swift 原生桌面母版**：`Design.swift` 中的 `TagPill`、`Avatar`、`SmallHeading`（字距 `1.2pt` 大写眉题）、圆角描边微阴影 `Card`、`PrimaryButtonStyle` / `QuietButtonStyle`，以及 AppKit 清晰工具窗布局 |
| [`winbeau/FastFinder`](https://github.com/winbeau/FastFinder) & [`winbeau/Panthera-WAM`](https://github.com/winbeau/Panthera-WAM) | C# · .NET · WPF · `WPF-UI` (`lepo.co/wpfui`) | **C# 桌面终端母版**：`App.xaml` `ThemesDictionary` + 自定义 `CompactButtonStyle` / `ResourceDictionary`、MVVM `RelayCommand`、本地设置持久化与异步守护服务通信模式 |

---

## 2. 其他关联仓库参考矩阵

| 领域 | 关联仓库 | 可直接套用本项目的部分 |
|---|---|---|
| **Vue 知识库 / 可视化** | `xju-arlab/KnoHub`, `winbeau/Github-Annual-Review` | 直接引入 `core/generated/tokens.css` + `frameworks/vue-ts/` |
| **React / TS 工具台与文档页** | `winbeau/prompt-tune`, `winbeau/Pipyter`, `winbeau/AlgoFluent`, `winbeau/vbench-repair-page`, `xju-arlab/mortise-tenon-explorer` | 直接引入 `frameworks/react-ts/` + `prose-notion.css` |
| **Python / FastAPI 平台后端** | `xju-arlab/xju-feiyue-supervisor`, `xju-arlab/hp-printer`, `xju-arlab/gpu-server`, `xju-arlab/hiring-agent`, `winbeau/gapmap` | 直接引入 `frameworks/fastapi/notion_style_api/` |
| **Agent Skills 体系** | `winbeau/self-skills`, `winbeau/mcm-skills`, `winbeau/v2rayN-tun/skills`, `xju-arlab/xju-feiyue/skills` | 升级为 `scripts/register-skills.sh` 五大 Agent 平台统一注册器 |
