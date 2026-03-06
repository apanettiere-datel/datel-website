import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { flattenChildren } from '../elements/flatten-children'
import { MotionReveal } from '../elements/motion'
import { Section } from '../elements/section'

export function Testimonial({
  quote,
  img,
  name,
  byline,
  className,
  ...props
}: {
  quote: ReactNode
  img: ReactNode
  name: ReactNode
  byline: ReactNode
} & ComponentProps<'blockquote'>) {
  return (
    <figure
      className={clsx(
        'flex flex-col justify-between gap-10 rounded-[1.75rem] border border-[#d7e4ee] bg-white p-6 text-sm/7 text-[#123458] shadow-[0_14px_30px_rgb(18_52_88/9%)]',
        className,
      )}
      {...props}
    >
      <blockquote className="relative flex flex-col gap-4 *:first:before:absolute *:first:before:inline *:first:before:-translate-x-full *:first:before:content-['“'] *:last:after:inline *:last:after:content-['”']">
        {quote}
      </blockquote>
      <figcaption className="flex items-center gap-4">
        <div className="flex h-11 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#d7e4ee] bg-white p-0">
          {img}
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-[#4f6781]">{byline}</p>
        </div>
      </figcaption>
    </figure>
  )
}

export function TestimonialThreeColumnGrid({ children, ...props }: ComponentProps<typeof Section>) {
  const testimonialItems = flattenChildren(children)

  return (
    <Section {...props}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonialItems.map((item, index) => (
          <MotionReveal key={index} delay={index * 0.08} y={18} amount={0.2}>
            {item}
          </MotionReveal>
        ))}
      </div>
    </Section>
  )
}
