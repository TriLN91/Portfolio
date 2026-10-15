import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '../i18n/LanguageProvider'
import { ui } from '../i18n/strings'

/**
 * Dot + trailing ring that follows the mouse.
 * Grows over links/buttons; shows "View" over elements with data-cursor="view".
 * Only active on devices with a precise pointer and no reduced-motion preference.
 */
export function Cursor() {
  const { t } = useLang()
  const location = useLocation()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<'default' | 'hover' | 'view'>('default')

  useEffect(() => {
    const ok =
      window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(ok)
  }, [])

  // Reset hover state after navigation (the hovered element may be gone)
  useEffect(() => setMode('default'), [location.pathname])

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const pos = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let raf = 0

    const move = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
    }
    const over = (e: PointerEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('[data-cursor="view"]')) setMode('view')
      else if (el.closest('a, button, input, textarea, label, [data-cursor="hover"]')) setMode('hover')
      else setMode('default')
    }
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18
      ringPos.y += (pos.y - ringPos.y) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    raf = requestAnimationFrame(loop)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div ref={ring} className={`cursor-ring ${mode === 'hover' ? 'is-hover' : ''} ${mode === 'view' ? 'is-view' : ''}`}>
        <span>{t(ui.work.view)}</span>
      </div>
      <div ref={dot} className="cursor-dot" />
    </>
  )
}
