import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from './gsap'
import { scrollToTarget, useLenis } from './SmoothScroll'

/** On every page mount: jump to the top (or to #hash) and recalculate scroll animations */
export function usePageSetup(title: string) {
  const lenis = useLenis()
  const { hash } = useLocation()

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    scrollToTarget(lenis, 0, true)
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    let timer: ReturnType<typeof setTimeout> | undefined
    if (hash) timer = setTimeout(() => scrollToTarget(lenis, hash), 350)
    return () => {
      cancelAnimationFrame(raf)
      if (timer) clearTimeout(timer)
    }
    // Run once per page mount (and when Lenis becomes available)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis])
}
