# Notion-Style 仓库开发与设计准则

1. **布局即引导，克制文字说明（Layout as Guidance）**：
   - 优先通过空间排布（`① → ② → ③` 步骤槽、左控右显分栏、同视口原位状态切换、对齐边注、等宽键值胶囊）传递操作路径与设计意图。
   - 严禁在区块标题下或卡片内堆砌解释“本区域是什么/怎么点”的说明性长句。
2. **单一事实源**：所有颜色、圆角档位、字体与阴影变更只在 `core/tokens.json` 修改，随后运行 `pnpm tokens:build` 同步至 CSS / TS / Vue / Swift / C# XAML / FastAPI。
3. **跨栈契约一致**：见 `core/specs/PARADIGM.md` 与 `skills/notion-style-*/SKILL.md`。
