
import { useState, useEffect } from 'react'
import { APP_CONFIG } from '../../constants/appConfig'

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(APP_CONFIG.storageKey)
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem(APP_CONFIG.storageKey, isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleDark = () => setIsDark(prev => !prev)

  return { isDark, toggleDark }
}

export default useDarkMode
