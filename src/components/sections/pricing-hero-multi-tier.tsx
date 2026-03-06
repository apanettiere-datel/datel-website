import { ElTabGroup, ElTabList, ElTabPanels } from '@tailwindplus/elements/react'
import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from '../elements/container'
import { Heading } from '../elements/heading'
import { MotionReveal } from '../elements/motion'
import { Text } from '../elements/text'
import { CheckmarkIcon } from '../icons/checkmark-icon'

export function Plan({
  name,
  price,
  period,
  subheadline,
  badge,
  features,
  cta,
  className,
}: {
  name: ReactNode
  price: ReactNode
  period?: ReactNode
  subheadline: ReactNode
  badge?: ReactNode
  features: ReactNode[]
  cta: ReactNode
} & ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'flex flex-col justify-between gap-6 rounded-[1.75rem] border border-[#d7e4ee] bg-white p-7 shadow-[0_14px_32px_rgb(18_52_88/9%)] sm:items-start',
        className,
      )}
    >
      <div className="self-stretch">
        <div className="flex items-center justify-between">
          {badge && (
            <div className="order-last inline-flex rounded-full border border-[#c7e8e2] bg-[#e9f7f4] px-2.5 text-xs/6 font-semibold text-[#0e7c86]">
              {badge}
            </div>
          )}

          <h3 className="text-2xl/8 tracking-tight text-[#123458]">{name}</h3>
        </div>
        <p className="mt-1 inline-flex gap-1 text-base/7">
          <span className="text-[#123458]">{price}</span>
          {period && <span className="text-[#4f6781]">{period}</span>}
        </p>
        <div className="mt-4 flex flex-col gap-4 text-sm/6 text-[#4f6781]">{subheadline}</div>
        <ul className="mt-4 space-y-2 text-sm/6 text-[#4f6781]">
          {features.map((feature, index) => (
            <li key={index} className="flex gap-4">
              <CheckmarkIcon className="h-lh shrink-0 stroke-[#0e7c86]" />
              <p>{feature}</p>
            </li>
          ))}
        </ul>
      </div>
      {cta}
    </div>
  )
}

export function PricingHeroMultiTier<T extends string>({
  eyebrow,
  headline,
  subheadline,
  options,
  plans,
  initialOption,
  prePlans,
  footer,
  className,
  ...props
}: {
  eyebrow?: ReactNode
  headline: ReactNode
  subheadline: ReactNode
  options: readonly T[]
  plans: Record<T, ReactNode>
  initialOption?: T
  prePlans?: ReactNode
  footer?: ReactNode
} & ComponentProps<'section'>) {
  const initialOptionIndex = initialOption ? options.indexOf(initialOption) : 0
  const initialTabIndex = initialOptionIndex >= 0 ? initialOptionIndex : 0

  return (
    <section className={clsx('py-12 sm:py-16', className)} {...props}>
      <ElTabGroup>
        <Container>
          <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[#d7e4ee] bg-white/96 p-6 shadow-[0_24px_56px_rgb(18_52_88/10%)] sm:p-10 lg:p-14">
            <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(73,214,200,0.24)_0%,rgba(73,214,200,0)_68%)]" />
            <div className="relative flex flex-col gap-12">
              <MotionReveal className="flex flex-col items-center gap-6 text-center" amount={0.15}>
                {eyebrow}
                <Heading className="max-w-4xl">{headline}</Heading>
                <Text size="lg" className="flex max-w-3xl flex-col gap-4 text-center">
                  {subheadline}
                </Text>
                <ElTabList className="flex items-center gap-2 rounded-full bg-[#f4f8fb] p-1.5 ring-1 ring-[#d7e4ee]">
                  {options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="rounded-full px-5 py-1.5 text-sm/7 font-semibold text-[#4f6781] transition-colors hover:text-[#0e7c86] aria-selected:bg-white aria-selected:text-[#0e7c86] aria-selected:shadow-[0_3px_10px_rgb(18_52_88/14%)]"
                    >
                      {option}
                    </button>
                  ))}
                </ElTabList>
              </MotionReveal>
              {prePlans ? <MotionReveal delay={0.08}>{prePlans}</MotionReveal> : null}
              <MotionReveal delay={0.14} amount={0.12}>
                <ElTabPanels>
                {options.map((option, index) => (
                  <div
                    key={option}
                    hidden={index !== initialTabIndex}
                    className="grid grid-cols-1 gap-6 sm:has-[>:nth-child(5)]:grid-cols-2 sm:max-lg:has-[>:last-child:nth-child(even)]:grid-cols-2 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none lg:has-[>:nth-child(5)]:grid-flow-row lg:has-[>:nth-child(5)]:grid-cols-3"
                  >
                    {plans[option]}
                  </div>
                ))}
                </ElTabPanels>
              </MotionReveal>
              {footer ? <MotionReveal delay={0.18}>{footer}</MotionReveal> : null}
            </div>
          </div>
        </Container>
      </ElTabGroup>
    </section>
  )
}
