import { profile } from '../content/profile'
import { useLang } from '../i18n/LanguageProvider'
import { ui } from '../i18n/strings'
import { scrollToTarget, useLenis } from '../lib/SmoothScroll'

export function Footer() {
  const { t } = useLang()
  const lenis = useLenis()
  return (
    <footer className="wrap flex flex-wrap items-center justify-between gap-4 py-10 text-sm text-muted">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <span>{t(ui.footer.built)}</span>
      <button type="button" onClick={() => scrollToTarget(lenis, 0)} className="font-mono text-xs uppercase tracking-widest hover:text-ink">
        ↑ {t(ui.footer.top)}
      </button>
    </footer>
  )
}
