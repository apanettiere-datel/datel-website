import { ElTabGroup, ElTabList, ElTabPanels } from '@tailwindplus/elements/react'
import Image from 'next/image'

import { SoftButtonLink } from '@/components/elements/button'
import { Container } from '@/components/elements/container'
import { MotionReveal } from '@/components/elements/motion'
import { ChartLineIcon } from '@/components/icons/chart-line-icon'
import { CheckmarkIcon } from '@/components/icons/checkmark-icon'
import { CpuIcon } from '@/components/icons/cpu-icon'
import { Document2StackedIcon } from '@/components/icons/document-2-stacked-icon'
import { MinusIcon } from '@/components/icons/minus-icon'
import { PlusIcon } from '@/components/icons/plus-icon'
import { FAQsAccordion, Faq } from '@/components/sections/faqs-accordion'

const customerLogos = [
  {
    name: 'Food For The Poor, Inc.',
    src: '/img/customer-logos/food-for-the-poor.svg',
    width: 385,
    height: 106,
  },
  {
    name: 'Whaley Parts & Supply',
    src: '/img/customer-logos/whaley-parts-and-supply.svg',
    width: 385,
    height: 106,
  },
  {
    name: 'Online Vacation Center',
    src: '/img/customer-logos/online-vacation-center.svg',
    width: 385,
    height: 106,
  },
  {
    name: 'On Time Medical Transportation',
    src: '/img/customer-logos/on-time-transport.svg',
    width: 385,
    height: 106,
  },
  {
    name: 'Municipal Government',
    src: '/img/customer-logos/municipal-government.svg',
    width: 385,
    height: 106,
  },
  {
    name: 'Jurupa Community Services District',
    src: '/img/customer-logos/jurupa-community-services-district.svg',
    width: 385,
    height: 106,
  },
]

const comparisonPlans = ['Base Platform', 'Real-Time Add-On', 'AI Add-On'] as const

type ComparisonPlan = (typeof comparisonPlans)[number]

const pricingTiers: {
  name: ComparisonPlan
  description: string
  priceMonthly: string
  priceDetail: string
  href: string
  cta: string
  badge?: string
  highlights: { description: string; disabled?: boolean }[]
}[] = [
  {
    name: 'Base Platform',
    description: 'Hosted call analytics with rapid setup and no extra hardware or software.',
    priceMonthly: 'Contact Sales',
    priceDetail: 'Base licensing',
    href: '/schedule-demo',
    cta: 'Request base pricing',
    highlights: [
      { description: 'Completely hosted managed service' },
      { description: 'Browser-based reporting from any device' },
      { description: 'Instant reporting as calls complete' },
      { description: 'Drill-down analytics and scheduled reports' },
      { description: 'Real-time operational dashboards', disabled: true },
      { description: 'AI-assisted trend summaries', disabled: true },
    ],
  },
  {
    name: 'Real-Time Add-On',
    description: 'Add live operations visibility for extensions, queues, and staffing decisions.',
    priceMonthly: 'Contact Sales',
    priceDetail: 'Add-on licensing',
    href: '/schedule-demo',
    cta: 'Add real-time licensing',
    badge: 'Popular add-on',
    highlights: [
      { description: 'Includes base platform capabilities' },
      { description: 'Real-time queue and extension monitoring' },
      { description: 'Live supervisor dashboards and alerts' },
      { description: 'Faster staffing and overflow response' },
      { description: 'AI-assisted trend summaries', disabled: true },
    ],
  },
  {
    name: 'AI Add-On',
    description: 'Add AI-powered call summaries and automated trend insights for leadership teams.',
    priceMonthly: 'Contact Sales',
    priceDetail: 'Add-on licensing',
    href: '/schedule-demo',
    cta: 'Add AI licensing',
    highlights: [
      { description: 'Includes base platform capabilities' },
      { description: 'AI-assisted call activity summaries' },
      { description: 'Automated trend and pattern detection' },
      { description: 'Faster planning and coaching insights' },
      { description: 'Real-time operational dashboards', disabled: true },
    ],
  },
]

