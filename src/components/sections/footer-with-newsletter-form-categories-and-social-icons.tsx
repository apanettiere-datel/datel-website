import Link from 'next/link'

import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { ArrowNarrowRightIcon } from '../icons/arrow-narrow-right-icon'

export function FooterCategory({ title, children, ...props }: { title: ReactNode } & ComponentProps<'div'>) {
  return (
    <div {...props}>
      <h3 className="text-base/7 font-semibold text-[#123458]">{title}</h3>
      <ul role="list" className="mt-2 flex flex-col gap-2">
        {children}
      </ul>
    </div>
  )
}

export function FooterLink({ href, className, ...props }: { href: string } & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <li className={clsx('text-[#4f6781] transition-colors hover:text-[#FF9F01]', className)}>
      <Link href={href} {...props} />
    </li>
  )
}

export function SocialLink({
  href,
  name,
  className,
  ...props
}: {
  href: string
  name: string
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <Link
      href={href}
      target="_blank"
      aria-label={name}
      className={clsx('text-[#4f6781] transition-colors hover:text-[#FF9F01] *:size-6', className)}
      {...props}
    />
  )
}

export function NewsletterForm({
  headline,
  subheadline,
  className,
  ...props
}: {
  headline: ReactNode
  subheadline: ReactNode
} & ComponentProps<'form'>) {
  return (
    <form className={clsx('flex max-w-sm flex-col gap-2', className)} {...props}>
      <p className="text-base/7 font-semibold text-[#123458]">{headline}</p>
      <div className="flex flex-col gap-4 text-[#4f6781]">{subheadline}</div>
      <div className="flex items-center rounded-full border border-[#d7e4ee] bg-white px-3 py-2 has-[input:focus]:border-[#FF9F01]">
        <input
          type="email"
          placeholder="Email"
          aria-label="Email"
          className="flex-1 pl-2 text-[#0b1b2b] placeholder:text-[#4f6781]/70 focus:outline-hidden"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="relative inline-flex size-8 items-center justify-center rounded-full bg-[#FF9F01] text-white after:absolute after:-inset-2 hover:bg-[#e58f00] after:pointer-fine:hidden"
        >
          <ArrowNarrowRightIcon />
        </button>
      </div>
    </form>
  )
}

export function FooterWithNewsletterFormCategoriesAndSocialIcons({
  cta,
  links,
  fineprint,
  socialLinks,
  className,
  ...props
}: {
  cta: ReactNode
  links: ReactNode
  fineprint: ReactNode
  socialLinks?: ReactNode
} & ComponentProps<'footer'>) {
  return (
    <footer className={clsx('px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8', className)} {...props}>
      <div className="pb-8">
        <div className="mx-auto w-full max-w-[var(--layout-max-width)]">
          <div className="rounded-[2rem] border border-[#d7e4ee] bg-white px-6 py-10 text-[#123458] shadow-[0_20px_48px_rgb(18_52_88/10%)] sm:px-10 sm:py-12">
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 text-sm/7 lg:grid-cols-2">
              {cta}
              <nav className="grid grid-cols-2 gap-6 sm:has-[>:last-child:nth-child(3)]:grid-cols-3 sm:has-[>:nth-child(5)]:grid-cols-3 md:has-[>:last-child:nth-child(4)]:grid-cols-4 lg:max-xl:has-[>:last-child:nth-child(4)]:grid-cols-2">
                {links}
              </nav>
            </div>
            <div className="mt-10 flex items-center justify-between gap-10 border-t border-[#d7e4ee] pt-6 text-sm/7">
              <div className="text-[#4f6781]">{fineprint}</div>
              {socialLinks && <div className="flex items-center gap-4 sm:gap-10">{socialLinks}</div>}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
