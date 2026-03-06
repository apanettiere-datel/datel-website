import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from './container'
import { Eyebrow } from './eyebrow'
import { MotionReveal } from './motion'
import { Subheading } from './subheading'
import { Text } from './text'

export function Section({
  eyebrow,
  headline,
  subheadline,
  cta,
  className,
  children,
  ...props
}: {
  eyebrow?: ReactNode
  headline?: ReactNode
  subheadline?: ReactNode
  cta?: ReactNode
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-12 sm:py-16', className)} {...props}>
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[#d7e4ee] bg-white/96 p-6 shadow-[0_26px_60px_rgb(18_52_88/10%)] sm:p-10 lg:p-14">
          <div className="absolute inset-x-10 top-0 h-1 rounded-full bg-linear-to-r from-[#3d6f9f] via-[#FF9F01] to-[#5f7f9f]" />
          <div className="pointer-events-none absolute -top-44 right-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,159,1,0.2)_0%,rgba(255,159,1,0)_68%)]" />
          <div className="relative flex flex-col gap-10 sm:gap-14">
            {headline && (
              <MotionReveal className="flex max-w-3xl flex-col gap-6" amount={0.15}>
                <div className="flex flex-col gap-2">
                  {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                  <Subheading>{headline}</Subheading>
                </div>
                {subheadline && <Text className="text-pretty">{subheadline}</Text>}
                {cta}
              </MotionReveal>
            )}
            <MotionReveal delay={0.08} amount={0.12}>
              <div>{children}</div>
            </MotionReveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
