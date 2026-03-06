import Link from 'next/link'

import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

const sizes = {
  md: 'px-3 py-1.5 sm:px-4 sm:py-2',
  lg: 'px-4 py-2 sm:px-5 sm:py-2.5',
}

export function Button({
  size = 'md',
  type = 'button',
  color = 'dark/light',
  className,
  ...props
}: {
  size?: keyof typeof sizes
  color?: 'dark/light' | 'light'
} & ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-full border text-sm/7 font-semibold shadow-[0_8px_20px_rgb(18_52_88/14%)] transition-all duration-150 hover:-translate-y-0.5 focus-visible:-translate-y-0.5',
        color === 'dark/light' &&
          'border-[#123458] bg-[#123458] text-white hover:border-[#0e2a47] hover:bg-[#0e2a47] dark:border-[#123458] dark:bg-[#123458] dark:text-white dark:hover:border-[#0e2a47] dark:hover:bg-[#0e2a47]',
        color === 'light' && 'border-[#d7e4ee] bg-white text-[#0b1b2b] hover:bg-[#f4f8fb] dark:border-[#d7e4ee] dark:bg-white dark:hover:bg-[#f4f8fb]',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function ButtonLink({
  size = 'md',
  color = 'dark/light',
  className,
  href,
  ...props
}: {
  href: string
  size?: keyof typeof sizes
  color?: 'dark/light' | 'light'
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <Link
      href={href}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-full border text-sm/7 font-semibold shadow-[0_8px_20px_rgb(18_52_88/14%)] transition-all duration-150 hover:-translate-y-0.5 focus-visible:-translate-y-0.5',
        color === 'dark/light' &&
          'border-[#123458] bg-[#123458] text-white hover:border-[#0e2a47] hover:bg-[#0e2a47] dark:border-[#123458] dark:bg-[#123458] dark:text-white dark:hover:border-[#0e2a47] dark:hover:bg-[#0e2a47]',
        color === 'light' && 'border-[#d7e4ee] bg-white text-[#0b1b2b] hover:bg-[#f4f8fb] dark:border-[#d7e4ee] dark:bg-white dark:hover:bg-[#f4f8fb]',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function SoftButton({
  size = 'md',
  type = 'button',
  className,
  ...props
}: {
  size?: keyof typeof sizes
} & ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-full border border-[#FF9F01] bg-[#FF9F01] text-sm/7 font-semibold text-white shadow-[0_8px_20px_rgb(255_159_1/28%)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#e58f00] hover:bg-[#e58f00] focus-visible:-translate-y-0.5',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function SoftButtonLink({
  size = 'md',
  href,
  className,
  ...props
}: {
  href: string
  size?: keyof typeof sizes
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <Link
      href={href}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-full border border-[#FF9F01] bg-[#FF9F01] text-sm/7 font-semibold text-white shadow-[0_8px_20px_rgb(255_159_1/28%)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#e58f00] hover:bg-[#e58f00] focus-visible:-translate-y-0.5',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function PlainButton({
  size = 'md',
  color = 'dark/light',
  type = 'button',
  className,
  ...props
}: {
  size?: keyof typeof sizes
  color?: 'dark/light' | 'light'
} & ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent text-sm/7 font-semibold transition-colors',
        color === 'dark/light' && 'text-[#123458] hover:border-[#d7e4ee] hover:bg-[#f4f8fb] dark:text-white',
        color === 'light' && 'text-[#123458] hover:border-[#d7e4ee] hover:bg-[#f4f8fb]',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function PlainButtonLink({
  size = 'md',
  color = 'dark/light',
  href,
  className,
  ...props
}: {
  href: string
  size?: keyof typeof sizes
  color?: 'dark/light' | 'light'
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <Link
      href={href}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent text-sm/7 font-semibold transition-colors',
        color === 'dark/light' && 'text-[#123458] hover:border-[#d7e4ee] hover:bg-[#f4f8fb] dark:text-white',
        color === 'light' && 'text-[#123458] hover:border-[#d7e4ee] hover:bg-[#f4f8fb]',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
