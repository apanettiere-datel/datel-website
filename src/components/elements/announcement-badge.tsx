import Link from 'next/link'

import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { ChevronIcon } from '../icons/chevron-icon'

export function AnnouncementBadge({
  text,
  href,
  cta = 'Learn more',
  variant = 'normal',
  className,
  ...props
}: {
  text: ReactNode
  href: string
  cta?: ReactNode
  variant?: 'normal' | 'overlay'
} & Omit<ComponentProps<'a'>, 'href' | 'children'>) {
  return (
    <Link
      href={href}
      {...props}
      data-variant={variant}
      className={clsx(
        'group relative inline-flex max-w-full gap-x-3 overflow-hidden rounded-md px-3.5 py-2 text-sm/6 max-sm:flex-col sm:items-center sm:rounded-full sm:px-3.5 sm:py-1',
        variant === 'normal' &&
          'border border-[#ffd8a0] bg-linear-to-r from-[#fff3dd] to-[#e8f1fb] text-[#123458] hover:from-[#ffeac6] hover:to-[#dfeaf7]',
        variant === 'overlay' &&
          'bg-mauve-950/15 text-white hover:bg-mauve-950/20',
        className,
      )}
    >
      <span className="text-pretty sm:truncate">{text}</span>
      <span
        className={clsx(
          'h-3 w-px max-sm:hidden',
          variant === 'normal' && 'bg-[#FF9F01]/35',
          variant === 'overlay' && 'bg-white/20',
        )}
      />
      <span
        className={clsx(
          'inline-flex shrink-0 items-center gap-2 font-semibold',
          variant === 'normal' && 'text-[#FF9F01]',
        )}
      >
        {cta} <ChevronIcon className="shrink-0" />
      </span>
    </Link>
  )
}
