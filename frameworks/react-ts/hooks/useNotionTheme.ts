import { useCallback, useEffect, useState } from 'react'
import type { ThemeMode } from '../../../core/generated/tokens'

export type ThemePreference = ThemeMode | 'system'

const STORAGE_KEY = 'notion-style.theme'

function resolveSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useNotionTheme(defaultPreference: ThemePreference = 'light') {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    if (typeof window === 'undefined') return defaultPreference
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
    return defaultPreference
  })

  const [systemTheme, setSystemTheme] = useState<ThemeMode>(resolveSystemTheme)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemTheme(mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const resolvedTheme: ThemeMode = preference === 'system' ? systemTheme : preference

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
    window.localStorage.setItem(STORAGE_KEY, preference)
  }, [preference, resolvedTheme])

  const toggleTheme = useCallback(() => {
    setPreferenceState((prev) => {
      const current = prev === 'system' ? resolveSystemTheme() : prev
      return current === 'dark' ? 'light' : 'dark'
    })
  }, [])

  return {
    preference,
    resolvedTheme,
    setPreference: setPreferenceState,
    toggleTheme,
  }
}
