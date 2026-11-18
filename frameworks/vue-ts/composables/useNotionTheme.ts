import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import type { ThemeMode } from '../../../core/generated/tokens'

export type ThemePreference = ThemeMode | 'system'

const STORAGE_KEY = 'notion-style.theme'
const preference = ref<ThemePreference>('light')
const systemDark = ref(false)

/**
 * Vue 3 Composable for Notion-Style Light / Dark / System theme switching.
 * Automatically toggles `html.dark` so `tokens.css`, Tailwind `dark:`, and
 * `element-plus-bridge.css` stay synchronized.
 */
export function useNotionTheme() {
  let mq: MediaQueryList | null = null
  const onMediaChange = (e: MediaQueryListEvent) => {
    systemDark.value = e.matches
  }

  onMounted(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      preference.value = saved
    }
    mq = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = mq.matches
    mq.addEventListener('change', onMediaChange)
  })

  onUnmounted(() => {
    mq?.removeEventListener('change', onMediaChange)
  })

  const resolvedTheme = computed<ThemeMode>(() =>
    preference.value === 'system' ? (systemDark.value ? 'dark' : 'light') : preference.value,
  )

  watchEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark', resolvedTheme.value === 'dark')
    window.localStorage.setItem(STORAGE_KEY, preference.value)
  })

  function toggleTheme() {
    preference.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
  }

  return {
    preference,
    resolvedTheme,
    toggleTheme,
  }
}
