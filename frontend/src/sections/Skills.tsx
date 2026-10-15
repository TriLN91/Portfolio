import { useLayoutEffect, useRef } from 'react'
import { FadeIn, SplitText } from '../components/Reveal'
import { skills } from '../content/profile'
import { useLang } from '../i18n/LanguageProvider'
import { ui } from '../i18n/strings'
import { gsap } from '../lib/gsap'

export function Skills() {
  const { t, lang } = useLang()
  const section = useRef<HTMLElement>(null)
  const marquee = useRef<HTMLDivElement>(null)

  // Large outlined words drift sideways while the section scrolls past (parallax)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        marquee.current,
        { xPercent: 0 },
        {
          xPercent: -35,
          ease: 'none',
          scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    }, section)
    return () => ctx.revert()
  }, [])

  const words = skills.flatMap((g) => g.core)

  return (
    <section id="skills" ref={section} className="relative overflow-hidden bg-bg py-[clamp(72px,10vw,140px)]">
      <div
        ref={marquee}
        aria-hidden="true"
        className="pointer-events-none mb-12 whitespace-nowrap font-display font-extrabold leading-none text-transparent"
        style={{ fontSize: 'clamp(64px, 11vw, 160px)', WebkitTextStroke: '1.5px rgb(var(--line))' }}
      >
        {[...words, ...words].join(' · ')}
      </div>

      <div className="wrap">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">{t(ui.skills.eyebrow)}</span>
            <SplitText key={lang} as="h2" text={t(ui.skills.title)} className="section-title block" />
          </div>
          <p className="max-w-[46ch] text-muted">{t(ui.skills.intro)}</p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {skills.map((g, i) => (
            <FadeIn key={g.name.en} delay={i * 0.08} className="bg-surface p-7">
              <h3 className="mb-1 text-xl font-bold">{t(g.name)}</h3>
              <p className="mb-5 text-sm text-muted">{t(g.note)}</p>
              <ul className="flex flex-wrap gap-1.5">
                {g.core.map((s) => (
                  <li key={s} className="rounded-lg bg-accent-soft px-2.5 py-1 font-mono text-[13px] text-accent">
                    {s}
                  </li>
                ))}
                {g.more.map((s) => (
                  <li key={s} className="rounded-lg bg-sunk px-2.5 py-1 font-mono text-[13px]">
                    {s}
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted">
          <span className="flex items-center gap-2">
            <i className="h-2.5 w-2.5 rounded-sm bg-accent-soft outline outline-1 outline-accent" />
            {t(ui.skills.core)}
          </span>
          <span className="flex items-center gap-2">
            <i className="h-2.5 w-2.5 rounded-sm bg-sunk outline outline-1 outline-line" />
            {t(ui.skills.more)}
          </span>
        </div>
      </div>
    </section>
  )
}
