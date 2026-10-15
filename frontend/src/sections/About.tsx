import { FadeIn, SplitText } from '../components/Reveal'
import { initials } from '../components/Navbar'
import { profile } from '../content/profile'
import { useLang } from '../i18n/LanguageProvider'
import { ui } from '../i18n/strings'
import { scrollToTarget, useLenis } from '../lib/SmoothScroll'

export function About() {
  const { t, lang } = useLang()
  const lenis = useLenis()
  const [lead, ...rest] = profile.bio

  return (
    <section id="about" className="relative py-[clamp(72px,10vw,140px)]">
      <div className="wrap grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        <div className="min-w-0">
          <span className="eyebrow">{t(ui.about.eyebrow)}</span>
          <SplitText key={lang} as="h2" text={t(ui.about.title)} className="section-title mb-8 block" />
          <FadeIn>
            <p className="mb-6 max-w-[30ch] font-display text-[clamp(24px,2.6vw,32px)] font-medium leading-snug">
              {t(lead)}
            </p>
          </FadeIn>
          {rest.map((p, i) => (
            <FadeIn key={i} delay={0.1 * (i + 1)}>
              <p className="mb-4 max-w-[60ch] text-lg text-muted">{t(p)}</p>
            </FadeIn>
          ))}
          <FadeIn delay={0.2} className="mt-10 flex flex-wrap gap-10 border-t border-line pt-8">
            {profile.stats.map((s) => (
              <div key={s.value}>
                <b className="block font-display text-4xl font-bold tabular-nums">{s.value}</b>
                <span className="text-sm text-muted">{t(s.label)}</span>
              </div>
            ))}
          </FadeIn>
        </div>

        {/* Quick summary card for recruiters */}
        <FadeIn delay={0.15} className="min-w-0 self-start lg:sticky lg:top-24">
          <aside className="overflow-hidden rounded-2xl border border-line bg-surface/90 backdrop-blur card-shadow">
            <header className="flex items-center gap-4 border-b border-dashed border-line p-6">
              <div className="grid h-16 w-16 flex-none place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-signal font-display text-2xl font-extrabold text-white">
                {profile.avatar ? <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" /> : initials}
              </div>
              <div>
                <h3 className="text-lg font-bold">{profile.name}</h3>
                <p className="font-mono text-xs uppercase tracking-widest text-muted">{t(ui.about.summary)}</p>
              </div>
            </header>
            <dl className="px-6 py-2">
              {profile.facts.map((f) => (
                <div key={f.label.en} className="grid grid-cols-[110px_1fr] gap-3 border-b border-line py-3 text-sm last:border-0">
                  <dt className="font-mono text-[11px] uppercase leading-6 tracking-wider text-muted">{t(f.label)}</dt>
                  <dd className="min-w-0 font-medium">{t(f.value)}</dd>
                </div>
              ))}
            </dl>
            <footer className="flex gap-3 px-6 pb-6 pt-3">
              <button type="button" className="btn btn-primary flex-1 justify-center !py-2.5 !text-sm" onClick={() => scrollToTarget(lenis, '#contact')}>
                {t(ui.about.contactMe)}
              </button>
              <a className="btn flex-1 justify-center !py-2.5 !text-sm" href={profile.cv} target="_blank" rel="noopener">
                {t(ui.hero.viewCv)}
              </a>
            </footer>
          </aside>
        </FadeIn>
      </div>
    </section>
  )
}
