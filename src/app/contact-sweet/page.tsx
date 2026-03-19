import { ElTabGroup, ElTabList, ElTabPanels } from '@tailwindplus/elements/react'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { ButtonLink, SoftButtonLink } from '@/components/elements/button'
import { Container } from '@/components/elements/container'
import { MotionReveal } from '@/components/elements/motion'
import { CameraVideoIcon } from '@/components/icons/camera-video-icon'
import { CheckmarkIcon } from '@/components/icons/checkmark-icon'
import { ClipboardIcon } from '@/components/icons/clipboard-icon'
import { MinusIcon } from '@/components/icons/minus-icon'
import { RepeatIcon } from '@/components/icons/repeat-icon'
import { FAQsAccordion, Faq } from '@/components/sections/faqs-accordion'
import { Plan, PricingHeroMultiTier } from '@/components/sections/pricing-hero-multi-tier'

const editionOptions = ['Standard Edition', 'Small Business Edition', 'Enterprise Edition'] as const

type EditionOption = (typeof editionOptions)[number]

const outcomeDetails = [
  {
    name: 'Increase productivity',
    description: 'Track agent activity in detail, align staffing with demand, and maintain consistent service levels.',
  },
  {
    name: 'Reduce costs',
    description: 'Detect misuse and long-duration patterns early with threshold alerts and historical analysis.',
  },
  {
    name: 'Identify trends',
    description: 'Use text and graphical reporting to spot operational shifts before they impact customer experience.',
  },
]

const cradleToGraveDetails = [
  {
    name: 'Capture full call journeys',
    description: 'Track cradle-to-grave call flow from first connection through transfers, holds, and final disposition.',
    icon: CameraVideoIcon,
  },
  {
    name: 'Flexible recording controls',
    description: 'Configure all-call, random, on-demand, and rules-based recording based on team and compliance needs.',
    icon: RepeatIcon,
  },
  {
    name: 'Faster QA and compliance review',
    description: 'Retrieve interactions quickly with context-rich history to support coaching, disputes, and regulatory workflows.',
    icon: ClipboardIcon,
  },
] as const

const coreCapabilityDetails = [
  {
    name: 'Scheduled reports',
    description: 'Send reports daily, weekly, monthly, or one-time to make analysis part of your routine.',
  },
  {
    name: 'Browser-based access',
    description: 'Managers and remote teams can access reporting from any modern browser.',
  },
  {
    name: 'Faster reporting',
    description: 'Generate reports in a few clicks and export to PDF or Excel for sharing.',
  },
  {
    name: 'Unified multi-channel operations',
    description: 'Run voice, web chat, and email workflows in one interface designed for supervisor control.',
  },
  {
    name: 'Multi-channel support',
    description: 'Support voice, email, and web chat interactions as one service operation.',
  },
  {
    name: 'Flexible deployment',
    description: 'Start with voice-first workflows and expand channels as business needs grow.',
  },
] as const

const keepingItSimpleDetails = [
  'Rapid deployment process, remotely or on-site',
  'Remote implementation included with DATEL applications',
  'Pre-configuration checklist and environment verification before go-live',
  'Remote training included so teams are ready from day one',
  'Concurrent licensing with full user capability for each agent',
  'Configurable agent permissions and security roles',
] as const

const customerCareDetails = [
  'First year of maintenance and support included with software purchase',
  'Unlimited technical support by email, phone, and web',
  'Product updates and enhancements delivered as available',
  'Support portal access with ticket tracking and knowledge resources',
] as const

const comparisonPlans = ['Standard Edition', 'Small Business Edition', 'Enterprise Edition'] as const

type ComparisonPlan = (typeof comparisonPlans)[number]

const comparisonCtas: Record<ComparisonPlan, { label: string; href: string }> = {
  'Standard Edition': { label: 'Request standard pricing', href: '/contact#contact' },
  'Small Business Edition': { label: 'Request small business pricing', href: '/contact#contact' },
  'Enterprise Edition': { label: 'Request enterprise pricing', href: '/contact#contact' },
}

