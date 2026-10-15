import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { profile } from '../content/profile'

const DURATION = 1400

/** Short intro: a counter while a seedling sprouts, then the panel slides away */
export function Loader({ onDone }: { onDone: () => void }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION)
      setValue(Math.round((1 - Math.pow(1 - p, 2)) * 100))
      // Hold at 100% for a moment, then finish
      if (now - start < DURATION + 250) raf = requestAnimationFrame(tick)
      else onDone()
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  const stem = value / 100

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-8 bg-surface"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden="true"
    >
      <svg width="88" height="110" viewBox="0 0 88 110" fill="none">
        <path d="M14 104h60" stroke="rgb(var(--line))" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M44 104V40"
          stroke="rgb(var(--ink))"
          strokeWidth="3.5"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - stem}
        />
        <g style={{ transformOrigin: '44px 66px', transform: `scale(${Math.max(0, (stem - 0.35) / 0.65)})` }}>
          <path d="M44 66c-14 0-22-8-22-20 12 0 22 6 22 20z" fill="rgb(var(--accent))" />
          <path d="M44 56c12 0 20-8 20-19-11 0-20 6-20 19z" fill="rgb(var(--accent) / 0.7)" />
        </g>
        <circle cx="44" cy="36" r={stem > 0.9 ? 6 : 0} fill="rgb(var(--signal))" style={{ transition: 'r .3s' }} />
      </svg>
      <div className="text-center">
        <div className="font-display text-xl font-bold">{profile.name}</div>
        <div className="mt-1 font-mono text-sm tabular-nums text-muted">{String(value).padStart(3, '0')}%</div>
      </div>
    </motion.div>
  )
}
