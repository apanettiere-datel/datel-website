import { clsx } from 'clsx/lite'
import { useId, type ComponentProps, type ReactNode } from 'react'
import { flattenChildren } from '../elements/flatten-children'
import { MotionReveal } from '../elements/motion'
import { Section } from '../elements/section'

export function Stat({
  stat,
  text,
  className,
  ...props
}: { stat: ReactNode; text: ReactNode } & ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'rounded-[1.25rem] border border-[#d7e4ee] bg-[#f7fbfe] p-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#c4d8e8] hover:shadow-[0_14px_28px_rgb(18_52_88/10%)]',
        className,
      )}
      {...props}
    >
      <div className="text-2xl/10 font-semibold tracking-tight text-[#123458]">{stat}</div>
      <p className="mt-2 text-sm/7 text-[#4f6781]">{text}</p>
    </div>
  )
}

export function StatsWithGraph({ children, ...props }: ComponentProps<typeof Section>) {
  const pathId = useId()
  const statItems = flattenChildren(children)

  return (
    <Section {...props}>
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-x-0 -top-20 bottom-0 -z-10 sm:-top-16 lg:-top-14">
          <div className="absolute bottom-0 left-1/2 w-[150vw] max-w-[calc(var(--container-7xl)-(--spacing(10)*2))] -translate-x-1/2">
            <svg
              className="h-100 w-full fill-[#4f6781]/7 stroke-[#4f6781]/30"
              viewBox="0 0 1200 400"
              preserveAspectRatio="none"
            >
              <defs>
                <clipPath id={pathId}>
                  <path d="M 0 400 L 0 383 C 396 362.7936732276819, 804 264.31672304481856, 1200 60 L 1200 60 L 1200 400 Z" />
                </clipPath>
              </defs>
              <path
                d="M 0 400 L 0 383 C 396 362.7936732276819, 804 264.31672304481856, 1200 60 L 1200 60 L 1200 400 Z"
                stroke="none"
              />
              <g strokeWidth="1" strokeDasharray="4 3" clipPath={`url(#${pathId})`}>
                <line x1="0.5" y1="400" x2="0.5" y2="0" vectorEffect="non-scaling-stroke" />
                <line x1="92.3076923076923" y1="400" x2="92.3076923076923" y2="0" vectorEffect="non-scaling-stroke" />
                <line x1="184.6153846153846" y1="400" x2="184.6153846153846" y2="0" vectorEffect="non-scaling-stroke" />
                <line x1="276.9230769230769" y1="400" x2="276.9230769230769" y2="0" vectorEffect="non-scaling-stroke" />
                <line x1="369.2307692307692" y1="400" x2="369.2307692307692" y2="0" vectorEffect="non-scaling-stroke" />
                <line x1="461.53846153846155" y1="400" x2="461.53846153846155" y2="0" vectorEffect="non-scaling-stroke" />
                <line x1="553.8461538461538" y1="400" x2="553.8461538461538" y2="0" vectorEffect="non-scaling-stroke" />
                <line x1="646.1538461538462" y1="400" x2="646.1538461538462" y2="0" vectorEffect="non-scaling-stroke" />
                <line x1="738.4615384615385" y1="400" x2="738.4615384615385" y2="0" vectorEffect="non-scaling-stroke" />
                <line x1="830.7692307692307" y1="400" x2="830.7692307692307" y2="0" vectorEffect="non-scaling-stroke" />
                <line x1="923.0769230769231" y1="400" x2="923.0769230769231" y2="0" vectorEffect="non-scaling-stroke" />
                <line x1="1015.3846153846154" y1="400" x2="1015.3846153846154" y2="0" vectorEffect="non-scaling-stroke" />
                <line x1="1107.6923076923076" y1="400" x2="1107.6923076923076" y2="0" vectorEffect="non-scaling-stroke" />
                <line x1="1199.5" y1="400" x2="1199.5" y2="0" vectorEffect="non-scaling-stroke" />
              </g>
              <path
                d="M 0 383 C 396 362.7936732276819, 804 264.31672304481856, 1200 60"
                fill="none"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:auto-cols-fr sm:grid-flow-col-dense">
            {statItems.map((child, index) => (
              <MotionReveal key={index} delay={index * 0.08} y={16} amount={0.2}>
                {child}
              </MotionReveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
