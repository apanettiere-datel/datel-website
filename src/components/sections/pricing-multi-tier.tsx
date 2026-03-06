import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { flattenChildren } from '../elements/flatten-children'
import { MotionReveal } from '../elements/motion'
import { Section } from '../elements/section'
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

export function PricingMultiTier({
  plans,
  ...props
}: {
  plans: ReactNode
} & ComponentProps<typeof Section>) {
  const planItems = flattenChildren(plans)

  return (
    <Section {...props}>
      <div className="grid grid-cols-1 gap-6 sm:has-[>:nth-child(5)]:grid-cols-2 sm:max-lg:has-[>:last-child:nth-child(even)]:grid-cols-2 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none lg:has-[>:nth-child(5)]:grid-flow-row lg:has-[>:nth-child(5)]:grid-cols-3">
        {planItems.map((plan, index) => (
          <MotionReveal key={index} delay={index * 0.08} y={18} amount={0.2}>
            {plan}
          </MotionReveal>
        ))}
      </div>
    </Section>
  )
}
