import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from '../elements/container'
import { Heading } from '../elements/heading'
import { Text } from '../elements/text'

export function HeroLeftAlignedWithPhoto({
  eyebrow,
  headline,
  subheadline,
  cta,
  photo,
  footer,
  className,
  ...props
}: {
  eyebrow?: ReactNode
  headline: ReactNode
  subheadline: ReactNode
  cta?: ReactNode
  photo?: ReactNode
  footer?: ReactNode
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-10 sm:py-14', className)} {...props}>
      <Container className="flex flex-col gap-8">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[#d7e4ee] bg-white/96 p-6 shadow-[0_26px_60px_rgb(18_52_88/10%)] sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(73,214,200,0.2)_0%,rgba(73,214,200,0)_68%)]" />
          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="flex flex-col items-start gap-6">
              {eyebrow}
              <Heading className="max-w-4xl">{headline}</Heading>
              <Text size="lg" className="flex max-w-2xl flex-col gap-4">
                {subheadline}
              </Text>
              {cta}
            </div>
            {photo && (
              <div className="overflow-hidden rounded-[1.5rem] border border-[#d7e4ee] bg-[#f4f8fb] p-2 sm:p-3">
                {photo}
              </div>
            )}
          </div>
        </div>
        {footer}
      </Container>
    </section>
  )
}