const comparisonSections: {
  name: string
  features: { name: string; tiers: Record<ComparisonPlan, string | boolean> }[]
}[] = [
  {
    name: 'Best fit',
    features: [
      {
        name: 'Operational profile',
        tiers: {
          'Standard Edition': 'Informal call center operations',
          'Small Business Edition': 'Single-site teams with up to 10 agents',
          'Enterprise Edition': 'Complex or multi-team contact center environments',
        },
      },
      {
        name: 'Primary focus',
        tiers: {
          'Standard Edition': 'Core reporting and staffing visibility',
          'Small Business Edition': 'Fast optimization with live supervisor control',
          'Enterprise Edition': 'Unified multi-channel service management',
        },
      },
    ],
  },
  {
    name: 'Reporting and operations',
    features: [
      {
        name: 'Historical reporting and scheduled delivery',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Browser-based reporting access',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'PDF and Excel export',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Graphical dashboards and trend displays',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Drill-down detail on extensions and groups',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Real-time supervisor metrics',
        tiers: { 'Standard Edition': false, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Service level and queue monitoring',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
    ],
  },
  {
    name: 'Cost management and governance',
    features: [
      {
        name: 'Account code and billable time reporting',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Number screening alerts',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Call duration and cost threshold alerts',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Role-based reporting access control',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
    ],
  },
  {
    name: 'Supervisor and control tools',
    features: [
      {
        name: 'Reason codes and agent state visibility',
        tiers: { 'Standard Edition': false, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Wallboards and supervisor views',
        tiers: { 'Standard Edition': false, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Supervisor controls for live queue pressure',
        tiers: { 'Standard Edition': false, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'SWEET alarms and threshold notifications',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
    ],
  },
  {
    name: 'Channels and advanced capability',
    features: [
      {
        name: 'Voice interactions',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Web chat and email interactions',
        tiers: { 'Standard Edition': false, 'Small Business Edition': false, 'Enterprise Edition': true },
      },
      {
        name: 'Call recording modes (all, random, on-demand, rules)',
        tiers: { 'Standard Edition': false, 'Small Business Edition': false, 'Enterprise Edition': true },
      },
      {
        name: 'Cradle-to-grave recording with transfer visibility',
        tiers: { 'Standard Edition': false, 'Small Business Edition': false, 'Enterprise Edition': true },
      },
      {
        name: 'Disposition coding',
        tiers: { 'Standard Edition': false, 'Small Business Edition': false, 'Enterprise Edition': true },
      },
    ],
  },
  {
    name: 'Deployment and support',
    features: [
      {
        name: 'Rapid deployment, remote or on-site',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Remote implementation included',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Remote user training included',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Concurrent licensing model',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Configurable permissions and security roles',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'First year maintenance and support included',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Unlimited support by email, phone, and web',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
      {
        name: 'Product updates and enhancements included',
        tiers: { 'Standard Edition': true, 'Small Business Edition': true, 'Enterprise Edition': true },
      },
    ],
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

function editionPlans(option: EditionOption) {
  if (option === 'Standard Edition') {
    return (
      <Plan
        name="Contact SWEET Standard Edition"
        price="Contact Sales"
        subheadline={<p>Ideal for informal call center operations that need practical insight and clear performance control.</p>}
        features={[
          'Increase productivity by tracking agent activity and staffing performance',
          'Reduce costs with automatic misuse and excessive duration alerts',
          'Identify trends using text and graphical reports across all call activity',
          'Schedule reports daily, weekly, monthly, or on demand',
          'Browser-based access for managers and remote teams',
          'Fast report export to PDF and Excel formats',
          'Drill down from high-level metrics to extension, agent, and hunt group details',
          'Service level reporting for individual and team performance goals',
          'Cradle-to-grave call detail from call start to call completion',
          'Historical call accounting for peak-time and duration analysis',
          'Account code reporting to support faster, more accurate client billing',
          'Role-based access controls for confidential reporting',
        ]}
        cta={
          <SoftButtonLink href="/contact?team=sales#contact" size="lg">
            Request information
          </SoftButtonLink>
        }
      />
    )
  }

  if (option === 'Small Business Edition') {
    return (
      <Plan
        name="Contact SWEET Small Business Edition"
        price="Contact Sales"
        subheadline={<p>Designed for single-site teams up to 10 agents that need quick deployment and day-to-day operational control.</p>}
        features={[
          'Real-time metrics for instant supervisor decision making',
          'Historical reports with automated email scheduling',
          'Browser-based access from any device and location',
          'Interactive drill-down reports with PDF and Excel export',
          'Reason codes for detailed agent activity visibility',
          'Wallboards and supervisor views for live operations',
          'Supervisor controls to change agent states during queue spikes',
          'Account code visibility for cost tracking and billing accuracy',
          'SWEET! alarms when calls or service levels move outside targets',
          'Configurable security roles as teams grow',
          'Built for smaller teams that need enterprise-style capabilities',
        ]}
        cta={
          <SoftButtonLink href="/contact?team=sales#contact" size="lg">
            Request information
          </SoftButtonLink>
        }
      />
    )
  }

  return (
    <Plan
      name="Contact SWEET Enterprise Edition"
      price="Contact Sales"
      subheadline={<p>Multi-channel contact center operations in one unified interface for voice, web chat, and email workflows.</p>}
      badge="Advanced"
      features={[
        'Multi-channel support for voice, email, and web chat',
        'Flexible deployment with voice first and channel expansion over time',
        'Real-time supervisor reporting for instant response',
        'Historical reporting across all channels with scheduled delivery',
        'Flexible call recording modes including all, random, on-demand, and rules-based',
        'Cradle-to-grave recording that captures transfers and hold activity',
        'Disposition and reason codes for deeper call outcome insight',
        'Rapid retrieval through a browser-based interface',
        'Built for compliance-sensitive environments including healthcare and finance',
        'Improved first-contact resolution with unified interaction context',
      ]}
      cta={
        <SoftButtonLink href="/contact?team=sales#contact" size="lg">
          Request information
        </SoftButtonLink>
      }
    />
  )
}

export default function Page() {
  const plansByOption: Record<EditionOption, ReactNode> = {
    'Standard Edition': editionPlans('Standard Edition'),
    'Small Business Edition': editionPlans('Small Business Edition'),
    'Enterprise Edition': editionPlans('Enterprise Edition'),
  }
  const initialEdition: EditionOption | undefined = undefined

  return (
    <>
      <PricingHeroMultiTier<EditionOption>
        id="contact-sweet-hero"
        eyebrow={
          <div className="flex flex-col items-center gap-3">
            <img
              src="https://www.datel-group.com/wp-content/uploads/2015/06/ctsw.png"
              width="120"
              height="150"
              alt="Contact SWEET logo"
              loading="lazy"
              decoding="async"
              className="h-20 w-auto sm:h-24"
            />
            <span className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">Contact SWEET solutions</span>
          </div>
        }
        headline="You cannot manage what you cannot measure"
        subheadline={
          <p>
            Contact SWEET gives your team the visibility to improve customer service, strengthen productivity, and control costs.
            Start with the edition that fits your operation, then scale into advanced multi-channel workflows and quality monitoring.
          </p>
        }
        options={editionOptions}
        plans={plansByOption}
        initialOption={initialEdition}
        prePlans={
          <div className="grid w-full grid-cols-1 gap-4 text-left md:grid-cols-3">
            <article
              id="standard-edition"
              className="scroll-mt-28 rounded-2xl border border-[#d7e4ee] bg-white p-5 shadow-[0_8px_24px_rgb(18_52_88/10%)]"
            >
              <h3 className="text-base/7 font-semibold text-[#015596]">Standard Edition</h3>
              <p className="mt-2 text-sm/6 text-[#4f6781]">
                Best for informal call center operations that need stronger visibility, scheduled reporting, and better staffing decisions.
              </p>
            </article>
            <article
              id="small-business-edition"
              className="scroll-mt-28 rounded-2xl border border-[#d7e4ee] bg-white p-5 shadow-[0_8px_24px_rgb(18_52_88/10%)]"
            >
              <h3 className="text-base/7 font-semibold text-[#015596]">Small Business Edition</h3>
              <p className="mt-2 text-sm/6 text-[#4f6781]">
                Designed for single-site teams with up to 10 agents that need real-time supervisor views, alarms, and queue control.
              </p>
            </article>
            <article
              id="enterprise-edition"
              className="scroll-mt-28 rounded-2xl border border-[#d7e4ee] bg-white p-5 shadow-[0_8px_24px_rgb(18_52_88/10%)]"
            >
              <h3 className="text-base/7 font-semibold text-[#015596]">Enterprise Edition</h3>
              <p className="mt-2 text-sm/6 text-[#4f6781]">
                Built for high-volume teams that need a unified multi-channel workflow across voice, email, and web chat.
              </p>
            </article>
          </div>
        }
      />

      <section id="benefits" className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5 lg:gap-y-16">
            <MotionReveal className="lg:col-span-2" amount={0.15}>
              <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">Tangible business outcomes</p>
              <h2 className="mt-2 text-4xl/11 font-semibold tracking-tight text-[#015596] sm:text-5xl/13">
                Contact SWEET helps teams increase productivity, reduce costs, and identify trends
              </h2>
              <p className="mt-6 text-base/7 text-[#4f6781]">
                Build a repeatable operating rhythm with actionable metrics for supervisors, managers, and leadership teams.
              </p>
            </MotionReveal>
            <dl className="lg:col-span-3 grid grid-cols-1 gap-x-8 gap-y-8 text-base/7 sm:grid-cols-2 lg:gap-y-10">
              {outcomeDetails.map((feature, index) => (
                <MotionReveal
                  key={feature.name}
                  delay={(index % 2) * 0.06}
                  y={16}
                  amount={0.15}
                >
                  <div className="relative rounded-2xl border border-[#d7e4ee] bg-white p-5 pl-11 shadow-[0_8px_24px_rgb(18_52_88/8%)] sm:even:translate-y-3">
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

      <section id="capabilities" className="pb-8 sm:pb-10">
        <Container>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-5 lg:gap-y-16">
            <MotionReveal className="lg:col-span-2" amount={0.15}>
              <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">Core capabilities</p>
              <h2 className="mt-2 text-4xl/11 font-semibold tracking-tight text-[#015596] sm:text-5xl/13">
                Built for daily operations, billing accuracy, and service quality
              </h2>
              <p className="mt-6 text-base/7 text-[#4f6781]">
                Contact SWEET gives teams practical tools to analyze calls, protect margins, and support better customer outcomes.
              </p>
            </MotionReveal>
            <dl className="lg:col-span-3 grid grid-cols-1 gap-x-8 gap-y-8 text-base/7 sm:grid-cols-2 lg:gap-y-10">
              {coreCapabilityDetails.map((feature, index) => (
                <MotionReveal key={feature.name} delay={(index % 2) * 0.06} y={16} amount={0.15}>
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

      <section id="recording" className="py-8 sm:py-10">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <MotionReveal className="lg:pr-8" amount={0.15}>
              <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">Cradle-to-grave recording</p>
              <h2 className="mt-2 text-4xl/11 font-semibold tracking-tight text-[#015596] sm:text-5xl/13">
                Contact SWEET captures the full customer interaction trail for legacy and compliance-heavy operations
              </h2>
              <p className="mt-6 text-base/7 text-[#4f6781]">
                Combine Contact SWEET workflows with recording visibility so teams can review complete call histories, resolve disputes faster, and coach with better context.
              </p>

              <dl className="mt-8 space-y-4">
                {cradleToGraveDetails.map((feature, index) => (
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
                    src="/img/screenshots/ctg.svg"
                    alt="Contact SWEET cradle-to-grave recording analytics view"
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

      <section id="comparison" className="py-16 sm:py-20">
        <Container>
          <MotionReveal className="mx-auto max-w-4xl text-center lg:max-w-5xl" amount={0.15}>
            <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">Compare features</p>
            <h2 className="mt-2 text-4xl/11 font-semibold tracking-tight text-[#015596] sm:text-5xl/13">
              Choose the Contact SWEET edition that matches your operation
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base/7 text-[#4f6781]">
              All editions provide strong reporting foundations. Move up editions as your team needs deeper real-time control and multi-channel workflows.
            </p>
          </MotionReveal>

          <MotionReveal className="mt-10 overflow-hidden rounded-[var(--radius-card)] border border-[#d7e4ee] bg-white p-4 shadow-[0_20px_48px_rgb(18_52_88/10%)] sm:p-6" delay={0.08} amount={0.12}>
            <table className="w-full border-collapse text-left max-lg:hidden">
              <caption className="sr-only">Contact SWEET comparison</caption>
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
                    Contact sales for exact edition fit
                  </th>
                  {comparisonPlans.map((plan) => (
                    <td key={plan} className="border-b border-[#d7e4ee] bg-[#f4f8fb] p-4 text-center last:rounded-tr-xl">
                      <a
                        href={comparisonCtas[plan].href}
                        className="inline-flex items-center justify-center rounded-full border border-[#FF9F01] bg-[#FF9F01] px-3.5 py-1.5 text-sm/6 font-semibold text-white shadow-[0_8px_20px_rgb(255_159_1/26%)] transition-colors hover:border-[#e58f00] hover:bg-[#e58f00]"
                      >
                        {comparisonCtas[plan].label}
                      </a>
                    </td>
                  ))}
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
                  {comparisonPlans.map((plan) => (
                    <div key={plan} className="mt-6 overflow-hidden rounded-3xl border border-[#d7e4ee] bg-white">
                      <div className="p-5">
                        <p className="text-sm/6 font-semibold text-[#0e7c86]">{plan}</p>
                        <a
                          href={comparisonCtas[plan].href}
                          className="mt-3 inline-flex items-center justify-center rounded-full border border-[#FF9F01] bg-[#FF9F01] px-3.5 py-2 text-sm/6 font-semibold text-white shadow-[0_8px_20px_rgb(255_159_1/26%)] transition-colors hover:border-[#e58f00] hover:bg-[#e58f00]"
                        >
                          {comparisonCtas[plan].label}
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
                  ))}
                </ElTabPanels>
              </ElTabGroup>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section id="delivery-support" className="py-8 sm:py-10">
        <Container>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-5 lg:gap-y-16">
            <MotionReveal className="lg:col-span-2" amount={0.15}>
              <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">Deployment and support</p>
              <h2 className="mt-2 text-4xl/11 font-semibold tracking-tight text-[#015596] sm:text-5xl/13">
                Keeping it simple with implementation and support built in
              </h2>
              <p className="mt-6 text-base/7 text-[#4f6781]">
                Contact SWEET includes onboarding guidance and long-term support so your team can launch with confidence and keep improving operations.
              </p>
            </MotionReveal>
            <div className="lg:col-span-3 grid grid-cols-1 gap-8 md:grid-cols-2">
              <MotionReveal y={18} amount={0.15}>
                <article className="rounded-2xl border border-[#d7e4ee] bg-white p-5 shadow-[0_8px_24px_rgb(18_52_88/8%)]">
                <h3 className="text-base/7 font-semibold text-[#015596]">Keeping it simple</h3>
                <ul className="mt-4 space-y-3">
                  {keepingItSimpleDetails.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm/6 text-[#4f6781]">
                      <CheckmarkIcon aria-hidden="true" className="mt-1 shrink-0 stroke-[#0e7c86]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                </article>
              </MotionReveal>
              <MotionReveal delay={0.08} y={18} amount={0.15}>
                <article className="rounded-2xl border border-[#d7e4ee] bg-white p-5 shadow-[0_8px_24px_rgb(18_52_88/8%)]">
                <h3 className="text-base/7 font-semibold text-[#015596]">DATEL customer care</h3>
                <ul className="mt-4 space-y-3">
                  {customerCareDetails.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm/6 text-[#4f6781]">
                      <CheckmarkIcon aria-hidden="true" className="mt-1 shrink-0 stroke-[#0e7c86]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                </article>
              </MotionReveal>
            </div>
          </div>
        </Container>
      </section>

      <section id="request-information" className="py-16 sm:py-20">
        <Container>
          <MotionReveal className="rounded-[2rem] border border-[#d7e4ee] bg-white p-8 shadow-[0_18px_40px_rgb(18_52_88/10%)] sm:p-10 lg:p-12" amount={0.15}>
            <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">Request information</p>
            <h2 className="mt-2 text-3xl/10 font-semibold tracking-tight text-[#015596] sm:text-4xl">
              One size does not fit all. Let DATEL help you choose the right Contact SWEET edition.
            </h2>
            <p className="mt-4 max-w-3xl text-base/7 text-[#4f6781]">
              Questions about licensing, implementation, recording options, or edition fit. Contact the DATEL team and get practical guidance for your environment.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <SoftButtonLink href="/schedule-demo" size="lg">
                Schedule demo
              </SoftButtonLink>
              <ButtonLink href="/contact?team=sales#contact" size="lg">
                Contact sales
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm/6 text-[#4f6781]">Questions: (724) 940-0400 | support@datel-group.com</p>
          </MotionReveal>
        </Container>
      </section>

      <FAQsAccordion id="faqs" headline="Contact SWEET FAQ">
        <Faq
          id="faq-1"
          question="How do I decide between Standard, Small Business, and Enterprise editions?"
          answer="Standard Edition fits informal call center teams, Small Business Edition is designed for up to 10 agents at single-site operations, and Enterprise Edition supports multi-channel voice, email, and web chat workflows."
        />
        <Faq
          id="faq-2"
          question="Can Contact SWEET be deployed quickly?"
          answer="Yes. DATEL includes remote implementation and remote training with software purchase, using a pre-configuration checklist and environment verification before go-live."
        />
        <Faq
          id="faq-3"
          question="What reporting depth is included?"
          answer="Contact SWEET provides high-level summaries, drill-down detail, scheduled reporting, and historical trend analysis. Edition capabilities expand with real-time supervision and multi-channel workflows."
        />
        <Faq
          id="faq-4"
          question="Can we add recording for training or compliance needs?"
          answer="Yes. Contact SWEET Enterprise Edition supports flexible call recording modes with fast retrieval and cradle-to-grave call context."
        />
        <Faq
          id="faq-5"
          question="Is support included?"
          answer="Yes. DATEL includes first year maintenance and support, unlimited technical support channels, and ongoing product enhancements."
        />
      </FAQsAccordion>
    </>
  )
}
