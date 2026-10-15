import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useIntroDone } from '../components/Intro'
import { SplitText } from '../components/Reveal'
import { profile } from '../content/profile'
import { useLang } from '../i18n/LanguageProvider'
import { ui } from '../i18n/strings'
import { scrollToTarget, useLenis } from '../lib/SmoothScroll'
import { growth } from '../three/treeState'

const ease = [0.2, 0.7, 0.2, 1] as const

/** Live readout of the tree's growth, updated without re-rendering React */
function GrowthReadout() {
  const { t } = useLang()
  const value = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    let raf = 0
    const loop = () => {
      const g = growth()
      if (value.current) value.current.textContent = `${String(Math.round(g * 100)).padStart(3, '0')}%`
      if (bar.current) bar.current.style.transform = `scaleX(${g})`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted">
      <span>{t(ui.hero.growth)}</span>
      <span className="relative h-px w-24 overflow-hidden bg-line">
        <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-signal" />
      </span>
      <span ref={value} className="tabular-nums text-ink">000%</span>
    </div>
  )
}

export function Hero() {
  const { t, lang } = useLang()
  const lenis = useLenis()
  const ready = useIntroDone()

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease, delay },
  })

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center pb-24 pt-28">
      <div className="wrap">
        <div className="max-w-[640px]">
          <motion.span
            {...fade(0.1)}
            className="inline-flex items-center gap-2 rounded-full bg-ok/10 px-3 py-1.5 font-mono text-[13px] text-ok"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
            </span>
            {t(profile.status)}
          </motion.span>

          <h1 className="mb-5 mt-6 font-extrabold leading-[0.95]" style={{ fontSize: 'clamp(48px, 8.4vw, 112px)' }}>
            <SplitText key={`n-${lang}`} text={profile.name} className="block" play={ready} delay={0.15} />
            <SplitText key={`r-${lang}`} text={t(profile.role)} className="block text-accent" play={ready} delay={0.35} />
          </h1>

          <motion.p {...fade(0.55)} className="mb-8 max-w-[52ch] text-[clamp(17px,1.5vw,19px)] text-muted">
            {t(profile.lede)}
          </motion.p>

          <motion.div {...fade(0.7)} className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={() => scrollToTarget(lenis, '#work')}>
              {t(ui.hero.viewWork)}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <a className="btn" href={profile.cv} target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <path d="M14 3v6h6M8 13h8M8 17h5" />
              </svg>
              {t(ui.hero.viewCv)}
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        {...fade(1)}
        className="wrap absolute inset-x-0 bottom-8 flex flex-wrap items-end justify-between gap-4"
      >
        <button
          type="button"
          onClick={() => scrollToTarget(lenis, '#about')}
          className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted hover:text-ink"
        >
          <span className="relative h-9 w-[22px] rounded-full border border-current">
            <motion.span
              className="absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 rounded-full bg-current"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
          {t(ui.hero.scroll)}
        </button>
        <GrowthReadout />
      </motion.div>
    </section>
  )
}
