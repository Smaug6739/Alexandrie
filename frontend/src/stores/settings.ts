import { ref } from 'vue'
import { defineStore } from 'pinia'

const getSystemTheme = () => {
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  return systemTheme
}

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<'light' | 'dark'>()

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
  }
  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  setTheme(getSystemTheme())

  return { theme, setTheme, toggleTheme }
})
