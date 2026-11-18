# Notion-Style 跨框架设计范式总纲 (v1.0)

> **定位**：提炼自 `xju-feiyue`（主源）、`xju-OJ`、`auth-login`、`xju-feiyue-cs336`、`email-sift`、`FastFinder` / `Panthera-WAM` 的统一设计与工程契约。新项目只需在 `core/tokens.json` 微调 1–3 个品牌参数并运行 `node scripts/build-tokens.mjs`，即可同步产出 **React-TS · Vue-TS · Swift · C# · FastAPI** 全端设计底座。

---

## 1. 核心美学哲学：沉稳纸感 × 专业工具感

1. **拒绝廉价 AI 霓虹紫蓝渐变**：
   - **亮色模式（Warm Editorial Paper）**：以纯白画布 `#ffffff` 搭配暖米灰次级表面 `#f7f6f3`、暖炭黑正文 `#37352f`、发丝浅边 `#edece9`，营造如纸质手册与 Notion 文档般沉静、耐读的秩序感。
   - **暗色模式（Neutral Developer Dark）**：采用 GitHub Dark / VS Code Dark+ 体系的冷中性深灰阶（`#0d1117` 画布 / `#161b22` 浮层 / `#30363d` 边框 / `#388bfd` 提亮交互蓝），保证代码评测、监控面板与夜间长文阅读的高对比可读性。
2. **双字体分工（Editorial Serif + Precision Sans + JetBrains Mono）**：
   - **UI 控件与高密度表格**使用 `Inter Tight / Geist + PingFang SC`（15px / 行高 1.5），克制利落；
   - **品牌标识、卡片主标题、长文阅读区（`.prose-notion`）**使用 `Source Serif 4 + Noto Serif SC`（16px / 行高 1.75，最大行宽 `720px`），赋予人文质感；
   - **代码、快捷键、元数据标签、时间戳与学号/ID** 使用 `JetBrains Mono / SF Mono`。
3. **低噪微阴影 + 1px 实体边框优先**：
   - 平面卡片不靠重阴影悬浮，而是使用 `1px solid var(--color-border)` + 极轻 `0 1px 2px rgba(0,0,0,0.04)`；仅对浮层菜单（Popover `0 8px 24px`）与模态框（Dialog `0 14px 40px`）赋予层级阴影。

---

## 2. 单一色源与双轨桥接架构

所有平台共享 `core/tokens.json` 唯一数据源，遵循**三层语义映射**：

| 层级 | 作用 | 代表 Token |
|---|---|---|
| **Surface & Ink（基底与墨色）** | 控制 90% 界面面积的纸感与对比度 | `--color-bg`, `--color-bg-subtle`, `--bg-hover`, `--color-text`, `--color-text-muted`, `--color-border` |
| **Semantic Status Triad（四态语义三元组）** | 统一表单校验、OJ 判题结果、AI Diff 增删、系统横幅 | `success` / `warning` / `danger` / `neutral`，每组均含 `fg` + `12%~15% alpha bg` + `32% alpha border` |
| **Domain Categories（7 类领域色）** | 多维度知识分类、图表序列、标签胶囊 | `research` / `course` / `recommend` / `competition` / `kaggle` / `tools` / `life` |

### 框架桥接准则
- **React-TS (Tailwind + shadcn/ui)**：业务组件直接用 `bg-bg`、`bg-bg-subtle`、`text-text`、`border-border`；shadcn 原语自动消费由 `build-tokens.mjs` 从 Hex 精确推导的 `--background` / `--primary` HSL 变量，**零双轨色差**。
- **Vue-TS (Element Plus + Tailwind)**：引入 `element-plus-bridge.css` 将 `--el-color-*`、`--el-bg-color-*`、`--el-border-color*` 全部映射至核心变量，`html.dark` 切换时 Element Plus 与自定义组件同步换肤。
- **Swift (SwiftUI / AppKit)**：使用 `NotionDynamicColor`（macOS `NSColor(name:dynamicProvider:)` / iOS `UIColor(dynamicProvider:)`）自动响应系统 Aqua / DarkAqua 外观。
- **C# (WPF / WinUI / WPF-UI)**：通过 `NotionTokens.Light.xaml` 与 `NotionTokens.Dark.xaml` 双 `ResourceDictionary` 在运行时热切换 `Notion.*.Brush`。
- **FastAPI (Python)**：使用 `tokens.py` 导出的同源 `CategoryId` / `StatusId` `Literal` 类型与状态页/邮件内联样式。

