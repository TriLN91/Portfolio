import { motion, useReducedMotion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

const ease = [0.2, 0.7, 0.2, 1] as const

/** Splits a heading into words that slide up from a mask, one after another */
export function SplitText({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  play,
}: {
  text: string
  as?: ElementType
  className?: string
  delay?: number
  /** Set to control playback manually (e.g. wait for the intro). Omit to play when scrolled into view. */
  play?: boolean
}) {
  const reduced = useReducedMotion()
  const words = text.split(' ')
  // The visible mask is what gets observed: the word itself starts clipped,
  // so an observer on it would never report it as visible.
  const trigger =
    play === undefined
      ? { whileInView: 'show', viewport: { once: true, amount: 0.5 } }
      : { animate: play ? 'show' : 'hidden' }
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.08em] align-top"
          initial={reduced ? false : 'hidden'}
          {...trigger}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%' },
              show: { y: '0%', transition: { duration: 0.9, ease, delay: delay + i * 0.06 } },
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  )
}

/** Fades and lifts content in when it scrolls into view */
export function FadeIn({
  children,
  className = '',
  delay = 0,
  y = 36,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'li' | 'article' | 'section'
}) {
  const reduced = useReducedMotion()
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </Comp>
  )
}
