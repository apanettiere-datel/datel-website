import { Fragment } from 'react'

import { ButtonLink, SoftButtonLink } from '@/components/elements/button'
import { Container } from '@/components/elements/container'
import { MotionReveal } from '@/components/elements/motion'
import { CheckmarkIcon } from '@/components/icons/checkmark-icon'
import { CloudArrowDownIcon } from '@/components/icons/cloud-arrow-down-icon'
import { DocumentIcon } from '@/components/icons/document-icon'
import { MinusIcon } from '@/components/icons/minus-icon'
import {
  DOMAIN_USER_TIERS,
  REAL_TIME_AGENT_RATE,
  REAL_TIME_MIN_AGENTS,
  SENTIMENT_INTRO_RATE,
  SENTIMENT_STANDARD_RATE,
  STORAGE_BASE_HOURS,
  STORAGE_BASE_PRICE,
  STORAGE_BLOCK_HOURS,
  STORAGE_BLOCK_PRICE,
  TRANSCRIPTION_TIERS,
  formatUsd,
} from '@/lib/cloudsweet-pricing'

type DomainTier = {
  users: string
  reportingProduct: string
  reportingPartnerMonthly: string
  reportingListMonthly: string
  recordingProduct: string
  recordingPartnerMonthly: string
  recordingListMonthly: string
}

const PRICING_PDF_PATH = '/docs/DATEL_CloudSWEET_Pricing.pdf'

const DOMAIN_TIERS: DomainTier[] = DOMAIN_USER_TIERS.map((tier) => ({
  users: tier.label.replace(' users', ''),
  reportingProduct: tier.reportingProduct,
  reportingPartnerMonthly: formatUsd(tier.reportingPartnerMonthly),
  reportingListMonthly: formatUsd(tier.reportingListMonthly),
  recordingProduct: tier.recordingProduct,
  recordingPartnerMonthly: formatUsd(tier.recordingPartnerMonthly),
  recordingListMonthly: formatUsd(tier.recordingListMonthly),
}))

const STORAGE_PRICING = [
  { item: `Initial block (${STORAGE_BASE_HOURS.toLocaleString()} hours)`, monthly: `${formatUsd(STORAGE_BASE_PRICE)}/mo` },
  { item: `Each additional ${STORAGE_BLOCK_HOURS}-hour block`, monthly: `${formatUsd(STORAGE_BLOCK_PRICE)}/mo` },
]

const TRANSCRIPTION_PRICING = TRANSCRIPTION_TIERS.map((tier) => ({
  tier: `${tier.label.replace(' hrs', ' hours')}/month`,
  rate: `${formatUsd(tier.rate)}/hr`,
}))

const ADD_ON_PRICING = [
  {
    name: 'Real-Time Agent/Queue Views',
    product: 'HRT500',
    partnerRate: `${formatUsd(REAL_TIME_AGENT_RATE)} per agent / month`,
    details: [`${REAL_TIME_MIN_AGENTS}-agent minimum`],
  },
  {
    name: 'Sentiment and AI Agent Analytics',
    product: 'SAI500',
    partnerRate: `${formatUsd(SENTIMENT_INTRO_RATE)} intro (months 1-3), then ${formatUsd(SENTIMENT_STANDARD_RATE)} standard (month 4+)`,
    details: ['Requires transcription and call recording', 'PII redaction: custom quote'],
  },
]

const COMPARISON_PLANS = ['Domain Base', 'Domain + Recording', 'Full AI Suite'] as const

type ComparisonPlan = (typeof COMPARISON_PLANS)[number]

