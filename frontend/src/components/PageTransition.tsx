import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const ease = [0.76, 0, 0.24, 1] as const

/** Wraps a route: a colored curtain covers the old page, then lifts off the new one */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }}>
      {children}
      {/* Lifts away when the page enters */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[80] origin-top bg-accent"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.05 }}
      />
      {/* Rises to cover the screen when the page leaves */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[80] origin-bottom bg-accent"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.55, ease }}
      />
    </motion.div>
  )
}
