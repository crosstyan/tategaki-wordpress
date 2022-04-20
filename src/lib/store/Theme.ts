import { writable } from 'svelte-local-storage-store'

// First param `preferences` is the local storage key.
// Second param is the initial value.
// https://steveholgado.com/typescript-types-from-arrays/
export const themeList = ["light", "dark", "auto"] as const
export type ThemeName = typeof themeList[number]
export const themeStore = writable('theme', {
  theme: 'auto'
} as { theme: ThemeName })