const COMPARISON_TIERS: {
  name: ComparisonPlan
  description: string
  model: string
  summary: string
  highlights: { description: string; disabled?: boolean }[]
}[] = [
  {
    name: 'Domain Base',
    description: 'Reporting platform priced per domain by user range.',
    model: '$10 to $1,050 / domain / month',
    summary: 'Choose a user tier and start with core CloudSWEET reporting.',
    highlights: [
      { description: 'Per-domain reporting package (H4001 to H4010)' },
      { description: 'Setup, hosting, updates, support, and training included' },
      { description: 'Call recording package by same user tier', disabled: true },
      { description: 'Usage-based transcription billing', disabled: true },
      { description: 'AI sentiment analytics add-on', disabled: true },
    ],
  },
  {
    name: 'Domain + Recording',
    description: 'Adds call recording package and storage fees.',
    model: 'Base tier + recording tier + storage usage',
    summary: 'Good fit for resellers with retention and QA workflows.',
    highlights: [
      { description: 'Per-domain reporting package (H4001 to H4010)' },
      { description: 'Call recording integration package (H4001CRE to H4010CRE)' },
      { description: 'Storage: $6 for first 2,000 hrs, then $1 per +500 hrs' },
      { description: 'Usage-based transcription billing', disabled: true },
      { description: 'AI sentiment analytics add-on', disabled: true },
    ],
  },
  {
    name: 'Full AI Suite',
    description: 'Complete reseller package with AI and real-time add-ons.',
    model: 'Domain + recording + usage + optional add-ons',
    summary: 'Use estimator inputs to project monthly totals by domain.',
    highlights: [
      { description: 'Per-domain reporting and call recording tiers' },
      { description: 'Transcription tiered rates: $0.23 to $0.17 per hour' },
      { description: 'Real-time add-on: HRT500 at $4 per agent/month (5 min)' },
      { description: 'Sentiment add-on: SAI500 at $8 intro, then $13 standard' },
      { description: 'PII redaction available via custom quote' },
    ],
  },
]

