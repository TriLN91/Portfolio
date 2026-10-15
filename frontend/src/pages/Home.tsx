import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Footer } from '../components/Footer'
import { PageTransition } from '../components/PageTransition'
import { profile } from '../content/profile'
import { useLang } from '../i18n/LanguageProvider'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { usePageSetup } from '../lib/usePageSetup'
import { About } from '../sections/About'
import { Contact } from '../sections/Contact'
import { Experience } from '../sections/Experience'
import { GitHubActivity } from '../sections/GitHubActivity'
import { Hero } from '../sections/Hero'
import { Projects } from '../sections/Projects'
import { Skills } from '../sections/Skills'
import { treeState } from '../three/treeState'

// Three.js is large; load it after the page shell has rendered
const TreeScene = lazy(() => import('../three/TreeScene'))

export function Home() {
  const { t } = useLang()
  usePageSetup(`${profile.name} · ${t(profile.role)}`)
  const canvasWrap = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)

  // Scroll through hero + about grows the tree; the scene fades out when projects arrive
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#top',
        start: 'top top',
        endTrigger: '#about',
        end: 'bottom bottom',
        onUpdate: (self) => {
          treeState.scroll = self.progress
        },
      })
      gsap.to(canvasWrap.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '#about', start: 'top 30%', endTrigger: '#work', end: 'top 35%', scrub: true },
      })
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top 35%',
        onEnter: () => setActive(false),
        onLeaveBack: () => setActive(true),
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const move = (e: PointerEvent) => {
      treeState.mx = (e.clientX / window.innerWidth - 0.5) * 2
      treeState.my = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <PageTransition>
      <div ref={canvasWrap} className="pointer-events-none fixed inset-0 z-0 opacity-30 sm:opacity-75 lg:opacity-100" aria-hidden="true">
        <Suspense fallback={null}>
          <TreeScene active={active} />
        </Suspense>
      </div>
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <GitHubActivity />
        <Contact />
      </main>
      <div className="relative z-10 bg-surface">
        <Footer />
      </div>
    </PageTransition>
  )
}
