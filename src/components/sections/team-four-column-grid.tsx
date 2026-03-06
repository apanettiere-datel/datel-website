import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Section } from '../elements/section'

export function TeamMember({
  img,
  name,
  byline,
  className,
  ...props
}: {
  img: ReactNode
  name: ReactNode
  byline: ReactNode
} & ComponentProps<'li'>) {
  return (
    <li className={clsx('flex flex-col gap-4 rounded-[1.5rem] border border-[#d7e4ee] bg-[#f7fbfe] p-4 text-sm/7', className)} {...props}>
      <div className="aspect-3/4 w-full overflow-hidden rounded-[1rem] border border-[#d7e4ee] *:size-full *:object-cover">
        {img}
      </div>
      <div>
        <p className="font-semibold text-[#123458]">{name}</p>
        <p className="text-[#4f6781]">{byline}</p>
      </div>
    </li>
  )
}

export function TeamFourColumnGrid({ children, ...props }: ComponentProps<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {children}
      </ul>
    </Section>
  )
}
