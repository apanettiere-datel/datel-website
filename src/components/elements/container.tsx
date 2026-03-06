import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export function Container({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'mx-auto w-full max-w-[var(--layout-max-width-sm)] px-6 md:max-w-[var(--layout-max-width-md)] lg:max-w-[var(--layout-max-width)] lg:px-10',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
