import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from './gsap'

const LenisContext = createContext<Lenis | null>(null)

/** Inertia scrolling (Lenis) wired into GSAP ScrollTrigger */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const instance = new Lenis({ duration: 1.15, smoothWheel: true })
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)

const NAV_OFFSET = -72

/** Scroll to a section id ("#work") or a pixel position, with or without Lenis */
export function scrollToTarget(lenis: Lenis | null, target: string | number, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === 'string' ? NAV_OFFSET : 0, immediate })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' })
    return
  }
  const el = document.querySelector(target)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET
    window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' })
  }
}
