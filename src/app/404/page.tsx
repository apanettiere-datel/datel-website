import NextLink from 'next/link'
import type { ComponentProps } from 'react'

import { ArrowNarrowLeftIcon } from '@/components/icons/arrow-narrow-left-icon'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { BookOpenIcon } from '@/components/icons/book-open-icon'
import { ChatBubbleCircleEllipsisIcon } from '@/components/icons/chat-bubble-circle-ellipsis-icon'
import { NewspaperIcon } from '@/components/icons/newspaper-icon'
import { UnorderedListIcon } from '@/components/icons/unordered-list-icon'
import { GitHubIcon } from '@/components/icons/social/github-icon'
import { InstagramIcon } from '@/components/icons/social/instagram-icon'
import { XIcon } from '@/components/icons/social/x-icon'

const helpfulLinks = [
  {
    name: 'Cloud SWEET platform',
    href: '/pricing',
    description: 'Review base platform capabilities plus real-time and AI add-ons.',
    icon: BookOpenIcon,
  },
  {
    name: 'Contact SWEET solutions',
    href: '/contact-sweet',
    description: 'Compare Standard, Small Business, and Enterprise editions.',
    icon: UnorderedListIcon,
  },
  {
    name: 'Documentation',
    href: '/docs',
    description: 'Access product references, planning content, and implementation guidance.',
    icon: NewspaperIcon,
  },
  {
    name: 'Contact sales and support',
    href: '/contact',
    description: 'Talk with DATEL about pricing, rollout planning, or technical questions.',
    icon: ChatBubbleCircleEllipsisIcon,
  },
] as const

const socialLinks = [
  { name: 'X', href: 'https://x.com', icon: XIcon },
  { name: 'GitHub', href: 'https://github.com', icon: GitHubIcon },
  { name: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
] as const

function SocialLink({
  href,
  children,
  ...props
}: { href: string } & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[#4f6781] transition-colors hover:text-[#123458]"
      {...props}
    >
      {children}
    </a>
  )
}

export default function Page() {
  return (
    <div className="bg-transparent">
      <main className="mx-auto w-full max-w-[var(--layout-max-width)] px-6 pt-8 pb-14 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-[#d7e4ee] bg-white p-8 shadow-[0_24px_56px_rgb(18_52_88/12%)] sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,159,1,0.16)_0%,rgba(255,159,1,0)_68%)]" />
          <div className="pointer-events-none absolute -left-20 bottom-[-3rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(73,214,200,0.16)_0%,rgba(73,214,200,0)_68%)]" />

          <img
            src="https://www.datel-group.com/wp-content/uploads/2015/05/datel-logo-retina-display1.png"
            width="120"
            height="404"
            alt="Datel Group"
            className="mx-auto h-11 w-auto"
          />

          <div className="mx-auto mt-8 max-w-2xl text-center">
            <p className="text-sm/6 font-semibold tracking-wide text-[#FF9F01] uppercase">404</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight text-[#015596] sm:text-6xl">This page is not available</h1>
            <p className="mt-5 text-lg/8 text-[#4f6781]">The link may be outdated or the page may have moved. Use one of these destinations to continue.</p>
          </div>

          <div className="mx-auto mt-14 max-w-5xl">
            <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {helpfulLinks.map((link) => (
                <li key={link.name}>
                  <NextLink
                    href={link.href}
                    className="group flex h-full items-start gap-4 rounded-2xl border border-[#d7e4ee] bg-[#f8fbfe] p-5 transition-colors hover:bg-white"
                  >
                    <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1fb] text-[#123458]">
                      <link.icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm/6 font-semibold text-[#015596]">{link.name}</span>
                      <span className="mt-1 block text-sm/6 text-[#4f6781]">{link.description}</span>
                    </span>
                    <span className="mt-1 text-[#4f6781] transition-transform group-hover:translate-x-0.5 group-hover:text-[#123458]">
                      <ArrowNarrowRightIcon className="size-4" />
                    </span>
                  </NextLink>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#d7e4ee] bg-white px-5 py-4">
              <NextLink href="/" className="inline-flex items-center gap-2 text-sm/6 font-semibold text-[#123458]">
                <ArrowNarrowLeftIcon className="size-4" />
                Back to home
              </NextLink>
              <p className="text-sm/6 text-[#4f6781]">Need immediate help: (724) 940-0400 or support@datel-group.com</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="pb-10">
        <div className="mx-auto flex max-w-[var(--layout-max-width)] flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-8">
          <p className="text-sm/6 text-[#4f6781]">© 2026 DATEL Software Solutions, LLC</p>
          <div className="flex items-center gap-4">
            {socialLinks.map((item) => (
              <SocialLink key={item.name} href={item.href} aria-label={item.name}>
                <item.icon className="size-5" />
              </SocialLink>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
