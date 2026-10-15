import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { profile } from '../content/profile'
import { useLang } from '../i18n/LanguageProvider'
import { ui } from '../i18n/strings'
import { scrollToTarget, useLenis } from '../lib/SmoothScroll'
import { useTheme } from '../theme/ThemeProvider'

const LINKS = [
  { id: '#about', label: ui.nav.about },
  { id: '#work', label: ui.nav.work },
  { id: '#skills', label: ui.nav.skills },
  { id: '#experience', label: ui.nav.experience },
  { id: '#contact', label: ui.nav.contact },
]

export const initials = profile.initials

export function Navbar() {
  const { t, lang, setLang } = useLang()
  const { theme, toggle } = useTheme()
  const lenis = useLenis()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!lenis) return
    if (open) lenis.stop()
    else lenis.start()
  }, [open, lenis])

  const go = (id: string) => {
    setOpen(false)
    if (location.pathname === '/') scrollToTarget(lenis, id)
    else navigate(`/${id}`)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
          scrolled || open ? 'border-b border-line bg-bg/80 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <nav className="wrap flex h-16 items-center gap-6" aria-label="Main">
          <Link to="/" className="flex items-center gap-2.5 font-display text-[17px] font-bold" onClick={() => go('#top')}>
            <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-ink px-1.5 font-mono text-[11px] text-bg">{initials}</span>
            <span className="hidden sm:inline">{profile.name}</span>
          </Link>

          <ul className="ml-auto hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => go(l.id)}
                  className="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-sunk hover:text-ink"
                >
                  {t(l.label)}
                </button>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <div className="flex rounded-lg border border-line bg-surface p-0.5 font-mono text-xs" role="group" aria-label="Language">
              {(['en', 'vi'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={`rounded-md px-2 py-1 uppercase transition-colors ${lang === l ? 'bg-ink text-bg' : 'text-muted hover:text-ink'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-ink"
            >
              {theme === 'dark' ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
              )}
            </button>
            <a href={profile.cv} target="_blank" rel="noopener" className="btn btn-primary hidden !px-4 !py-2 !text-sm sm:inline-flex">
              {t(ui.nav.cv)}
            </a>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface lg:hidden"
              aria-expanded={open}
              aria-label={t(open ? ui.nav.close : ui.nav.menu)}
              onClick={() => setOpen((o) => !o)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-bg pt-24 lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="wrap flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <button type="button" onClick={() => go(l.id)} className="font-display text-4xl font-bold">
                    {t(l.label)}
                  </button>
                </motion.li>
              ))}
              <li className="mt-6">
                <a href={profile.cv} target="_blank" rel="noopener" className="btn btn-primary">
                  {t(ui.hero.viewCv)}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
