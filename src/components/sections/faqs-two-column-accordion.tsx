'use client'

import { clsx } from 'clsx/lite'
import { AnimatePresence, motion } from 'framer-motion'
import { type ComponentProps, type ReactNode, useId, useState } from 'react'
import { Container } from '../elements/container'
import { MotionReveal } from '../elements/motion'
import { Subheading } from '../elements/subheading'
import { Text } from '../elements/text'
import { MinusIcon } from '../icons/minus-icon'
import { PlusIcon } from '../icons/plus-icon'

export function Faq({
  id,
  question,
  answer,
  ...props
}: { question: ReactNode; answer: ReactNode } & ComponentProps<'div'>) {
  const autoId = useId()
  const [isOpen, setIsOpen] = useState(false)
  id = id || autoId

  return (
    <div id={id} {...props}>
      <button
        type="button"
        id={`${id}-question`}
        aria-expanded={isOpen}
        aria-controls={`${id}-answer`}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-start justify-between gap-6 py-4 text-left text-base/7 font-medium text-[#123458]"
      >
        {question}
        {isOpen ? <MinusIcon className="h-lh stroke-[#0e7c86]" /> : <PlusIcon className="h-lh stroke-[#0e7c86]" />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`${id}-answer`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="-mt-2 flex flex-col gap-2 pr-12 pb-4 text-sm/7 text-[#4f6781]">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQsTwoColumnAccordion({
  headline,
  subheadline,
  className,
  children,
  ...props
}: {
  headline?: ReactNode
  subheadline?: ReactNode
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-12 sm:py-16', className)} {...props}>
      <Container className="grid grid-cols-1 gap-x-2 gap-y-8 lg:grid-cols-2">
        <MotionReveal className="flex flex-col gap-6" amount={0.15}>
          <Subheading>{headline}</Subheading>
          {subheadline && <Text className="flex flex-col gap-4 text-pretty">{subheadline}</Text>}
        </MotionReveal>
        <MotionReveal delay={0.08} amount={0.15}>
          <div className="rounded-[1.5rem] border border-[#d7e4ee] bg-[#eef4f8] px-6 divide-y divide-[#d7e4ee] shadow-[inset_0_1px_0_rgb(255_255_255/65%)]">
            {children}
          </div>
        </MotionReveal>
      </Container>
    </section>
  )
}
