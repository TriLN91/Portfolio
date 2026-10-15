import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ProductRender } from '../components/ProductRender'
import { SplitText } from '../components/Reveal'
import { projects } from '../content/profile'
import type { Project } from '../content/types'
import { useLang } from '../i18n/LanguageProvider'
import { ui } from '../i18n/strings'
import { gsap } from '../lib/gsap'

function StatusPill({ status }: { status: Project['status'] }) {
  const { t } = useLang()
  const live = status === 'live'
  return <span className={`pill ${live ? '!bg-ok/15 !text-ok' : ''}`}>{t(ui.work.status[status])}</span>
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLang()
  return (
    <article className="project-card grid w-full flex-none items-center gap-8 border-t border-line pt-10 lg:w-[min(82vw,1080px)] lg:grid-cols-[1fr_1.25fr] lg:gap-14 lg:border-0 lg:pt-0">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-sm text-muted tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <StatusPill status={project.status} />
          <span className="eyebrow">{t(project.kind)}</span>
        </div>
        <h3 className="mb-2 mt-4 text-[clamp(30px,3.4vw,44px)] font-bold leading-none">{project.title}</h3>
        <p className="mb-4 text-sm font-semibold text-accent">
          {t(ui.work.myRole)}: {t(project.role)}
        </p>
        <p className="mb-5 text-muted">{t(project.summary)}</p>
        <ul className="mb-6 grid gap-2">
          {project.impact.map((item) => (
            <li key={item.en} className="flex gap-3 text-[15px]">
              <span className="font-mono text-signal">→</span>
              {t(item)}
            </li>
          ))}
        </ul>
        <div className="mb-6 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="rounded-md border border-line px-2 py-1 font-mono text-xs">
              {s}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link to={`/projects/${project.slug}`} className="btn btn-primary !py-2.5 !text-sm">
            {t(ui.work.caseStudy)}
          </Link>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener" className="btn !py-2.5 !text-sm">
              {t(ui.work.demo)} ↗
            </a>
          )}
          {project.code && (
            <a href={project.code} target="_blank" rel="noopener" className="btn !py-2.5 !text-sm">
              {t(ui.work.code)} ↗
            </a>
          )}
        </div>
      </div>

      <Link
        to={`/projects/${project.slug}`}
        data-cursor="view"
        tabIndex={-1}
        className="group relative order-first block min-w-0 overflow-hidden rounded-3xl border border-line bg-sunk p-[clamp(18px,3vw,40px)] lg:order-none"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_0%,rgb(var(--accent-soft)),transparent_60%)]" />
        <div data-parallax className="relative transition-transform duration-700 ease-out group-hover:scale-[1.02]">
          <ProductRender project={project} />
        </div>
      </Link>
    </article>
  )
}

/** On desktop the section pins and the projects slide horizontally as you scroll */
export function Projects() {
  const { t, lang } = useLang()
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const el = track.current!
      const distance = () => Math.max(0, el.scrollWidth - document.documentElement.clientWidth)
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
      // Product renders drift slightly against the horizontal movement (parallax)
      el.querySelectorAll<HTMLElement>('[data-parallax]').forEach((p) => {
        gsap.fromTo(
          p,
          { xPercent: 7 },
          {
            xPercent: -7,
            ease: 'none',
            scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          },
        )
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="work" ref={section} className="relative overflow-hidden bg-surface lg:flex lg:h-[100svh] lg:items-center">
      <div
        ref={track}
        className="flex flex-col gap-14 py-[clamp(72px,10vw,120px)] lg:w-max lg:flex-row lg:items-center lg:gap-24 lg:py-0"
        style={{ paddingInline: 'clamp(16px, 4vw, 40px)' }}
      >
        <header className="flex-none lg:w-[min(32vw,420px)]">
          <span className="eyebrow">{t(ui.work.eyebrow)}</span>
          <SplitText key={lang} as="h2" text={t(ui.work.title)} className="section-title mb-5 block" />
          <p className="max-w-[40ch] text-muted">{t(ui.work.intro)}</p>
          <div className="mt-8 hidden items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted lg:flex">
            <span className="h-px w-10 bg-current" />
            scroll →
          </div>
        </header>
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
        <div className="hidden w-[8vw] flex-none lg:block" />
      </div>
    </section>
  )
}
