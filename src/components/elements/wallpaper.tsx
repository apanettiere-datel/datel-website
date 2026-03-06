import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

const html = String.raw

const noisePattern = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  html`
    <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250" viewBox="0 0 100 100">
      <filter id="n">
        <feTurbulence
          type="turbulence"
          baseFrequency="1.4"
          numOctaves="1"
          seed="2"
          stitchTiles="stitch"
          result="n"
        />
        <feComponentTransfer result="g">
          <feFuncR type="linear" slope="4" intercept="1" />
          <feFuncG type="linear" slope="4" intercept="1" />
          <feFuncB type="linear" slope="4" intercept="1" />
        </feComponentTransfer>
        <feColorMatrix type="saturate" values="0" in="g" />
      </filter>
      <rect width="100%" height="100%" filter="url(#n)" />
    </svg>
  `.replace(/\s+/g, ' '),
)}")`

export function Wallpaper({
  children,
  color,
  className,
  ...props
}: { color: 'green' | 'blue' | 'purple' | 'brown' } & ComponentProps<'div'>) {
  return (
    <div
      data-color={color}
      className={clsx(
        'relative overflow-hidden rounded-[1.25rem] bg-linear-to-br data-[color=blue]:from-[#123458] data-[color=blue]:to-[#0e2a47] data-[color=brown]:from-[#4f6781] data-[color=brown]:to-[#123458] data-[color=green]:from-[#123458] data-[color=green]:to-[#FF9F01] data-[color=purple]:from-[#4f6781] data-[color=purple]:to-[#123458] dark:data-[color=blue]:from-[#0e2a47] dark:data-[color=blue]:to-[#0b1b2b] dark:data-[color=brown]:from-[#123458] dark:data-[color=brown]:to-[#0b1b2b] dark:data-[color=green]:from-[#0e2a47] dark:data-[color=green]:to-[#FF9F01] dark:data-[color=purple]:from-[#123458] dark:data-[color=purple]:to-[#0b1b2b]',
        className,
      )}
      {...props}
    >
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay dark:opacity-25"
        style={{
          backgroundPosition: 'center',
          backgroundImage: noisePattern,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
