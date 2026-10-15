import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { L, Lang } from '../content/types'

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (text: L) => string }
const LanguageContext = createContext<Ctx | null>(null)

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'en' || saved === 'vi') return saved
  } catch {
    /* storage unavailable */
  }
  return navigator.language.toLowerCase().startsWith('vi') ? 'vi' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem('lang', l)
    } catch {
      /* ignore */
    }
  }, [])

  const t = useCallback((text: L) => text[lang], [lang])

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
