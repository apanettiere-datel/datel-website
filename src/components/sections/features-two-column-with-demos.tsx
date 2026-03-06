import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { flattenChildren } from '../elements/flatten-children'
import { MotionReveal } from '../elements/motion'
import { Section } from '../elements/section'

export function Feature({
  demo,
  headline,
  subheadline,
  cta,
  className,
}: {
  demo: ReactNode
  headline: ReactNode
  subheadline: ReactNode
  cta: ReactNode
} & Omit<ComponentProps<'div'>, 'children'>) {
  return (
    <div className={clsx('rounded-[1.75rem] border border-[#d7e4ee] bg-white p-3 shadow-[0_14px_32px_rgb(18_52_88/10%)]', className)}>
      <div className="relative overflow-hidden rounded-[1.25rem] bg-white">
        {demo}
      </div>
      <div className="flex flex-col gap-4 p-6 sm:p-10 lg:p-8">
        <div>
          <h3 className="text-lg/8 font-semibold text-[#123458]">{headline}</h3>
          <div className="mt-2 flex flex-col gap-4 text-sm/7 text-[#4f6781]">{subheadline}</div>
        </div>
        {cta}
      </div>
    </div>
  )
}

export function FeaturesTwoColumnWithDemos({
  features,
  ...props
}: { features: ReactNode } & Omit<ComponentProps<typeof Section>, 'children'>) {
  const featureItems = flattenChildren(features)

  return (
    <Section {...props}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {featureItems.map((feature, index) => (
          <MotionReveal key={index} delay={index * 0.08} y={18} amount={0.15}>
            {feature}
          </MotionReveal>
        ))}
      </div>
    </Section>
  )
}
