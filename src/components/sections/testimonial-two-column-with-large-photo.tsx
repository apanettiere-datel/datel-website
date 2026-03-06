import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from '../elements/container'

export function TestimonialTwoColumnWithLargePhoto({
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
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-12 sm:py-16', className)} {...props}>
      <Container>
        <figure className="grid grid-cols-1 gap-x-6 rounded-[var(--radius-card)] border border-[#d7e4ee] bg-white p-4 shadow-[0_18px_40px_rgb(18_52_88/10%)] lg:grid-cols-2">
          <div className="flex flex-col items-start justify-between gap-10 p-6 text-[#123458] sm:p-10">
            <blockquote className="relative flex flex-col gap-4 text-2xl/9 text-pretty *:first:before:absolute *:first:before:inline *:first:before:-translate-x-full *:first:before:content-['“'] *:last:after:inline *:last:after:content-['”']">
              {quote}
            </blockquote>
            <figcaption className="text-sm/7">
              <p className="font-semibold">{name}</p>
              <p className="text-[#4f6781]">{byline}</p>
            </figcaption>
          </div>
          <div className="flex overflow-hidden rounded-[1.25rem] border border-[#d7e4ee] *:object-cover">
            {img}
          </div>
        </figure>
      </Container>
    </section>
  )
}
