import { motion } from 'framer-motion'
import { useLayoutEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { PageTransition } from '../components/PageTransition'
import { ProductRender } from '../components/ProductRender'
import { FadeIn, SplitText } from '../components/Reveal'
import { profile, projects } from '../content/profile'
import { useLang } from '../i18n/LanguageProvider'
import { ui } from '../i18n/strings'
import { gsap } from '../lib/gsap'
import { usePageSetup } from '../lib/usePageSetup'
import { NotFound } from './NotFound'

export function ProjectDetail() {
  const { slug } = useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  if (index < 0) return <NotFound />
  return <Detail key={slug} index={index} />
}

function Detail({ index }: { index: number }) {
  const { t, lang } = useLang()
  const project = projects[index]
  const next = projects[(index + 1) % projects.length]
  const cs = project.caseStudy
  usePageSetup(`${project.title} · ${profile.name}`)

  const stage = useRef<HTMLDivElement>(null)
  const render = useRef<HTMLDivElement>(null)

  // The product render rises and settles while the page scrolls (parallax)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        render.current,
        { y: 60, rotateX: 8, scale: 0.94 },
        {
          y: -40,
          rotateX: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: stage.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    }, stage)
    return () => ctx.revert()
  }, [])

  const meta = [
    { label: ui.work.myRole, value: t(project.role) },
    { label: ui.detail.year, value: project.year },
    { label: ui.detail.stack, value: project.stack.join(' · ') },
  ].filter((m) => m.value)
  const decisions = cs.decisions ?? []

  return (
    <PageTransition>
      <main className="pt-28">
        <header className="wrap">
          <Link to="/#work" className="font-mono text-xs uppercase tracking-widest text-muted hover:text-ink">
            ← {t(ui.detail.back)}
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className={`pill ${project.status === 'live' ? '!bg-ok/15 !text-ok' : ''}`}>{t(ui.work.status[project.status])}</span>
            <span className="eyebrow">{t(project.kind)}</span>
          </div>
          <SplitText
            key={lang}
            as="h1"
            text={project.title}
            className="mb-6 mt-4 block font-extrabold leading-[0.95] [font-size:clamp(48px,9vw,128px)]"
          />
          <FadeIn>
            <p className="max-w-[56ch] text-[clamp(18px,1.8vw,22px)] text-muted">{t(project.summary)}</p>
          </FadeIn>

          <FadeIn
            delay={0.1}
            className={`mt-10 grid gap-6 border-y border-line py-6 ${meta.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
          >
            {meta.map((m) => (
              <div key={m.label.en} className="min-w-0">
                <div className="eyebrow mb-1.5">{t(m.label)}</div>
                <div className="font-medium">{m.value}</div>
              </div>
            ))}
          </FadeIn>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener" className="btn btn-primary">
                {t(ui.work.demo)} ↗
              </a>
            )}
            {project.code && (
              <a href={project.code} target="_blank" rel="noopener" className="btn">
                {t(ui.work.code)} ↗
              </a>
            )}
          </div>
        </header>

        <div ref={stage} className="wrap my-[clamp(48px,8vw,96px)]" style={{ perspective: '1400px' }}>
          <div className="rounded-[28px] border border-line bg-sunk bg-[radial-gradient(120%_90%_at_20%_0%,rgb(var(--accent-soft)),transparent_60%)] p-[clamp(16px,5vw,72px)]">
            <div ref={render}>
              <ProductRender project={project} />
            </div>
          </div>
        </div>

        {cs.results && cs.results.length > 0 && (
          <section className="wrap grid gap-4 sm:grid-cols-3">
            {cs.results.map((r, i) => (
              <FadeIn key={r.label.en} delay={i * 0.08} className="rounded-2xl bg-surface p-6 card-shadow">
                <b className="block font-display text-[clamp(36px,4vw,52px)] font-bold leading-none text-accent">{r.value}</b>
                <span className="mt-2 block text-sm text-muted">{t(r.label)}</span>
              </FadeIn>
            ))}
          </section>
        )}

        <section className="wrap grid gap-12 py-[clamp(64px,9vw,120px)] md:grid-cols-2">
          <FadeIn>
            <h2 className="eyebrow mb-3">{t(ui.detail.problem)}</h2>
            <p className="font-display text-[clamp(22px,2.2vw,28px)] font-medium leading-snug">{t(cs.problem)}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="eyebrow mb-3">{t(ui.detail.solution)}</h2>
            <p className="font-display text-[clamp(22px,2.2vw,28px)] font-medium leading-snug">{t(cs.solution)}</p>
          </FadeIn>
        </section>

        <section className="bg-surface py-[clamp(64px,9vw,120px)]">
          <div className="wrap">
            <h2 className="eyebrow mb-6">{t(ui.detail.architecture)}</h2>
            <div className="-mx-4 overflow-x-auto px-4 pb-2">
              <ol className="flex w-max items-center gap-3">
                {cs.architecture.map((node, i) => (
                  <motion.li
                    key={node}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                  >
                    <span className="rounded-xl border border-line bg-bg px-4 py-3 font-mono text-sm">{node}</span>
                    {i < cs.architecture.length - 1 && <span className="font-mono text-signal">→</span>}
                  </motion.li>
                ))}
              </ol>
            </div>

            {(decisions.length > 0 || cs.learnings) && (
              <div className={`mt-16 grid gap-12 ${cs.learnings && decisions.length > 0 ? 'lg:grid-cols-[1.4fr_1fr]' : ''}`}>
                {decisions.length > 0 && (
                  <div>
                    <h2 className="eyebrow mb-5">{t(ui.detail.decisions)}</h2>
                    <ul className="grid max-w-[70ch] gap-4">
                      {decisions.map((d, i) => (
                        <FadeIn as="li" key={i} delay={i * 0.06} className="flex gap-4 border-t border-line pt-4 text-lg">
                          <span className="mt-1 font-mono text-sm text-signal">→</span>
                          {t(d)}
                        </FadeIn>
                      ))}
                    </ul>
                  </div>
                )}
                {cs.learnings && (
                  <FadeIn delay={0.1} className="self-start rounded-2xl bg-ink p-7 text-bg">
                    <h2 className="eyebrow mb-3 !text-bg/60">{t(ui.detail.learnings)}</h2>
                    <p className="font-display text-2xl font-medium leading-snug">{t(cs.learnings)}</p>
                  </FadeIn>
                )}
              </div>
            )}
          </div>
        </section>

        <Link
          to={`/projects/${next.slug}`}
          data-cursor="view"
          className="group wrap block py-[clamp(64px,9vw,120px)]"
        >
          <span className="eyebrow">{t(ui.detail.next)}</span>
          <span className="mt-3 flex items-center gap-4 font-display font-extrabold leading-none [font-size:clamp(40px,8vw,104px)]">
            {next.title}
            <span className="text-accent transition-transform duration-500 group-hover:translate-x-4">→</span>
          </span>
        </Link>
      </main>
      <div className="border-t border-line">
        <Footer />
      </div>
    </PageTransition>
  )
}
