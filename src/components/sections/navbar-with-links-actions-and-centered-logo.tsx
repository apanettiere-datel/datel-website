import Link from 'next/link'

import { ElDialog, ElDialogPanel } from '@tailwindplus/elements/react'
import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'

export function NavbarLink({
  children,
  href,
  className,
  ...props
}: { href: string } & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <Link
      href={href}
      className={clsx(
        'group inline-flex items-center justify-between gap-2 text-3xl/10 font-semibold text-[#123458] transition-colors hover:text-[#0e7c86] lg:text-sm/6',
        className,
      )}
      {...props}
    >
      {children}
      <span className="inline-flex p-1.5 opacity-0 group-hover:opacity-100 lg:hidden" aria-hidden="true">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </span>
    </Link>
  )
}

export function NavbarLogo({ className, href, ...props }: { href: string } & Omit<ComponentProps<'a'>, 'href'>) {
  return <Link href={href} {...props} className={clsx('inline-flex items-stretch', className)} />
}

export function NavbarMenu({
  label,
  items,
  panelClassName,
  className,
}: {
  label: ReactNode
  items: { name: ReactNode; description?: ReactNode; href: string }[]
  panelClassName?: string
  className?: string
}) {
  const hasDescriptions = items.some((item) => item.description)

  return (
    <div className={clsx('group relative hidden xl:block', className)}>
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm/7 font-semibold text-[#123458] transition-colors hover:text-[#0e7c86]"
      >
        {label}
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 text-[#4f6781] transition group-hover:text-[#FF9F01]">
          <path
            fillRule="evenodd"
            d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        className={clsx(
          'invisible pointer-events-none absolute left-0 top-full z-30 max-w-[calc(100vw-2rem)] pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100',
          hasDescriptions ? 'w-[30rem]' : 'w-56',
          panelClassName,
        )}
      >
        <div className="rounded-[1.5rem] border border-[#d7e4ee] bg-white p-2 shadow-[0_20px_38px_rgb(18_52_88/12%)]">
          {hasDescriptions ? (
            <div className="grid gap-1">
              {items.map((item) => (
                <Link key={String(item.name)} href={item.href} className="rounded-xl p-3 transition-colors hover:bg-[#f4f8fb]">
                  <p className="text-sm/6 font-semibold text-[#123458]">{item.name}</p>
                  {item.description && <p className="mt-1 text-sm/6 text-[#4f6781]">{item.description}</p>}
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid gap-1">
              {items.map((item) => (
                <Link
                  key={String(item.name)}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm/6 font-semibold text-[#123458] transition-colors hover:bg-[#f4f8fb] hover:text-[#0e7c86]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function NavbarMobileMenuGroup({
  title,
  items,
  className,
}: {
  title: ReactNode
  items: { name: ReactNode; href: string }[]
  className?: string
}) {
  return (
    <div className={clsx('xl:hidden', className)}>
      <p className="text-xs font-semibold tracking-wide text-[#0e7c86] uppercase">{title}</p>
      <div className="mt-2 flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={String(item.name)}
            href={item.href}
            className="rounded-lg px-2 py-1 text-base/7 font-semibold text-[#123458] transition-colors hover:bg-[#f4f8fb] hover:text-[#0e7c86]"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function NavbarWithLinksActionsAndCenteredLogo({
  links,
  logo,
  actions,
  className,
  ...props
}: {
  links: ReactNode
  logo: ReactNode
  actions: ReactNode
} & ComponentProps<'header'>) {
  return (
    <header
      className={clsx('sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8', className)}
      {...props}
    >
      <style>{`:root { --scroll-padding-top: 7rem }`}</style>
      <nav>
        <div className="mx-auto flex h-[5.25rem] max-w-[var(--layout-max-width)] items-center gap-4 rounded-[1.75rem] border border-[#d7e4ee] bg-white px-5 shadow-[0_14px_34px_rgb(18_52_88/12%)] backdrop-blur lg:px-8">
          <div className="flex flex-1 gap-8 max-xl:hidden">{links}</div>
          <div className="flex items-center">{logo}</div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="flex shrink-0 items-center gap-5">{actions}</div>

            <button
              command="show-modal"
              commandfor="mobile-menu"
              aria-label="Toggle menu"
              className="inline-flex rounded-full p-2 text-[#123458] hover:bg-[#e8f1fb] xl:hidden"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path
                  fillRule="evenodd"
                  d="M3.748 8.248a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3.748 15.75a.75.75 0 0 1 .75-.751h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <ElDialog className="xl:hidden">
          <dialog id="mobile-menu" className="backdrop:bg-transparent">
            <ElDialogPanel className="fixed inset-0 bg-white px-6 py-6 xl:px-10">
              <div className="flex justify-end">
                <button
                  command="close"
                  commandfor="mobile-menu"
                  aria-label="Toggle menu"
                  className="inline-flex rounded-full p-2 text-[#123458] hover:bg-[#e8f1fb]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 rounded-[1.75rem] border border-[#d7e4ee] bg-white p-6 shadow-[0_16px_36px_rgb(18_52_88/12%)]">
                <div className="flex flex-col gap-6">{links}</div>
              </div>
            </ElDialogPanel>
          </dialog>
        </ElDialog>
      </nav>
    </header>
  )
}
