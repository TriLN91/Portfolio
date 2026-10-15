import { Link } from 'react-router-dom'
import { PageTransition } from '../components/PageTransition'
import { useLang } from '../i18n/LanguageProvider'
import { ui } from '../i18n/strings'
import { usePageSetup } from '../lib/usePageSetup'

export function NotFound() {
  const { t } = useLang()
  usePageSetup('404')
  return (
    <PageTransition>
      <main className="wrap flex min-h-[100svh] flex-col items-start justify-center gap-6">
        <span className="font-mono text-sm text-muted">404</span>
        <h1 className="max-w-[16ch] font-extrabold leading-none [font-size:clamp(40px,7vw,88px)]">{t(ui.notFound.title)}</h1>
        <Link to="/" className="btn btn-primary">
          {t(ui.notFound.home)}
        </Link>
      </main>
    </PageTransition>
  )
}