const COMPARISON_SECTIONS: {
  name: string
  features: { name: string; tiers: Record<ComparisonPlan, string | boolean> }[]
}[] = [
  {
    name: 'Domain licensing',
    features: [
      {
        name: 'Reporting package by user tier',
        tiers: {
          'Domain Base': '$10 to $1,050 / domain / month',
          'Domain + Recording': '$10 to $1,050 / domain / month',
          'Full AI Suite': '$10 to $1,050 / domain / month',
        },
      },
      {
        name: 'Call recording package by user tier',
        tiers: {
          'Domain Base': false,
          'Domain + Recording': '$5 to $80 / domain / month',
          'Full AI Suite': '$5 to $80 / domain / month',
        },
      },
    ],
  },
  {
    name: 'Usage billing',
    features: [
      {
        name: 'Transcription summarization usage rates',
        tiers: {
          'Domain Base': false,
          'Domain + Recording': false,
          'Full AI Suite': '$0.23 to $0.17 per hour',
        },
      },
      {
        name: 'Recording storage fees',
        tiers: {
          'Domain Base': false,
          'Domain + Recording': '$6 base then $1 per +500-hour block',
          'Full AI Suite': '$6 base then $1 per +500-hour block',
        },
      },
    ],
  },
  {
    name: 'Add-ons',
    features: [
      {
        name: 'Real-time agent and queue views (HRT500)',
        tiers: {
          'Domain Base': false,
          'Domain + Recording': false,
          'Full AI Suite': '$4 per agent / month (5 minimum)',
        },
      },
      {
        name: 'Sentiment and AI analytics (SAI500)',
        tiers: {
          'Domain Base': false,
          'Domain + Recording': false,
          'Full AI Suite': '$8 intro then $13 standard',
        },
      },
    ],
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function renderComparisonValue(value: string | boolean, plan: ComparisonPlan) {
  if (typeof value === 'string') {
    return <span className="text-sm/6 text-[#123458]">{value}</span>
  }

  return (
    <>
      {value ? <CheckmarkIcon aria-hidden="true" className="text-[#0e7c86]" /> : <MinusIcon aria-hidden="true" className="text-[#9ab0c4]" />}
      <span className="sr-only">{value ? `Included in ${plan}` : `Not included in ${plan}`}</span>
    </>
  )
}

export default function Page() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="space-y-6">
          <MotionReveal className="rounded-2xl border border-[#d7e4ee] bg-white p-8 shadow-[0_8px_24px_rgb(18_52_88/10%)] sm:p-10" amount={0.15}>
            <p className="text-xs font-semibold tracking-[0.12em] text-[#0e7c86] uppercase">Reseller Pricing</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#015596] sm:text-5xl">CloudSWEET Partner Rate Sheet</h1>
            <p className="mt-4 max-w-4xl text-base/7 text-[#4f6781]">
              Reseller-only pricing based on the DATEL CloudSWEET pricing sheet. This page mirrors the source document and
              adds structure for faster packaging and proposal work.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <SoftButtonLink href="/estimator" size="lg">
                Open estimator
              </SoftButtonLink>
              <ButtonLink href={PRICING_PDF_PATH} download size="lg" color="light" className="gap-2">
                <CloudArrowDownIcon className="h-4 w-4" />
                Download pricing PDF
              </ButtonLink>
              <ButtonLink href="/schedule-demo" size="lg">
                Review with DATEL
              </ButtonLink>
            </div>
          </MotionReveal>

          <MotionReveal className="grid gap-4 sm:grid-cols-3" amount={0.2}>
            <div className="rounded-2xl border border-[#d7e4ee] bg-white p-5 shadow-[0_8px_24px_rgb(18_52_88/8%)]">
              <p className="text-xs font-semibold tracking-wide text-[#123458] uppercase">Domain User Tiers</p>
              <p className="mt-2 text-2xl font-semibold text-[#015596]">{DOMAIN_TIERS.length}</p>
              <p className="mt-1 text-sm text-[#4f6781]">From 1 to 7,000 users per domain</p>
            </div>
            <div className="rounded-2xl border border-[#d9ece6] bg-[#f7fcfa] p-5 shadow-[0_8px_24px_rgb(18_52_88/8%)]">
              <p className="text-xs font-semibold tracking-wide text-[#123458] uppercase">Transcription Rates</p>
              <p className="mt-2 text-2xl font-semibold text-[#0e7c86]">$0.17 to $0.23</p>
              <p className="mt-1 text-sm text-[#4f6781]">Tiered by monthly transcription hours</p>
            </div>
            <div className="rounded-2xl border border-[#d7e4ee] bg-white p-5 shadow-[0_8px_24px_rgb(18_52_88/8%)]">
              <p className="text-xs font-semibold tracking-wide text-[#123458] uppercase">Storage Baseline</p>
              <p className="mt-2 text-2xl font-semibold text-[#015596]">$6.00 / month</p>
              <p className="mt-1 text-sm text-[#4f6781]">Includes first 2,000 hours, then $1.00 per 500 hours</p>
            </div>
          </MotionReveal>

          <MotionReveal
            className="rounded-2xl border border-[#d7e4ee] bg-white p-6 shadow-[0_8px_24px_rgb(18_52_88/8%)] sm:p-8"
            amount={0.2}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#123458]">Reseller Package Comparison</h2>
                <p className="mt-2 text-sm/6 text-[#4f6781]">Reference matrix for packaging conversations before calculating exact monthly estimates.</p>
              </div>
              <a
                href={PRICING_PDF_PATH}
                download
                className="inline-flex items-center gap-2 rounded-full border border-[#d9ece6] bg-[#f7fcfa] px-3 py-1.5 text-sm font-semibold text-[#0e7c86] transition-colors hover:bg-[#edf9f5]"
              >
                <DocumentIcon className="h-4 w-4" />
                Source PDF
              </a>
            </div>

            <div className="mt-6 space-y-8 lg:hidden">
              {COMPARISON_TIERS.map((tier) => (
                <section
                  key={tier.name}
                  className={classNames(
                    tier.name === 'Domain + Recording'
                      ? 'rounded-xl border border-[#d9ece6] bg-[#f7fcfa]'
                      : 'rounded-xl border border-[#e5eef5] bg-[#fbfdff]',
                    'p-5',
                  )}
                >
                  <h3 className="text-sm/6 font-semibold text-[#123458]">{tier.name}</h3>
                  <p className="mt-1 text-xl font-semibold text-[#015596]">{tier.model}</p>
                  <p className="mt-2 text-sm/6 text-[#4f6781]">{tier.description}</p>
                  <p className="mt-2 text-sm/6 text-[#4f6781]">{tier.summary}</p>
                  <ul role="list" className="mt-5 space-y-3 text-sm/6 text-[#123458]">
                    {tier.highlights.map((highlight) => (
                      <li key={highlight.description} className="flex items-start gap-3">
                        {highlight.disabled ? (
                          <MinusIcon aria-hidden="true" className="mt-2 text-[#9ab0c4]" />
                        ) : (
                          <CheckmarkIcon aria-hidden="true" className="mt-2 text-[#0e7c86]" />
                        )}
                        <span className={highlight.disabled ? 'text-[#4f6781]' : ''}>{highlight.description}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="mt-8 hidden overflow-x-auto lg:block">
              <table className="min-w-full table-fixed border-separate border-spacing-x-6 text-left">
                <caption className="sr-only">Reseller package comparison</caption>
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[23.3%]" />
                  <col className="w-[23.3%]" />
                  <col className="w-[23.3%]" />
                </colgroup>
                <thead>
                  <tr>
                    <td />
                    {COMPARISON_TIERS.map((tier) => (
                      <th key={tier.name} scope="col" className="px-4 pt-4">
                        <div className="text-sm/7 font-semibold text-[#123458]">{tier.name}</div>
                        <p className="mt-1 text-sm text-[#4f6781]">{tier.description}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className="py-3 text-sm/6 font-semibold text-[#123458]">
                      Pricing model
                    </th>
                    {COMPARISON_TIERS.map((tier) => (
                      <td key={tier.name} className="rounded-xl border border-[#e5eef5] bg-[#fbfdff] px-4 py-3 align-top">
                        <div className="text-base font-semibold text-[#015596]">{tier.model}</div>
                        <p className="mt-2 text-sm text-[#4f6781]">{tier.summary}</p>
                      </td>
                    ))}
                  </tr>

                  {COMPARISON_SECTIONS.map((section, sectionIdx) => (
                    <Fragment key={section.name}>
                      <tr>
                        <th
                          scope="colgroup"
                          colSpan={4}
                          className={classNames(sectionIdx === 0 ? 'pt-8' : 'pt-10', 'pb-3 text-sm/6 font-semibold text-[#123458]')}
                        >
                          {section.name}
                          <div className="mt-3 h-px bg-[#d7e4ee]" />
                        </th>
                      </tr>
                      {section.features.map((feature) => (
                        <tr key={feature.name}>
                          <th scope="row" className="py-3 text-sm/6 font-normal text-[#123458]">
                            {feature.name}
                          </th>
                          {COMPARISON_TIERS.map((tier) => (
                            <td key={`${tier.name}-${feature.name}`} className="px-4 py-3 align-middle">
                              <div className="flex items-center justify-center text-center">{renderComparisonValue(feature.tiers[tier.name], tier.name)}</div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </MotionReveal>

          <MotionReveal className="rounded-2xl border border-[#d7e4ee] bg-white p-6 shadow-[0_8px_24px_rgb(18_52_88/8%)] sm:p-8" amount={0.2}>
            <h2 className="text-xl font-semibold text-[#123458]">Domain Pricing by User Tier</h2>
            <p className="mt-2 text-sm/6 text-[#4f6781]">Reporting and call recording monthly pricing per domain from the DATEL sheet.</p>
            <div className="mt-5 overflow-x-auto rounded-xl border border-[#d7e4ee]">
              <table className="min-w-full divide-y divide-[#d7e4ee] text-sm">
                <thead>
                  <tr className="bg-[#eef5fb]">
                    <th rowSpan={2} className="px-3 py-3 text-left align-middle font-semibold text-[#123458]">Users</th>
                    <th colSpan={3} className="px-3 py-3 text-center font-semibold text-[#123458]">Reporting</th>
                    <th colSpan={3} className="px-3 py-3 text-center font-semibold text-[#123458]">Call Recording</th>
                  </tr>
                  <tr className="bg-[#f7fbff]">
                    <th className="px-3 py-2 text-left font-semibold text-[#123458]">Product</th>
                    <th className="px-3 py-2 text-right font-semibold text-[#123458]">Partner/Mo</th>
                    <th className="px-3 py-2 text-right font-semibold text-[#123458]">List/Mo</th>
                    <th className="px-3 py-2 text-left font-semibold text-[#123458]">Product</th>
                    <th className="px-3 py-2 text-right font-semibold text-[#123458]">Partner/Mo</th>
                    <th className="px-3 py-2 text-right font-semibold text-[#123458]">List/Mo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef4f8] bg-white">
                  {DOMAIN_TIERS.map((tier) => (
                    <tr key={tier.users}>
                      <td className="px-3 py-2.5 text-[#123458]">{tier.users}</td>
                      <td className="px-3 py-2.5 text-[#123458]">{tier.reportingProduct}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-[#0e7c86]">{tier.reportingPartnerMonthly}</td>
                      <td className="px-3 py-2.5 text-right text-[#4f6781]">{tier.reportingListMonthly}</td>
                      <td className="px-3 py-2.5 text-[#123458]">{tier.recordingProduct}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-[#0e7c86]">{tier.recordingPartnerMonthly}</td>
                      <td className="px-3 py-2.5 text-right text-[#4f6781]">{tier.recordingListMonthly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-[#4f6781]">For 7,001+ users, contact DATEL for a custom quote.</p>
          </MotionReveal>

          <MotionReveal className="grid gap-6 lg:grid-cols-3" amount={0.2}>
            <div className="rounded-2xl border border-[#d7e4ee] bg-white p-6 shadow-[0_8px_24px_rgb(18_52_88/8%)]">
              <h2 className="text-lg font-semibold text-[#123458]">Transcription Summarization</h2>
              <p className="mt-2 text-sm/6 text-[#4f6781]">Monthly usage-based rates.</p>
              <div className="mt-4 overflow-x-auto rounded-xl border border-[#e5eef5]">
                <table className="min-w-full divide-y divide-[#e5eef5] text-sm">
                  <thead className="bg-[#f4f8fb]">
                    <tr>
                      <th className="px-3 py-2.5 text-left font-semibold text-[#123458]">Volume Tier</th>
                      <th className="px-3 py-2.5 text-right font-semibold text-[#123458]">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eef4f8]">
                    {TRANSCRIPTION_PRICING.map((tier) => (
                      <tr key={tier.tier}>
                        <td className="px-3 py-2.5 text-[#123458]">{tier.tier}</td>
                        <td className="px-3 py-2.5 text-right font-semibold text-[#0e7c86]">{tier.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d7e4ee] bg-white p-6 shadow-[0_8px_24px_rgb(18_52_88/8%)]">
              <h2 className="text-lg font-semibold text-[#123458]">Recording Storage</h2>
              <p className="mt-2 text-sm/6 text-[#4f6781]">Applies to extended storage volume.</p>
              <dl className="mt-4 divide-y divide-[#eef4f8] rounded-xl border border-[#e5eef5] bg-[#fbfdff]">
                {STORAGE_PRICING.map((row) => (
                  <div key={row.item} className="flex items-start justify-between gap-4 px-4 py-3">
                    <dt className="text-sm text-[#123458]">{row.item}</dt>
                    <dd className="text-sm font-semibold text-[#015596]">{row.monthly}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-[#d7e4ee] bg-white p-6 shadow-[0_8px_24px_rgb(18_52_88/8%)]">
              <h2 className="text-lg font-semibold text-[#123458]">AI and Real-Time Add-Ons</h2>
              <p className="mt-2 text-sm/6 text-[#4f6781]">Optional add-ons for advanced operations and analytics.</p>
              <div className="mt-4 space-y-3">
                {ADD_ON_PRICING.map((addon) => (
                  <div key={addon.name} className="rounded-xl border border-[#e5eef5] bg-[#fbfdff] p-4">
                    <p className="text-sm font-semibold text-[#123458]">{addon.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#4f6781]">Product {addon.product}</p>
                    <p className="mt-2 text-sm font-semibold text-[#0e7c86]">{addon.partnerRate}</p>
                    <ul className="mt-2 space-y-1 text-xs/5 text-[#4f6781]">
                      {addon.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>

          <MotionReveal className="rounded-2xl border border-[#d9ece6] bg-[#f7fcfa] p-6 sm:p-8" amount={0.2}>
            <h2 className="text-xl font-semibold text-[#123458]">Notes</h2>
            <ul className="mt-3 space-y-2 text-sm/6 text-[#4f6781]">
              <li>Rates shown are based on the provided DATEL_CloudSWEET_Pricing.pdf for reseller planning.</li>
              <li>Final contracted pricing can vary by partner agreement and negotiated volume terms.</li>
              <li>Use the estimator to calculate mixed scenarios across domain size, usage, and add-ons.</li>
            </ul>
            <div className="mt-6">
              <ButtonLink
                href={PRICING_PDF_PATH}
                download
                size="md"
                color="light"
                className="gap-2 border-[#d9ece6] text-[#0e7c86] hover:bg-[#edf9f5]"
              >
                <CloudArrowDownIcon className="h-4 w-4" />
                Download source pricing sheet
              </ButtonLink>
            </div>
          </MotionReveal>
        </div>
      </Container>
    </section>
  )
}