const comparisonSections: {
  name: string
  features: { name: string; tiers: Record<ComparisonPlan, string | boolean> }[]
}[] = [
  {
    name: 'Core platform capabilities',
    features: [
      { name: 'Hosted interface available on any device', tiers: { 'Base Platform': true, 'Real-Time Add-On': true, 'AI Add-On': true } },
      { name: 'Instant call reporting at call completion', tiers: { 'Base Platform': true, 'Real-Time Add-On': true, 'AI Add-On': true } },
      { name: 'Drill-down from summary to detailed call events', tiers: { 'Base Platform': true, 'Real-Time Add-On': true, 'AI Add-On': true } },
      { name: 'Scheduled and on-demand reporting', tiers: { 'Base Platform': true, 'Real-Time Add-On': true, 'AI Add-On': true } },
      { name: 'Export reports to PDF and Excel', tiers: { 'Base Platform': true, 'Real-Time Add-On': true, 'AI Add-On': true } },
    ],
  },
  {
    name: 'Real-time licensing add-on',
    features: [
      {
        name: 'Real-time queue and extension dashboards',
        tiers: { 'Base Platform': false, 'Real-Time Add-On': true, 'AI Add-On': false },
      },
      {
        name: 'Live supervisor visibility for staffing decisions',
        tiers: { 'Base Platform': false, 'Real-Time Add-On': true, 'AI Add-On': false },
      },
      {
        name: 'Real-time alerts for queue pressure and call duration thresholds',
        tiers: { 'Base Platform': false, 'Real-Time Add-On': true, 'AI Add-On': false },
      },
    ],
  },
  {
    name: 'AI licensing add-on',
    features: [
      {
        name: 'AI-assisted call activity summaries',
        tiers: { 'Base Platform': false, 'Real-Time Add-On': false, 'AI Add-On': true },
      },
      {
        name: 'Automated trend and pattern detection',
        tiers: { 'Base Platform': false, 'Real-Time Add-On': false, 'AI Add-On': true },
      },
      {
        name: 'Expanded planning and coaching insights',
        tiers: { 'Base Platform': false, 'Real-Time Add-On': false, 'AI Add-On': true },
      },
    ],
  },
  {
    name: 'Implementation and support',
    features: [
      { name: 'Remote implementation and environment verification', tiers: { 'Base Platform': true, 'Real-Time Add-On': true, 'AI Add-On': true } },
      { name: 'Remote training included for your team', tiers: { 'Base Platform': true, 'Real-Time Add-On': true, 'AI Add-On': true } },
      { name: 'First year maintenance and support included', tiers: { 'Base Platform': true, 'Real-Time Add-On': true, 'AI Add-On': true } },
    ],
  },
]

const cloudSweetFeatureDetails = [
  {
    name: 'Completely hosted',
    description: 'Launch without extra hardware or software and keep implementation overhead low.',
  },
  {
    name: 'Real-time call activity visibility',
    description: 'Monitor volume, distribution, and team activity as calls complete.',
  },
  {
    name: 'Instant call reporting',
    description: 'Access summary and detailed call reporting immediately after each interaction.',
  },
  {
    name: 'Drill-down analytics',
    description: 'Move from KPI-level dashboards to event-level call detail in a few clicks.',
  },
  {
    name: 'Scheduled and on-demand reports',
    description: 'Automate recurring report delivery and run ad hoc analysis whenever needed.',
  },
  {
    name: 'Export-ready output',
    description: 'Share insights quickly with PDF and Excel exports for leadership and operations teams.',
  },
  {
    name: 'Call accounting insight',
    description: 'Track trends, peak periods, and duration behavior to improve staffing and control costs.',
  },
  {
    name: 'Productivity and alerting tools',
    description: 'Use thresholds and misuse alerts to surface issues early and maintain service quality.',
  },
] as const

const aiAnalyticsReportDetails = [
  {
    name: 'AI-assisted call summaries',
    description: 'Generate concise summaries from call activity so supervisors can review outcomes faster.',
    icon: Document2StackedIcon,
  },
  {
    name: 'Trend and pattern detection',
    description: 'Surface sentiment and behavior shifts early with AI-supported trend identification.',
    icon: CpuIcon,
  },
  {
    name: 'Export-ready coaching insights',
    description: 'Turn AI findings into report-ready guidance for QA, coaching, and leadership reviews.',
    icon: ChartLineIcon,
  },
] as const

function renderComparisonValue(value: string | boolean, plan: ComparisonPlan) {
  if (typeof value === 'string') {
    return <span className="text-sm/6 text-[#123458]">{value}</span>
  }

  return (
    <>
      {value ? (
        <CheckmarkIcon aria-hidden="true" className="text-[#0e7c86]" />
      ) : (
        <MinusIcon aria-hidden="true" className="text-[#9ab0c4]" />
      )}
      <span className="sr-only">{value ? `Included in ${plan}` : `Not included in ${plan}`}</span>
    </>
  )
}

