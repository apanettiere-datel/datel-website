'use client'

import { clsx } from 'clsx/lite'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const easeOutQuint = [0.22, 1, 0.36, 1] as const

export function MotionReveal({
  children,
  className,
  delay = 0,
  y = 20,
  duration = 0.6,
  once = true,
  amount = 0.25,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
  once?: boolean
  amount?: number
}) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={clsx(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: easeOutQuint }}
    >
      {children}
    </motion.div>
  )
}
