import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from '../elements/container'
import { Heading } from '../elements/heading'
import { MotionReveal } from '../elements/motion'
import { Text } from '../elements/text'

export function HeroLeftAlignedWithDemo({
  eyebrow,
  headline,
  subheadline,
  cta,
  demo,
  className,
  ...props
}: {
  eyebrow?: ReactNode
  headline: ReactNode
  subheadline: ReactNode
  cta?: ReactNode
  demo?: ReactNode
} & ComponentProps<'section'>) {
  return (
    <section
      className={clsx(
        'relative -mt-[8.5rem] overflow-x-hidden pt-[calc(var(--scroll-padding-top)+1rem)]',
        className,
      )}
      {...props}
    >
      <div className="pb-24 sm:pb-28 lg:pb-32">
        <Container className="px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-16">
            <div className="max-w-2xl">
              {eyebrow && (
                <MotionReveal className="mb-8" amount={0.2}>
                  <div>{eyebrow}</div>
                </MotionReveal>
              )}
              <MotionReveal delay={0.06} amount={0.2}>
                <Heading className="text-balance text-5xl/13 sm:text-7xl/18">{headline}</Heading>
              </MotionReveal>
              <MotionReveal delay={0.12} amount={0.2}>
                <Text size="lg" className="mt-8 flex flex-col gap-4 text-pretty text-[#4f6781] sm:text-xl/8">
                  {subheadline}
                </Text>
              </MotionReveal>
              {cta && (
                <MotionReveal delay={0.18} amount={0.2}>
                  <div className="mt-10 flex flex-wrap items-center gap-4 [&_a]:transition-transform [&_a]:hover:-translate-y-0.5 [&_a]:focus-visible:-translate-y-0.5">
                    {cta}
                  </div>
                </MotionReveal>
              )}
            </div>

            {demo && (
              <MotionReveal className="w-full lg:pl-8" delay={0.16} y={24} amount={0.18}>
                <div className="-m-2 rounded-xl bg-[#123458]/7 p-2 ring-1 ring-[#123458]/12 ring-inset lg:-m-3 lg:rounded-2xl lg:p-3">
                  <div className="overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-[#123458]/12 lg:rounded-xl">{demo}</div>
                </div>
              </MotionReveal>
            )}
          </div>
        </Container>
      </div>
    </section>
  )
}
