import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export function Eyebrow({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={clsx('text-sm/7 font-semibold tracking-wide text-[#FF9F01] uppercase', className)} {...props}>
      {children}
    </div>
  )
}
