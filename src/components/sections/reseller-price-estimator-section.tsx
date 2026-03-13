'use client'

import { ButtonLink, SoftButtonLink } from '@/components/elements/button'
import { Container } from '@/components/elements/container'
import {
  REAL_TIME_AGENT_RATE,
  REAL_TIME_MIN_AGENTS,
  SENTIMENT_INTRO_RATE,
  SENTIMENT_STANDARD_RATE,
  STORAGE_BASE_HOURS,
  STORAGE_BASE_PRICE,
  STORAGE_BLOCK_HOURS,
  STORAGE_BLOCK_PRICE,
  clampToNonNegativeNumber,
  formatUsd,
  getDomainTierForUsers,
  getTranscriptionTierForHours,
  estimateStorageMonthlyCost,
  roundCurrency,
} from '@/lib/cloudsweet-pricing'
import { useMemo, useState } from 'react'

function Input({
  id,
  label,
  value,
  onChange,
  min = 0,
  step = 1,
  helper,
}: {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  step?: number
  helper?: string
}) {
  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="text-sm/6 font-semibold text-[#123458]">{label}</span>
      <input
        id={id}
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-lg border border-[#d7e4ee] bg-white px-3 py-2 text-sm text-[#0b1b2b] shadow-[inset_0_1px_2px_rgb(18_52_88/8%)]"
      />
      {helper ? <span className="text-xs text-[#4f6781]">{helper}</span> : null}
    </label>
  )
}

