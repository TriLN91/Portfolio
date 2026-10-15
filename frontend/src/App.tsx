import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Cursor } from './components/Cursor'
import { IntroContext } from './components/Intro'
import { Loader } from './components/Loader'
import { Navbar } from './components/Navbar'
import { gsap, prefersReducedMotion, ScrollTrigger } from './lib/gsap'
import { useLenis } from './lib/SmoothScroll'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { ProjectDetail } from './pages/ProjectDetail'
import { treeState } from './three/treeState'

export default function App() {
  const location = useLocation()
  const lenis = useLenis()
  const [introDone, setIntroDone] = useState(false)
  const finishIntro = useCallback(() => setIntroDone(true), [])

  // Lock scrolling while the intro plays
  useEffect(() => {
    if (!lenis) return
    if (introDone) {
      lenis.start()
      // The scrollbar reappears now, so page width changed: re-measure pins
      requestAnimationFrame(() => ScrollTrigger.refresh())
    } else lenis.stop()
  }, [lenis, introDone])

  // The tree's first growth spurt starts when the intro ends
  useEffect(() => {
    if (!introDone) return
    if (prefersReducedMotion()) treeState.intro = 1
    else gsap.to(treeState, { intro: 1, duration: 2.8, ease: 'power2.out' })
  }, [introDone])

  return (
    <IntroContext.Provider value={introDone}>
      <AnimatePresence>{!introDone && <Loader key="loader" onDone={finishIntro} />}</AnimatePresence>
      <Cursor />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </IntroContext.Provider>
  )
}