---

## 3. 跨端必选交互与组件契约

### 3.1 异步数据三态组件（Three-State Triad）
任何涉及网络请求或异步计算的视图区域，必须显式实现三态，禁止裸露空白或 `alert()`：
1. **`LoadingSkeleton`**：按目标布局选用 `list` / `card` / `paragraph` 预设，带 `role="status"` 与 `aria-live="polite"`。
2. **`EmptyState`**：居中克制线框图标（36px, `strokeWidth=1.5`, `text-faint`）+ 一句话说明 + 可选主操作按钮。
3. **`ErrorState`**：`role="alert"` + 红色警示图标 + 可读错误信息（直接展示后端返回的 `detail`）+ `outline` 重试按钮。

### 3.2 前后端无信封通信契约（Wire Contract）
全栈（React / Vue / Swift / C# ↔ FastAPI）统一遵守 `xju-feiyue` 验证过的精简契约：
- **无外层包装信封（Bare JSON）**：成功响应直接返回业务 JSON（不包 `{ code: 0, data: ... }`），HTTP 状态码表达成败（`200` / `201` / `204`）。
- **JSON 字段统一 `camelCase`**：Python 侧继承 `CamelModel`（`alias_generator=to_camel, populate_by_name=True, from_attributes=True`），时间统一序列化为 `ISO 8601 UTC` 带 `Z` 后缀（`UtcDateTime`）。
- **统一错误体 `{"detail": "<human-readable message>"}`**：对齐 FastAPI 原生 `HTTPException`，各端 `ApiClient` 自动提取 `detail` 构造 `ApiError(message, status, path)`。
- **游标分页 `CursorPage<T>`**：统一 `{ items: T[], nextCursor: string | null }`，避免偏移量分页在实时流下重复或漏项。
- **Mock ↔ 真后端零业务改动切换**：前端 `request({ method, path, schema })` 在未配置 `VITE_API_BASE` 时走内存 Mock 表，配置后直连真实后端，全部经 Zod 边界校验。

### 3.3 动效与无障碍准则（Motion & A11y）
- 常规悬停/焦点过渡统一 `150ms ease`；卡片微浮或抽屉进出使用 `220ms cubic-bezier(0.2, 0.8, 0.2, 1)`。
- 滚动视差或阅读进度条一律通过 `requestAnimationFrame` 写入元素级 CSS 变量（如 `--sp`、`--pp`），交由合成器线程驱动，避免触发重排。
- **必须响应 `prefers-reduced-motion: reduce`**：所有动画/视差 Hook 与 CSS 均需内置降级短路。
- 只读页面默认 `html { caret-color: transparent }`，仅在真实输入控件恢复光标，消除浏览器 Caret Browsing 误触闪烁竖线。

---

## 4. 新项目 30 秒微调工作流（Micro-Tuning Playbook）

1. **选圆角档位**：在 `core/tokens.json` 中调整 `radii.sm/md/lg`：
   - 严肃开发工具 / OJ 判题台：`4 / 6 / 8`（`compact`）
   - 知识社区 / 通用 Web 产品：`6 / 8 / 12`（`editorial`，默认）
   - 原生桌面客户端：`8 / 12 / 16`（`native`）
2. **改主强调色**：亮色主按钮若需从「Notion 炭黑 `#37352f`」改为品牌色（如森绿 `#316d5c` 或学术蓝 `#0b6e99`），仅修改 `themes.light.brand.primary` 与 `primaryHover`。
3. **一键重编译**：执行 `node scripts/build-tokens.mjs`，所有框架的主题文件同步更新。
