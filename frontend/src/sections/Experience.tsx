import { useLayoutEffect, useRef } from 'react'
import { FadeIn, SplitText } from '../components/Reveal'
import { experience } from '../content/profile'
import { useLang } from '../i18n/LanguageProvider'
import { ui } from '../i18n/strings'
import { gsap } from '../lib/gsap'

export function Experience() {
  const { t, lang } = useLang()
  const list = useRef<HTMLOListElement>(null)
  const line = useRef<HTMLSpanElement>(null)

  // The timeline line draws itself as you scroll through the list
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: { trigger: list.current, start: 'top 75%', end: 'bottom 55%', scrub: true },
        },
      )
    }, list)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" className="bg-surface py-[clamp(72px,10vw,140px)]">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <div>
          <span className="eyebrow">{t(ui.experience.eyebrow)}</span>
          <SplitText key={lang} as="h2" text={t(ui.experience.title)} className="section-title block" />
        </div>

        <ol ref={list} className="relative min-w-0 pl-8">
          <span className="absolute bottom-0 left-[5px] top-2 w-0.5 bg-line" />
          <span ref={line} className="absolute bottom-0 left-[5px] top-2 w-0.5 bg-accent" />
          {experience.map((item, i) => (
            <FadeIn as="li" key={i} delay={i * 0.06} className="relative pb-12 last:pb-0">
              <span className="absolute -left-8 top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-surface" />
              <div className="flex flex-wrap items-center gap-3">
                <time className="font-mono text-xs tracking-wider text-muted">{item.period}</time>
                <span className="pill">{t(ui.experience.types[item.type])}</span>
              </div>
              <h3 className="mb-1 mt-2 text-2xl font-bold">{t(item.title)}</h3>
              <div className="text-sm font-semibold text-accent">{item.org}</div>
              <p className="mt-3 max-w-[58ch] text-muted">{t(item.text)}</p>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  )
}
