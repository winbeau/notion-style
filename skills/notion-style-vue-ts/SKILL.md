---
name: notion-style-vue-ts
description: >-
  Builds and themes Vue 3 (<script setup lang="ts">) + Element Plus / Tailwind applications
  in the Notion-Style paradigm (distilled from xju-OJ feiyue-theme). Maps Element Plus
  --el-* variables onto Notion tokens for both Light and Dark modes, and provides NotionCard.vue,
  NotionBadge.vue, StateTriad.vue, useNotionTheme, and useNotionQuery. Use for Vue + TS projects.
---

# Notion-Style for Vue 3 + TypeScript

Use this skill when building or refactoring Vue 3 (`<script setup lang="ts">`) frontends, with or without Element Plus. Also adhere to [`notion-style-core`](../notion-style-core/SKILL.md).

## 1. Style Entry Setup (`main.ts`)

Import token stylesheets **after** `element-plus/dist/index.css` so the Notion bridge cleanly overrides Element Plus defaults across both Light and `.dark` themes:

```ts
import 'element-plus/dist/index.css'
import './styles/tokens.css'               // from core/generated/tokens.css
import './styles/element-plus-bridge.css'  // from frameworks/vue-ts/styles/element-plus-bridge.css
import './styles/prose-notion.css'         // from core/css/prose-notion.css
import './styles/scrollbar-notion.css'     // from core/css/scrollbar-notion.css
```

If Tailwind CSS is also used, share [`frameworks/react-ts/tailwind.preset.ts`](../../frameworks/react-ts/tailwind.preset.ts) and add `./src/**/*.{vue,ts}` to `content`.

## 2. Reusable Vue SFCs & Composables

Copy from [`frameworks/vue-ts/`](../../frameworks/vue-ts/):

1. **Theme Composable**: [`useNotionTheme.ts`](../../frameworks/vue-ts/composables/useNotionTheme.ts) syncs `preference` (`light` | `dark` | `system`) to `document.documentElement.classList.toggle('dark', ...)` so both custom CSS variables and Element Plus (`--el-*`) switch simultaneously.
2. **Async Query Composable + Triad SFC**: Pair [`useNotionQuery.ts`](../../frameworks/vue-ts/composables/useApiClient.ts) with [`StateTriad.vue`](../../frameworks/vue-ts/components/StateTriad.vue):
   ```vue
   <StateTriad :loading="loading" :error="error" :empty="checkEmpty()" @retry="execute">
     <NotionCard v-for="item in data" :key="item.id" interactive>
       <template #meta><NotionBadge :category="item.category" /></template>
       <template #title>{{ item.title }}</template>
       {{ item.summary }}
     </NotionCard>
   </StateTriad>
   ```
3. **Cards & Badges**: [`NotionCard.vue`](../../frameworks/vue-ts/components/NotionCard.vue) and [`NotionBadge.vue`](../../frameworks/vue-ts/components/NotionBadge.vue) (`dot` | `chip` | `status`).

## 3. Verification Checklist

- **Layout as Guidance**: Replace instructional paragraphs under headings with spatial cues (`① → ② → ③` step slots, left-config/right-preview panes, and inline mono spec badges).
- Run `vue-tsc --noEmit` to validate `<script setup lang="ts">` props and emits.
- Check `el-button`, `el-input`, `el-table`, `el-tag`, and `el-dialog` under both Light and `.dark` modes.