function Toggle({
  id,
  label,
  checked,
  onChange,
  helper,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  helper?: string
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 rounded-lg border border-[#d7e4ee] bg-white px-3 py-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-4 rounded border-[#9ab0c4] text-[#015596] focus:ring-[#015596]"
      />
      <span>
        <span className="block text-sm/6 font-semibold text-[#123458]">{label}</span>
        {helper ? <span className="block text-xs/5 text-[#4f6781]">{helper}</span> : null}
      </span>
    </label>
  )
}

export function ResellerPriceEstimatorSection() {
  const [users, setUsers] = useState(120)
  const [transcriptionHours, setTranscriptionHours] = useState(1200)
  const [storageHours, setStorageHours] = useState(2300)
  const [includeRecording, setIncludeRecording] = useState(true)
  const [includeTranscription, setIncludeTranscription] = useState(true)
  const [includeStorage, setIncludeStorage] = useState(true)
  const [includeRealTime, setIncludeRealTime] = useState(false)
  const [realTimeAgents, setRealTimeAgents] = useState(5)
  const [includeSentiment, setIncludeSentiment] = useState(false)
  const [sentimentAgents, setSentimentAgents] = useState(5)
  const [useSentimentIntroRate, setUseSentimentIntroRate] = useState(true)
  const [includeRedaction, setIncludeRedaction] = useState(false)

  const tier = useMemo(() => getDomainTierForUsers(users), [users])
  const transcriptionTier = useMemo(() => getTranscriptionTierForHours(transcriptionHours), [transcriptionHours])

  const pricing = useMemo(() => {
    const reportingMonthly = tier ? tier.reportingPartnerMonthly : 0
    const recordingMonthly = tier && includeRecording ? tier.recordingPartnerMonthly : 0
    const transcriptionMonthly = includeTranscription ? roundCurrency(clampToNonNegativeNumber(transcriptionHours) * transcriptionTier.rate) : 0
    const storageMonthly = includeStorage ? estimateStorageMonthlyCost(storageHours) : 0

    const billedRealTimeAgents = includeRealTime ? Math.max(REAL_TIME_MIN_AGENTS, Math.floor(clampToNonNegativeNumber(realTimeAgents))) : 0
    const realTimeMonthly = billedRealTimeAgents * REAL_TIME_AGENT_RATE

    const sentimentRate = useSentimentIntroRate ? SENTIMENT_INTRO_RATE : SENTIMENT_STANDARD_RATE
    const billedSentimentAgents = includeSentiment ? Math.max(1, Math.floor(clampToNonNegativeNumber(sentimentAgents))) : 0
    const sentimentMonthly = billedSentimentAgents * sentimentRate

    const monthlyTotal = roundCurrency(reportingMonthly + recordingMonthly + transcriptionMonthly + storageMonthly + realTimeMonthly + sentimentMonthly)
    const annualRunRate = roundCurrency(monthlyTotal * 12)
    const sentimentAtStandardRate = includeSentiment ? billedSentimentAgents * SENTIMENT_STANDARD_RATE : 0
    const monthFourTotal = roundCurrency(monthlyTotal - sentimentMonthly + sentimentAtStandardRate)

    return {
      reportingMonthly,
      recordingMonthly,
      transcriptionMonthly,
      storageMonthly,
      realTimeMonthly,
      billedRealTimeAgents,
      sentimentMonthly,
      billedSentimentAgents,
      sentimentRate,
      monthlyTotal,
      annualRunRate,
      monthFourTotal,
    }
  }, [
    includeRealTime,
    includeRecording,
    includeSentiment,
    includeStorage,
    includeTranscription,
    realTimeAgents,
    sentimentAgents,
    storageHours,
    tier,
    transcriptionHours,
    transcriptionTier.rate,
    useSentimentIntroRate,
  ])

  const outOfRange = users < 1 || users > 7000 || tier === null

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="w-full">
          <div className="rounded-2xl border border-[#d7e4ee] bg-white p-8 shadow-[0_8px_24px_rgb(18_52_88/10%)]">
            <p className="text-xs font-semibold tracking-[0.12em] text-[#0e7c86] uppercase">Reseller Tools</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#015596] sm:text-4xl">CloudSWEET Price Estimator</h1>
            <p className="mt-4 max-w-4xl text-base/7 text-[#4f6781]">
              Estimate monthly partner pricing using the DATEL CloudSWEET pricing sheet. Enter your reseller usage and toggle add-ons to model
              cost scenarios for each domain.
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#d7e4ee] bg-white p-6 shadow-[0_8px_24px_rgb(18_52_88/8%)]">
                <h2 className="text-lg font-semibold text-[#123458]">1. Domain Profile</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Input id="users" label="Active Users" value={users} onChange={setUsers} min={0} helper="Tiered per-domain pricing from 1 to 7,000 users." />
                </div>
                <div className="mt-4 rounded-lg border border-[#d9ece6] bg-[#f7fcfa] px-4 py-3 text-sm text-[#123458]">
                  {tier ? (
                    <>
                      <p className="font-semibold">Matched tier: {tier.label}</p>
                      <p className="mt-1 text-[#4f6781]">
                        Reporting ({tier.reportingProduct}) {formatUsd(tier.reportingPartnerMonthly)}/mo
                        {' · '}
                        Recording Add-On ({tier.recordingProduct}) {formatUsd(tier.recordingPartnerMonthly)}/mo
                      </p>
                    </>
                  ) : (
                    <p className="font-semibold text-[#9a3b00]">User count is outside the 1 to 7,000 range. Contact DATEL for quote pricing.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-[#d7e4ee] bg-white p-6 shadow-[0_8px_24px_rgb(18_52_88/8%)]">
                <h2 className="text-lg font-semibold text-[#123458]">2. Usage Inputs</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Input
                    id="transcription-hours"
                    label="Transcription Hours / Month"
                    value={transcriptionHours}
                    onChange={setTranscriptionHours}
                    min={0}
                    step={1}
                    helper={`Current tier: ${transcriptionTier.label} at ${formatUsd(transcriptionTier.rate)}/hr`}
                  />
                  <Input
                    id="storage-hours"
                    label="Recording Storage Hours"
                    value={storageHours}
                    onChange={setStorageHours}
                    min={0}
                    step={1}
                    helper={`$${STORAGE_BASE_PRICE}.00 base for first ${STORAGE_BASE_HOURS.toLocaleString()} hrs, then $${STORAGE_BLOCK_PRICE}.00 per ${STORAGE_BLOCK_HOURS}-hr block.`}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#d7e4ee] bg-white p-6 shadow-[0_8px_24px_rgb(18_52_88/8%)]">
                <h2 className="text-lg font-semibold text-[#123458]">3. Add-Ons</h2>
                <div className="mt-4 grid gap-3">
                  <Toggle id="include-recording" label="Call Recording Integration" checked={includeRecording} onChange={setIncludeRecording} />
                  <Toggle
                    id="include-transcription"
                    label="Transcription Summarization"
                    checked={includeTranscription}
                    onChange={setIncludeTranscription}
                    helper="Volume-based reseller rates are applied automatically."
                  />
                  <Toggle id="include-storage" label="Extended Recording Storage" checked={includeStorage} onChange={setIncludeStorage} />
                  <Toggle
                    id="include-realtime"
                    label="Real-Time Agent/Queue Views"
                    checked={includeRealTime}
                    onChange={(checked) => {
                      setIncludeRealTime(checked)
                      if (checked && realTimeAgents < REAL_TIME_MIN_AGENTS) setRealTimeAgents(REAL_TIME_MIN_AGENTS)
                    }}
                    helper={`${formatUsd(REAL_TIME_AGENT_RATE)}/agent/month with ${REAL_TIME_MIN_AGENTS}-agent minimum.`}
                  />
                  {includeRealTime ? (
                    <Input
                      id="real-time-agents"
                      label="Real-Time Agents"
                      value={realTimeAgents}
                      onChange={setRealTimeAgents}
                      min={REAL_TIME_MIN_AGENTS}
                      helper={`Billing minimum: ${REAL_TIME_MIN_AGENTS} agents.`}
                    />
                  ) : null}

                  <Toggle
                    id="include-sentiment"
                    label="Sentiment Analysis & AI Agent Analytics"
                    checked={includeSentiment}
                    onChange={(checked) => {
                      setIncludeSentiment(checked)
                      if (checked) {
                        setIncludeRecording(true)
                        setIncludeTranscription(true)
                      }
                    }}
                    helper="Requires recording and transcription. 3-month minimum applies."
                  />
                  {includeSentiment ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input id="sentiment-agents" label="Sentiment Agents" value={sentimentAgents} onChange={setSentimentAgents} min={1} />
                      <label className="grid gap-2">
                        <span className="text-sm/6 font-semibold text-[#123458]">Sentiment Rate Phase</span>
                        <select
                          value={useSentimentIntroRate ? 'intro' : 'standard'}
                          onChange={(event) => setUseSentimentIntroRate(event.target.value === 'intro')}
                          className="w-full rounded-lg border border-[#d7e4ee] bg-white px-3 py-2 text-sm text-[#0b1b2b]"
                        >
                          <option value="intro">Intro (Months 1-3) · $8/agent</option>
                          <option value="standard">Standard (Month 4+) · $13/agent</option>
                        </select>
                      </label>
                    </div>
                  ) : null}

                  <Toggle
                    id="include-redaction"
                    label="PII Redaction"
                    checked={includeRedaction}
                    onChange={setIncludeRedaction}
                    helper="Custom-priced service. Contact DATEL for quote."
                  />
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-[#d7e4ee] bg-white p-6 shadow-[0_8px_24px_rgb(18_52_88/10%)] lg:sticky lg:top-24 lg:h-fit">
              <h2 className="text-lg font-semibold text-[#123458]">Estimated Partner Pricing</h2>
              <p className="mt-2 text-sm/6 text-[#4f6781]">Monthly estimate by domain based on selected package and add-ons.</p>

              <div className="mt-5 rounded-xl border border-[#d9ece6] bg-[#f7fcfa] p-4">
                <p className="text-xs font-semibold tracking-[0.08em] text-[#4f6781] uppercase">Estimated Monthly Total</p>
                <p className="mt-1 text-3xl font-semibold text-[#0e7c86]">{outOfRange ? 'Call for quote' : formatUsd(pricing.monthlyTotal)}</p>
                <p className="mt-1 text-sm text-[#4f6781]">Annual run-rate: {outOfRange ? 'Contact DATEL' : formatUsd(pricing.annualRunRate)}</p>
                {includeSentiment && useSentimentIntroRate && !outOfRange ? (
                  <p className="mt-2 text-xs text-[#4f6781]">Month 4+ total (after sentiment intro period): {formatUsd(pricing.monthFourTotal)}</p>
                ) : null}
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[#4f6781]">Reporting Base Package</dt>
                  <dd className="font-semibold text-[#123458]">{tier ? formatUsd(pricing.reportingMonthly) : 'Quote'}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[#4f6781]">Call Recording Integration</dt>
                  <dd className="font-semibold text-[#123458]">{includeRecording && tier ? formatUsd(pricing.recordingMonthly) : formatUsd(0)}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[#4f6781]">Transcription ({transcriptionTier.label})</dt>
                  <dd className="font-semibold text-[#123458]">{includeTranscription ? formatUsd(pricing.transcriptionMonthly) : formatUsd(0)}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[#4f6781]">Storage Add-On</dt>
                  <dd className="font-semibold text-[#123458]">{includeStorage ? formatUsd(pricing.storageMonthly) : formatUsd(0)}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[#4f6781]">Real-Time Queue Views</dt>
                  <dd className="font-semibold text-[#123458]">
                    {includeRealTime ? `${formatUsd(pricing.realTimeMonthly)} (${pricing.billedRealTimeAgents} agents)` : formatUsd(0)}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[#4f6781]">Sentiment Analytics</dt>
                  <dd className="font-semibold text-[#123458]">
                    {includeSentiment
                      ? `${formatUsd(pricing.sentimentMonthly)} (${pricing.billedSentimentAgents} @ ${formatUsd(pricing.sentimentRate)})`
                      : formatUsd(0)}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[#4f6781]">PII Redaction</dt>
                  <dd className="font-semibold text-[#123458]">{includeRedaction ? 'Custom quote' : 'Not included'}</dd>
                </div>
              </dl>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <SoftButtonLink href="/schedule-demo" className="justify-center">
                  Review estimate with DATEL
                </SoftButtonLink>
                <ButtonLink href="/docs" color="light" className="justify-center">
                  View pricing documentation
                </ButtonLink>
              </div>

              <p className="mt-5 text-xs/5 text-[#4f6781]">
                Pricing assumptions are based on DATEL_CloudSWEET_Pricing.pdf. Quotes are required for more than 7,000 users, custom redaction,
                and any reseller-specific discounts. Transcription discount pricing applies at 30,000+ hours/month.
              </p>
            </aside>
          </div>
        </div>
      </Container>
    </section>
  )
}