export default function Page() {
  return (
    <>
      <section
        id="pricing"
        className="py-16 sm:py-20"
      >
        <Container>
          <MotionReveal className="mx-auto max-w-4xl text-center lg:max-w-5xl" amount={0.15}>
            <img
              src="/img/logos/cloud-sweet-v2.png"
              width="280"
              height="500"
              alt="Cloud SWEET logo"
              loading="lazy"
              decoding="async"
              className="mx-auto mb-5 h-16 w-auto sm:h-20"
            />
            <h1 className="text-4xl font-semibold tracking-tight text-balance text-[#015596] sm:text-5xl lg:text-6xl">
              Cloud SWEET pricing built for your base platform plus add-ons
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg/8 text-[#4f6781] sm:text-xl/8">
              Start with hosted call analytics, then activate real-time licensing and AI licensing as your operation scales.
              DATEL manages the platform end to end so your team can move quickly.
            </p>
          </MotionReveal>
        </Container>

        <div className="relative mt-14 pt-6 sm:mt-16 sm:pt-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-20 bottom-0 rounded-[2.5rem] bg-[radial-gradient(120%_140%_at_50%_0%,rgba(160,205,245,0.55)_0%,rgba(67,123,184,0.78)_36%,rgba(18,52,88,0.86)_66%,rgba(14,124,134,0.74)_83%,rgba(255,159,1,0.5)_100%)]"
          />

          <Container className="relative">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {pricingTiers.map((tier, index) => (
                <MotionReveal
                  key={tier.name}
                  delay={index * 0.08}
                  y={20}
                  amount={0.12}
                >
                  <div className="-m-2 grid grid-cols-1 rounded-[2rem] bg-white/10 p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.24)] max-lg:mx-auto max-lg:w-full max-lg:max-w-xl">
                    <div className="grid grid-cols-1 rounded-[1.65rem] bg-white p-8 shadow-[0_20px_50px_rgba(8,26,48,0.24)] ring-1 ring-[#d7e4ee]">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-semibold text-[#015596]">{tier.name}</h2>
                      {tier.badge && (
                        <span className="rounded-full border border-[#bdebe3] bg-[#e9f7f4] px-2.5 py-0.5 text-xs/6 font-semibold text-[#0e7c86]">
                          {tier.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm/6 text-[#4f6781]">{tier.description}</p>

                    <div className="mt-7 flex items-end gap-3">
                      <div className="text-4xl font-semibold tracking-tight text-[#123458] sm:text-5xl">{tier.priceMonthly}</div>
                      <div className="pb-1 text-xs/5 font-medium tracking-wide text-[#6f8297] uppercase">{tier.priceDetail}</div>
                    </div>

                    <div className="mt-7">
                      <SoftButtonLink href={tier.href} size="lg">
                        {tier.cta}
                      </SoftButtonLink>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-sm/6 font-semibold text-[#015596]">Included highlights</h3>
                      <ul className="mt-3 space-y-3">
                        {tier.highlights.map((highlight) => (
                          <li
                            key={highlight.description}
                            className="group flex items-start gap-3 text-sm/6 text-[#4f6781]"
                          >
                            <span className="inline-flex h-6 items-center">
                              <PlusIcon aria-hidden="true" className="text-[#0e7c86]" />
                            </span>
                            {highlight.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  </div>
                </MotionReveal>
              ))}
            </div>

            <MotionReveal className="mt-10 rounded-2xl border border-[#d7e4ee] bg-white/95 p-5 shadow-[0_16px_36px_rgba(18,52,88,0.12)] sm:mt-12" delay={0.2}>
              <p className="mb-4 text-sm/6 font-semibold text-[#0e7c86]">Used by teams across transportation, government, nonprofit, and service operations</p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {customerLogos.map((logo) => (
                  <div
                    key={logo.name}
                    className="flex h-20 items-center justify-center overflow-hidden rounded-2xl border border-[#d7e4ee] bg-white p-2"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={logo.width}
                      height={logo.height}
                      className="h-full w-full rounded-xl object-contain"
                    />
                  </div>
                ))}
              </div>
            </MotionReveal>
          </Container>
        </div>
      </section>

      <section
        id="comparison"
        className="pb-16 sm:pb-20"
      >
        <Container>
          <MotionReveal className="overflow-hidden rounded-[var(--radius-card)] border border-[#d7e4ee] bg-white p-4 shadow-[0_20px_48px_rgb(18_52_88/10%)] sm:p-6" amount={0.12}>
            <table className="w-full border-collapse text-left max-lg:hidden">
              <caption className="sr-only">Cloud SWEET pricing comparison</caption>
              <colgroup>
                <col className="w-2/5" />
                <col className="w-1/5" />
                <col className="w-1/5" />
                <col className="w-1/5" />
              </colgroup>
              <thead>
                <tr>
                  <th className="rounded-tl-xl border-b border-[#d7e4ee] bg-[#f4f8fb] p-4 text-base/7 font-semibold text-[#015596]">
                    Compare plans
                  </th>
                  {comparisonPlans.map((plan) => (
                    <th key={plan} className="border-b border-[#d7e4ee] bg-[#f4f8fb] p-4 text-center text-sm/6 font-semibold text-[#015596]">
                      {plan}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="border-b border-[#d7e4ee] bg-[#f4f8fb] p-4 text-sm/6 font-medium text-[#4f6781]">
                    Contact sales for exact licensing fit
                  </th>
                  {comparisonPlans.map((plan) => {
                    const tier = pricingTiers.find((item) => item.name === plan)

                    return (
                      <td key={plan} className="border-b border-[#d7e4ee] bg-[#f4f8fb] p-4 text-center last:rounded-tr-xl">
                        <a
                          href={tier?.href ?? '/schedule-demo'}
                          className="inline-flex items-center justify-center rounded-full border border-[#FF9F01] bg-[#FF9F01] px-3.5 py-1.5 text-sm/6 font-semibold text-white shadow-[0_8px_20px_rgb(255_159_1/26%)] transition-colors hover:border-[#e58f00] hover:bg-[#e58f00]"
                        >
                          {tier?.cta ?? 'Contact sales'}
                        </a>
                      </td>
                    )
                  })}
                </tr>
              </thead>
              {comparisonSections.map((section) => (
                <tbody key={section.name}>
                  <tr>
                    <th colSpan={comparisonPlans.length + 1} className="border-y border-[#d7e4ee] bg-[#fbfdff] px-4 py-3 text-sm/6 font-semibold text-[#015596]">
                      {section.name}
                    </th>
                  </tr>
                  {section.features.map((feature) => (
                    <tr key={feature.name} className="border-b border-[#eef3f8] last:border-none">
                      <th scope="row" className="px-4 py-4 text-sm/6 font-normal text-[#4f6781]">
                        {feature.name}
                      </th>
                      {comparisonPlans.map((plan) => (
                        <td key={plan} className="px-4 py-4 text-center align-middle">
                          <span className="inline-flex min-h-5 min-w-5 items-center justify-center">
                            {renderComparisonValue(feature.tiers[plan], plan)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>

            <div className="lg:hidden">
              <ElTabGroup>
                <ElTabList className="flex items-center gap-1 rounded-full border border-[#d7e4ee] bg-[#f4f8fb] p-1">
                  {comparisonPlans.map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      className="flex-1 rounded-full px-3 py-2 text-xs/6 font-semibold text-[#4f6781] transition-colors aria-selected:bg-white aria-selected:text-[#123458] aria-selected:shadow-[0_4px_14px_rgba(18,52,88,0.14)]"
                    >
                      {plan}
                    </button>
                  ))}
                </ElTabList>

                <ElTabPanels>
                  {comparisonPlans.map((plan) => {
                    const tier = pricingTiers.find((item) => item.name === plan)

                    return (
                      <div key={plan} className="mt-6 overflow-hidden rounded-3xl border border-[#d7e4ee] bg-white">
                        <div className="p-5">
                          <p className="text-sm/6 font-semibold text-[#0e7c86]">{plan}</p>
                          <a
                            href={tier?.href ?? '/schedule-demo'}
                            className="mt-3 inline-flex items-center justify-center rounded-full border border-[#FF9F01] bg-[#FF9F01] px-3.5 py-2 text-sm/6 font-semibold text-white shadow-[0_8px_20px_rgb(255_159_1/26%)] transition-colors hover:border-[#e58f00] hover:bg-[#e58f00]"
                          >
                            {tier?.cta ?? 'Contact sales'}
                          </a>
                        </div>
                        {comparisonSections.map((section) => (
                          <div key={section.name} className="border-t border-[#d7e4ee] px-5 py-4">
                            <h3 className="text-sm/6 font-semibold text-[#015596]">{section.name}</h3>
                            <dl className="mt-3 space-y-3">
                              {section.features.map((feature) => (
                                <div key={feature.name} className="grid grid-cols-[1fr_auto] items-start gap-4">
                                  <dt className="text-sm/6 text-[#4f6781]">{feature.name}</dt>
                                  <dd className="inline-flex min-h-5 min-w-5 items-center justify-end">
                                    {renderComparisonValue(feature.tiers[plan], plan)}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </ElTabPanels>
              </ElTabGroup>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section id="features" className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-5 lg:gap-y-20">
            <MotionReveal className="lg:col-span-2" amount={0.15}>
              <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">Cloud SWEET features</p>
              <h2 className="mt-2 text-4xl/11 font-semibold tracking-tight text-[#015596] sm:text-5xl/13">
                Everything teams need to monitor calls, manage staffing, and share insights
              </h2>
              <p className="mt-6 text-base/7 text-[#4f6781]">
                Cloud SWEET combines real-time visibility, historical reporting, and operational control in one managed platform.
              </p>
            </MotionReveal>

            <dl className="lg:col-span-3 grid grid-cols-1 gap-x-8 gap-y-8 text-base/7 sm:grid-cols-2 lg:gap-y-12">
              {cloudSweetFeatureDetails.map((feature, index) => (
                <MotionReveal key={feature.name} delay={(index % 4) * 0.05} y={16} amount={0.15}>
                  <div className="relative rounded-2xl border border-[#d7e4ee] bg-white p-5 pl-11 shadow-[0_8px_24px_rgb(18_52_88/8%)]">
                  <dt className="font-semibold text-[#015596]">
                    <CheckmarkIcon aria-hidden="true" className="absolute top-5 left-5 stroke-[#0e7c86]" />
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-sm/6 text-[#4f6781]">{feature.description}</dd>
                  </div>
                </MotionReveal>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <section id="ai-analytics-reports" className="py-8 sm:py-10">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <MotionReveal className="lg:pr-8" amount={0.15}>
              <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">AI analytics reports</p>
              <h2 className="mt-2 text-4xl/11 font-semibold tracking-tight text-[#015596] sm:text-5xl/13">
                Cloud SWEET AI turns raw call data into decision-ready reporting
              </h2>
              <p className="mt-6 text-base/7 text-[#4f6781]">
                Add AI licensing to accelerate reporting reviews, identify call trends sooner, and provide clearer guidance to operations teams.
              </p>

              <dl className="mt-8 space-y-4">
                {aiAnalyticsReportDetails.map((feature, index) => (
                  <MotionReveal key={feature.name} delay={0.06 + index * 0.05} y={14} amount={0.2}>
                    <div className="relative rounded-xl border border-[#d7e4ee] bg-white p-4 pl-11 shadow-[0_8px_24px_rgb(18_52_88/8%)]">
                      <dt className="text-sm/6 font-semibold text-[#015596]">
                        <feature.icon aria-hidden="true" className="absolute top-5 left-4 text-[#0e7c86]" />
                        {feature.name}
                      </dt>
                      <dd className="mt-1.5 text-sm/6 text-[#4f6781]">{feature.description}</dd>
                    </div>
                  </MotionReveal>
                ))}
              </dl>
            </MotionReveal>

            <MotionReveal delay={0.12} y={20} amount={0.18}>
              <div className="-m-2 rounded-[1.75rem] bg-[#123458]/7 p-2 ring-1 ring-[#123458]/12">
                <div className="overflow-hidden rounded-[1.25rem] border border-[#d7e4ee] bg-white">
                  <Image
                    src="/img/screenshots/report.svg"
                    alt="Cloud SWEET AI analytics reporting view"
                    width={1350}
                    height={900}
                    className="h-auto w-full scale-[1.2] sm:scale-[1.05]"
                  />
                </div>
              </div>
            </MotionReveal>
          </div>
        </Container>
      </section>

      <FAQsAccordion id="faqs" headline="Cloud SWEET FAQ">
        <Faq
          id="faq-1"
          question="How quickly can we get started?"
          answer="Most teams can get started quickly because Cloud SWEET is hosted and managed by DATEL, with no additional hardware or software setup required."
        />
        <Faq
          id="faq-2"
          question="Can we access Cloud SWEET from any device?"
          answer="Yes. The hosted interface is available anytime on desktop and mobile devices with secure user access controls."
        />
        <Faq
          id="faq-3"
          question="What reporting options are included in the base platform?"
          answer="The base platform includes instant call reporting, drill-down analytics, scheduled report delivery, and export options for PDF and Excel."
        />
        <Faq
          id="faq-4"
          question="How do Real-Time and AI add-ons fit with the base platform?"
          answer="The base platform handles core analytics and reporting. Real-Time Licensing adds live operational dashboards, and AI Licensing adds automated summary and trend insights."
        />
      </FAQsAccordion>
    </>
  )
}
