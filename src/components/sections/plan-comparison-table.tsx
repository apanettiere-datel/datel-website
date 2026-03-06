import { ElTabGroup, ElTabList, ElTabPanels } from '@tailwindplus/elements/react'
import { clsx } from 'clsx/lite'
import { type ComponentProps, type ReactNode } from 'react'
import { Container } from '../elements/container'
import { CheckmarkIcon } from '../icons/checkmark-icon'
import { MinusIcon } from '../icons/minus-icon'

function FeatureGroup<Plan extends string>({
  group,
  plans,
}: {
  group: {
    title: ReactNode
    features: { name: ReactNode; value: ReactNode | Record<Plan, ReactNode> }[]
  }
  plans: Plan[]
}) {
  return (
    <tbody>
      <tr>
        <th
          colSpan={plans.length + 1}
          scope="colgroup"
          className="border-t border-b border-t-[#d7e4ee] border-b-[#d7e4ee] pt-14 pb-4 font-semibold text-[#123458]"
        >
          {group.title}
        </th>
      </tr>
      {group.features.map((feature) => (
        <tr key={String(feature.name)} className="group">
          <th
            scope="row"
            className="border-t border-[#d7e4ee] py-4 pr-3 font-normal text-[#4f6781] group-first:border-[#d7e4ee]"
          >
            {feature.name}
          </th>
          {plans.map((plan) => {
            const value = ((value: any): value is Record<Plan, ReactNode> =>
              typeof value === 'object' && value !== null && plan in value)(feature.value)
              ? feature.value[plan]
              : feature.value

            return (
              <td
                key={plan}
                className="border-t border-[#d7e4ee] px-3 py-4 text-center text-[#4f6781] group-first:border-[#d7e4ee]"
              >
                {value === true ? (
                  <CheckmarkIcon aria-label="Included" className="stroke-[#0e7c86]" />
                ) : value === false ? (
                  <MinusIcon aria-label="Not included" className="stroke-[#123458]" />
                ) : (
                  value
                )}
              </td>
            )
          })}
        </tr>
      ))}
    </tbody>
  )
}

export function PlanComparisonTable<const Plan extends string>({
  plans,
  features,
  className,
  ...props
}: {
  plans: Plan[]
  features: {
    title: ReactNode
    features: { name: ReactNode; value: ReactNode | Record<Plan, ReactNode> }[]
  }[]
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-12 sm:py-16', className)} {...props}>
      <Container>
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[#d7e4ee] bg-white p-4 shadow-[0_20px_48px_rgb(18_52_88/10%)] sm:p-6">
          <table className="w-full border-collapse text-left text-sm/5 max-sm:hidden">
            <colgroup>
              <col className="w-2/5" />
              {plans.map((plan) => (
                <col key={plan} style={{ width: `calc(60% / ${plans.length})` }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th className="sticky top-(--scroll-padding-top) rounded-tl-xl border-b border-[#d7e4ee] bg-[#f4f8fb] py-5 pr-3 text-base/7 font-semibold text-[#123458]">
                  Compare features
                </th>
                {plans.map((plan, index) => (
                  <th
                    key={index}
                    className="sticky top-(--scroll-padding-top) border-b border-[#d7e4ee] bg-[#f4f8fb] p-3 text-center font-semibold text-[#123458] last:rounded-tr-xl"
                  >
                    {plan}
                  </th>
                ))}
              </tr>
            </thead>
            {features.map((group, index) => (
              <FeatureGroup key={index} group={group} plans={plans} />
            ))}
          </table>

          <div className="sm:hidden">
            <ElTabGroup>
              <ElTabList className="flex gap-6">
                {plans.map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    className="relative -mb-px flex-1 border-b border-b-transparent px-2 py-6 text-sm/5 font-medium text-[#4f6781] aria-selected:border-[#0e7c86] aria-selected:text-[#0e7c86]"
                  >
                    {plan}
                  </button>
                ))}
              </ElTabList>
              <ElTabPanels>
                {plans.map((plan) => (
                  <table key={plan} className="w-full border-collapse text-left text-sm/5">
                    <colgroup>
                      <col className="w-3/4" />
                      <col className="w-1/4" />
                    </colgroup>
                    {features.map((group, index) => (
                      <FeatureGroup key={index} group={group} plans={[plan]} />
                    ))}
                  </table>
                ))}
              </ElTabPanels>
            </ElTabGroup>
          </div>
        </div>
      </Container>
    </section>
  )
}
