'use client'

import { Button } from '@/components/elements/button'
import { Container } from '@/components/elements/container'
import { ResellerPriceEstimatorSection } from '@/components/sections/reseller-price-estimator-section'
import { ResellerPricingDocsSection } from '@/components/sections/reseller-pricing-docs-section'
import { estimateSiteBundleCosts } from '@/lib/cloudsweet-pricing'
import { useCallback, useEffect, useMemo, useState } from 'react'

type UsagePeriod = {
  type: string
  billing_month: string | null
  start_date: string
  end_date: string
}

type UsageAggregate = {
  transcription_seconds: number
  transcription_hours: number
  estimated_transcription_cost: number
  period_recording: {
    recording_seconds: number
    recording_hours: number
    estimated_recording_cost: number
  }
  current_storage: {
    total_recordings: number
    total_duration_seconds: number
    total_duration_hours: number
    ave_daily_recordings: number
    stats_last_updated: string | null
    estimated_storage_cost: number
  }
}

type UsageSite = {
  site_id: number
  customer_name: string
  display_name: string
  domain: string
  enabled: boolean
  billing_user_count?: number
  transcription_seconds: number
  transcription_hours: number
  estimated_transcription_cost: number
  period_recording: UsageAggregate['period_recording']
  current_storage: UsageAggregate['current_storage']
}

type AdminReseller = {
  reseller_id: string
  reseller_db_id: number
  subtotal: UsageAggregate
  sites: UsageSite[]
}

type AdminUsagePayload = {
  scope: 'admin'
  period: UsagePeriod
  grand_total: UsageAggregate
  resellers: AdminReseller[]
}

type ResellerUsagePayload = {
  scope: 'reseller'
  period: UsagePeriod
  reseller_id: string
  total: UsageAggregate
  sites: UsageSite[]
}

type UsagePayload = AdminUsagePayload | ResellerUsagePayload

type UsageError = {
  error: string
}

type ExportFormat = 'excel' | 'pdf'
type UsageFilterMode = 'month' | 'ytd' | 'custom'
type DashboardTab = 'usage' | 'pricing' | 'docs'

type UsageFilter = {
  mode: UsageFilterMode
  billingMonth: string
  startDate: string
  endDate: string
}

type UsageQuery = {
  billingMonth?: string
  startDate?: string
  endDate?: string
}

const BILLING_MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/

function getCurrentMonthValue() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function getTodayDateValue() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function normalizeBillingMonthValue(value: string) {
  const normalized = String(value || '').trim()
  return BILLING_MONTH_REGEX.test(normalized) ? normalized : getCurrentMonthValue()
}

function getYearToDateRange(billingMonth: string) {
  const normalizedMonth = normalizeBillingMonthValue(billingMonth)
  const [yearText, monthText] = normalizedMonth.split('-')
  const year = Number(yearText)
  const month = Number(monthText)
  const lastDay = new Date(year, month, 0).getDate()

  return {
    startDate: `${yearText}-01-01`,
    endDate: `${yearText}-${monthText}-${String(lastDay).padStart(2, '0')}`,
  }
}

function buildUsageQueryFromFilter(filter: UsageFilter): UsageQuery {
  if (filter.mode === 'month') {
    return { billingMonth: normalizeBillingMonthValue(filter.billingMonth) }
  }

  if (filter.mode === 'ytd') {
    const range = getYearToDateRange(filter.billingMonth)
    return { startDate: range.startDate, endDate: range.endDate }
  }

  return {
    startDate: filter.startDate,
    endDate: filter.endDate,
  }
}

function formatHours(value: number) {
  return value.toFixed(2)
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`
}

function formatInteger(value: number) {
  return value.toLocaleString()
}

function getAggregateEstimatedBilling(aggregate: UsageAggregate) {
  return aggregate.estimated_transcription_cost + aggregate.period_recording.estimated_recording_cost + aggregate.current_storage.estimated_storage_cost
}

function getSiteEstimatedBilling(site: UsageSite) {
  return site.estimated_transcription_cost + site.period_recording.estimated_recording_cost + site.current_storage.estimated_storage_cost
}

function getSiteBundlePricing(site: UsageSite) {
  return estimateSiteBundleCosts({
    users: Number(site.billing_user_count ?? 0),
    transcriptionHours: site.transcription_hours,
    storageHours: site.current_storage.total_duration_hours,
  })
}

function getBundleTotalsForSites(sites: UsageSite[]) {
  return sites.reduce(
    (totals, site) => {
      const bundle = getSiteBundlePricing(site)
      return {
        domainBase: totals.domainBase + bundle.domainBase,
        domainPlusRecording: totals.domainPlusRecording + bundle.domainPlusRecording,
        fullAiSuite: totals.fullAiSuite + bundle.fullAiSuite,
        customQuoteSites: totals.customQuoteSites + (bundle.hasTier ? 0 : 1),
      }
    },
    { domainBase: 0, domainPlusRecording: 0, fullAiSuite: 0, customQuoteSites: 0 },
  )
}

function resolveDownloadName(contentDisposition: string | null, fallback: string) {
  if (!contentDisposition) return fallback

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match && utf8Match[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim())
    } catch {
      return utf8Match[1].trim()
    }
  }

  const plainMatch = contentDisposition.match(/filename="?([^\";]+)"?/i)
  return plainMatch && plainMatch[1] ? plainMatch[1].trim() : fallback
}

export function DashboardHomeSection() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('usage')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState<ExportFormat | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [data, setData] = useState<UsagePayload | null>(null)
  const [filterMode, setFilterMode] = useState<UsageFilterMode>('month')
  const [monthInput, setMonthInput] = useState(getCurrentMonthValue())
  const [customStartInput, setCustomStartInput] = useState(`${new Date().getFullYear()}-01-01`)
  const [customEndInput, setCustomEndInput] = useState(getTodayDateValue())
  const [appliedFilter, setAppliedFilter] = useState<UsageFilter>({
    mode: 'month',
    billingMonth: getCurrentMonthValue(),
    startDate: '',
    endDate: '',
  })

  const loadUsage = useCallback(async (queryInput: UsageQuery) => {
    setLoading(true)
    setErrorMessage(null)

    try {
      const query = new URLSearchParams()
      if (queryInput.billingMonth) query.set('billing_month', queryInput.billingMonth)
      if (queryInput.startDate) query.set('start_date', queryInput.startDate)
      if (queryInput.endDate) query.set('end_date', queryInput.endDate)
      const response = await fetch(`/api/accounting/hours?${query.toString()}`, { cache: 'no-store' })
      const payload = (await response.json().catch(() => null)) as UsagePayload | UsageError | null

      if (!response.ok) {
        const message = payload && 'error' in payload ? payload.error : 'Unable to load usage data.'
        throw new Error(message)
      }

      if (!payload || !('scope' in payload)) {
        throw new Error('Unexpected usage response.')
      }

      setData(payload)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Unable to load usage data.')
      }
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadUsage(buildUsageQueryFromFilter(appliedFilter))
  }, [appliedFilter, loadUsage])

  const totals = useMemo(() => {
    if (!data) return null
    return data.scope === 'admin' ? data.grand_total : data.total
  }, [data])

  const adminRollupCounts = useMemo(() => {
    if (!data || data.scope !== 'admin') return null
    const totalSites = data.resellers.reduce((count, reseller) => count + reseller.sites.length, 0)
    return {
      resellerCount: data.resellers.length,
      siteCount: totalSites,
    }
  }, [data])

  const allVisibleSites = useMemo(() => {
    if (!data) return [] as UsageSite[]
    if (data.scope === 'admin') return data.resellers.flatMap((reseller) => reseller.sites)
    return data.sites
  }, [data])

  const allBundleTotals = useMemo(() => getBundleTotalsForSites(allVisibleSites), [allVisibleSites])

  const resellerBundleTotals = useMemo(() => {
    if (!data || data.scope !== 'reseller') return null
    return getBundleTotalsForSites(data.sites)
  }, [data])

  function handleApplyFilter() {
    setErrorMessage(null)

    if (filterMode === 'custom') {
      const startDate = customStartInput.trim()
      const endDate = customEndInput.trim()

      if (!startDate || !endDate) {
        setErrorMessage('Custom billing range requires both start and end dates.')
        return
      }

      if (new Date(endDate) < new Date(startDate)) {
        setErrorMessage('Custom billing end date must be on or after start date.')
        return
      }

      setAppliedFilter({
        mode: 'custom',
        billingMonth: normalizeBillingMonthValue(monthInput),
        startDate,
        endDate,
      })
      return
    }

    if (filterMode === 'ytd') {
      const normalizedMonth = normalizeBillingMonthValue(monthInput)
      const range = getYearToDateRange(normalizedMonth)
      setAppliedFilter({
        mode: 'ytd',
        billingMonth: normalizedMonth,
        startDate: range.startDate,
        endDate: range.endDate,
      })
      return
    }

    setAppliedFilter({
      mode: 'month',
      billingMonth: normalizeBillingMonthValue(monthInput),
      startDate: '',
      endDate: '',
    })
  }

  async function handleExport(format: ExportFormat) {
    if (exporting) return

    setExporting(format)
    setErrorMessage(null)

    try {
      const query = new URLSearchParams()
      const queryInput = buildUsageQueryFromFilter(appliedFilter)
      if (queryInput.billingMonth) query.set('billing_month', queryInput.billingMonth)
      if (queryInput.startDate) query.set('start_date', queryInput.startDate)
      if (queryInput.endDate) query.set('end_date', queryInput.endDate)
      query.set('format', format)

      const response = await fetch(`/api/accounting/export?${query.toString()}`, {
        method: 'GET',
        cache: 'no-store',
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as UsageError | null
        throw new Error(payload?.error || 'Unable to export usage sheet.')
      }

      const extension = format === 'pdf' ? 'pdf' : 'csv'
      const fallbackPeriod = queryInput.billingMonth || `${queryInput.startDate || 'start'}_to_${queryInput.endDate || 'end'}`
      const fallbackName = `usage-hours-${fallbackPeriod.replace(/[^a-zA-Z0-9._-]/g, '_')}.${extension}`
      const fileName = resolveDownloadName(response.headers.get('content-disposition'), fallbackName)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()

      URL.revokeObjectURL(blobUrl)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Unable to export usage sheet.')
      }
    } finally {
      setExporting(null)
    }
  }

  return (
    <section className="relative isolate py-12 sm:py-16">
      <Container>
        <div className="mb-6 rounded-[var(--radius-card)] border border-[#d7e4ee] bg-white/96 p-5 shadow-[0_8px_24px_rgb(18_52_88/8%)] sm:p-6">
          <p className="text-xs font-semibold tracking-[0.12em] text-[#0e7c86] uppercase">Reseller Dashboard</p>
          <div className="mt-3 inline-flex rounded-full border border-[#d7e4ee] bg-[#f4f8fb] p-1">
            <button
              type="button"
              onClick={() => setActiveTab('usage')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'usage' ? 'bg-[#015596] text-white' : 'text-[#123458] hover:bg-[#e8f1f8]'
              }`}
            >
              Usage
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pricing')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'pricing' ? 'bg-[#015596] text-white' : 'text-[#123458] hover:bg-[#e8f1f8]'
              }`}
            >
              Pricing Calculator
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('docs')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'docs' ? 'bg-[#015596] text-white' : 'text-[#123458] hover:bg-[#e8f1f8]'
              }`}
            >
              Documentation
            </button>
          </div>
        </div>

        {activeTab === 'usage' && (
          <div className="w-full rounded-[var(--radius-card)] border border-[#d9ece6] bg-white/96 p-6 shadow-[0_24px_56px_rgb(18_52_88/10%)] sm:p-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-balance text-[#015596] sm:text-5xl">Usage Dashboard</h1>
            <p className="mt-3 text-lg/8 text-[#4f6781]">
              Transcription, period recording, and current storage usage with reseller subtotals and grand totals.
            </p>
            {data?.scope === 'admin' && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="inline-flex rounded-full border border-[#0e7c86] bg-[#0e7c86] px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase">
                  Admin View
                </p>
                {adminRollupCounts && (
                  <p className="text-sm text-[#4f6781]">
                    {adminRollupCounts.resellerCount} resellers • {adminRollupCounts.siteCount} sites
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm/6 font-semibold text-[#123458]">
              Billing view
              <select
                value={filterMode}
                onChange={(event) => setFilterMode(event.target.value as UsageFilterMode)}
                className="mt-1 block rounded-lg border border-[#d7e4ee] bg-white px-3 py-2 text-sm text-[#0b1b2b]"
              >
                <option value="month">Month</option>
                <option value="ytd">Year to Date</option>
                <option value="custom">Custom Range</option>
              </select>
            </label>
            {(filterMode === 'month' || filterMode === 'ytd') && (
              <label className="text-sm/6 font-semibold text-[#123458]">
                Billing month
                <input
                  type="month"
                  value={monthInput}
                  onChange={(event) => setMonthInput(event.target.value)}
                  className="mt-1 block rounded-lg border border-[#d7e4ee] bg-white px-3 py-2 text-sm text-[#0b1b2b]"
                />
              </label>
            )}
            {filterMode === 'custom' && (
              <>
                <label className="text-sm/6 font-semibold text-[#123458]">
                  Start date
                  <input
                    type="date"
                    value={customStartInput}
                    onChange={(event) => setCustomStartInput(event.target.value)}
                    className="mt-1 block rounded-lg border border-[#d7e4ee] bg-white px-3 py-2 text-sm text-[#0b1b2b]"
                  />
                </label>
                <label className="text-sm/6 font-semibold text-[#123458]">
                  End date
                  <input
                    type="date"
                    value={customEndInput}
                    onChange={(event) => setCustomEndInput(event.target.value)}
                    className="mt-1 block rounded-lg border border-[#d7e4ee] bg-white px-3 py-2 text-sm text-[#0b1b2b]"
                  />
                </label>
              </>
            )}
            <Button
              type="button"
              color="light"
              onClick={handleApplyFilter}
              className="border-[#0e7c86] bg-[#0e7c86] text-white hover:border-[#0b6670] hover:bg-[#0b6670]"
            >
              Apply
            </Button>
            <Button
              type="button"
              color="light"
              onClick={() => handleExport('excel')}
              disabled={loading || !data || exporting !== null}
            >
              {exporting === 'excel' ? 'Exporting Excel...' : 'Export Excel'}
            </Button>
            <Button
              type="button"
              color="light"
              onClick={() => handleExport('pdf')}
              disabled={loading || !data || exporting !== null}
            >
              {exporting === 'pdf' ? 'Exporting PDF...' : 'Export PDF'}
            </Button>
          </div>
        </div>

        {data && (
          <div className="mt-6 rounded-xl border border-[#d7e4ee] bg-[#f4f8fb] px-4 py-3 text-sm text-[#123458]">
            Period: {data.period.start_date} to {data.period.end_date}
            {data.period.billing_month ? ` (${data.period.billing_month})` : ''}
          </div>
        )}

        <div className="mt-4 rounded-xl border border-[#d9ece6] bg-[#f7fcfa] px-4 py-3 text-sm text-[#4f6781]">
          Transcription hours come from `ai_analytics_usage_monthly` for the selected billing month. Period recording is date-filtered, and current storage is a live snapshot (not date-filtered). Estimated billing totals use: transcription cost + period recording cost + storage cost.
        </div>

        {errorMessage && (
          <div className="mt-8 max-w-xl rounded-xl border border-[#ff9f01]/35 bg-[#fff7eb] px-4 py-3 text-sm/6 text-[#123458]">
            {errorMessage}
          </div>
        )}

        {loading && (
          <div className="mt-10 rounded-xl border border-[#d7e4ee] bg-white px-4 py-6 text-sm/6 text-[#4f6781]">Loading usage...</div>
        )}

        {!loading && totals && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#d9ece6] bg-[#f7fcfa] px-4 py-3">
              <p className="text-xs font-semibold tracking-wide text-[#123458] uppercase">
                {data?.scope === 'admin' ? 'Grand Total Transcription (Period)' : 'Transcription (Period)'}
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#0e7c86]">{formatHours(totals.transcription_hours)} hrs</p>
              <p className="text-sm text-[#4f6781]">{formatCurrency(totals.estimated_transcription_cost)}</p>
              <p className="text-xs text-[#4f6781]">{formatInteger(totals.transcription_seconds)} sec</p>
            </div>
            <div className="rounded-xl border border-[#d7e4ee] bg-[#f4f8fb] px-4 py-3">
              <p className="text-xs font-semibold tracking-wide text-[#123458] uppercase">
                {data?.scope === 'admin' ? 'Grand Total Period Recording' : 'Period Recording'}
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#015596]">{formatHours(totals.period_recording.recording_hours)} hrs</p>
              <p className="text-sm text-[#4f6781]">{formatCurrency(totals.period_recording.estimated_recording_cost)}</p>
              <p className="text-xs text-[#4f6781]">{formatInteger(totals.period_recording.recording_seconds)} sec</p>
            </div>
            <div className="rounded-xl border border-[#d7e4ee] bg-[#f4f8fb] px-4 py-3">
              <p className="text-xs font-semibold tracking-wide text-[#123458] uppercase">
                {data?.scope === 'admin' ? 'Grand Total Current Storage' : 'Current Storage'}
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#015596]">{formatHours(totals.current_storage.total_duration_hours)} hrs</p>
              <p className="text-sm text-[#4f6781]">{formatCurrency(totals.current_storage.estimated_storage_cost)}</p>
              <p className="text-xs text-[#4f6781]">{formatInteger(totals.current_storage.total_recordings)} recordings</p>
            </div>
            <div className="rounded-xl border border-[#d9ece6] bg-[#f7fcfa] px-4 py-3">
              <p className="text-xs font-semibold tracking-wide text-[#123458] uppercase">
                {data?.scope === 'admin' ? 'Grand Total Estimated Billing' : 'Estimated Billing'}
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#0e7c86]">{formatCurrency(getAggregateEstimatedBilling(totals))}</p>
              <p className="text-xs text-[#4f6781]">Usage-only: transcription + recording + storage</p>
              <p className="mt-1 text-xs font-semibold text-[#123458]">Full AI bundle est: {formatCurrency(allBundleTotals.fullAiSuite)}</p>
            </div>
          </div>
        )}

        {!loading && data?.scope === 'reseller' && (
          <div className="mt-10 space-y-6">
            <div className="rounded-xl border border-[#d7e4ee] bg-white px-4 py-3">
              <p className="text-sm/6 font-semibold text-[#123458]">Reseller ID: {data.reseller_id}</p>
              <p className="text-sm text-[#4f6781]">{data.sites.length} sites</p>
              <p className="text-sm font-semibold text-[#0e7c86]">Estimated Billing: {formatCurrency(getAggregateEstimatedBilling(data.total))}</p>
              {resellerBundleTotals && (
                <p className="text-xs text-[#4f6781]">
                  Bundle estimates - Base: {formatCurrency(resellerBundleTotals.domainBase)} · Base+Recording:{' '}
                  {formatCurrency(resellerBundleTotals.domainPlusRecording)} · Full AI: {formatCurrency(resellerBundleTotals.fullAiSuite)}
                </p>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#d7e4ee]">
              <table className="min-w-full divide-y divide-[#d7e4ee]">
                <thead className="bg-[#f4f8fb]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-[#123458] uppercase">Site ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-[#123458] uppercase">Site</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-[#123458] uppercase">Domain</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-[#123458] uppercase">Enabled</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Users</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Base $</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Base+Rec $</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Full AI $</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Transcription Hrs</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Period Rec Hrs</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Storage Hrs</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Est Billing $</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef4f8] bg-white">
                  {data.sites.map((site) => {
                    const bundlePricing = getSiteBundlePricing(site)
                    return (
                      <tr key={site.site_id}>
                        <td className="px-4 py-3 text-sm text-[#4f6781]">{site.site_id}</td>
                        <td className="px-4 py-3 text-sm text-[#0b1b2b]">{site.customer_name}</td>
                        <td className="px-4 py-3 text-sm text-[#0b1b2b]">{site.domain}</td>
                        <td className="px-4 py-3 text-sm text-[#4f6781]">{site.enabled ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3 text-right text-sm text-[#4f6781]">{formatInteger(site.billing_user_count ?? 0)}</td>
                        <td className="px-4 py-3 text-right text-sm text-[#123458]">{formatCurrency(bundlePricing.domainBase)}</td>
                        <td className="px-4 py-3 text-right text-sm text-[#123458]">{formatCurrency(bundlePricing.domainPlusRecording)}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-[#0e7c86]">{formatCurrency(bundlePricing.fullAiSuite)}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-[#123458]">{formatHours(site.transcription_hours)}</td>
                        <td className="px-4 py-3 text-right text-sm text-[#123458]">{formatHours(site.period_recording.recording_hours)}</td>
                        <td className="px-4 py-3 text-right text-sm text-[#123458]">{formatHours(site.current_storage.total_duration_hours)}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-[#0e7c86]">{formatCurrency(getSiteEstimatedBilling(site))}</td>
                      </tr>
                    )
                  })}
                  {data.sites.length === 0 && (
                    <tr>
                      <td colSpan={12} className="px-4 py-8 text-center text-sm text-[#4f6781]">
                        No sites found for this reseller.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && data?.scope === 'admin' && (
          <div className="mt-10 space-y-6">
            {data.resellers.length === 0 && (
              <div className="rounded-xl border border-[#d7e4ee] bg-white px-4 py-6 text-sm/6 text-[#4f6781]">
                No reseller usage rows found for this period.
              </div>
            )}
            {data.resellers.map((reseller) => {
              const resellerBundleTotals = getBundleTotalsForSites(reseller.sites)
              return (
                <div key={reseller.reseller_db_id} className="rounded-xl border border-[#d7e4ee] bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-base font-semibold text-[#0b1b2b]">Reseller {reseller.reseller_id}</p>
                    <p className="text-sm text-[#4f6781]">{reseller.sites.length} sites</p>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                    <div className="rounded-lg border border-[#e5eef5] bg-[#fbfdff] px-3 py-2">
                      <p className="text-xs font-semibold tracking-wide text-[#123458] uppercase">Subtotal Transcription</p>
                      <p className="text-sm font-semibold text-[#015596]">{formatHours(reseller.subtotal.transcription_hours)} hrs</p>
                      <p className="text-xs text-[#4f6781]">{formatCurrency(reseller.subtotal.estimated_transcription_cost)}</p>
                    </div>
                    <div className="rounded-lg border border-[#e5eef5] bg-[#fbfdff] px-3 py-2">
                      <p className="text-xs font-semibold tracking-wide text-[#123458] uppercase">Subtotal Recording</p>
                      <p className="text-sm font-semibold text-[#015596]">{formatHours(reseller.subtotal.period_recording.recording_hours)} hrs</p>
                      <p className="text-xs text-[#4f6781]">{formatCurrency(reseller.subtotal.period_recording.estimated_recording_cost)}</p>
                    </div>
                    <div className="rounded-lg border border-[#e5eef5] bg-[#fbfdff] px-3 py-2">
                      <p className="text-xs font-semibold tracking-wide text-[#123458] uppercase">Subtotal Storage</p>
                      <p className="text-sm font-semibold text-[#015596]">{formatHours(reseller.subtotal.current_storage.total_duration_hours)} hrs</p>
                      <p className="text-xs text-[#4f6781]">{formatCurrency(reseller.subtotal.current_storage.estimated_storage_cost)}</p>
                    </div>
                    <div className="rounded-lg border border-[#e5eef5] bg-[#fbfdff] px-3 py-2">
                      <p className="text-xs font-semibold tracking-wide text-[#123458] uppercase">Bundle Base</p>
                      <p className="text-sm font-semibold text-[#015596]">{formatCurrency(resellerBundleTotals.domainBase)}</p>
                    </div>
                    <div className="rounded-lg border border-[#e5eef5] bg-[#fbfdff] px-3 py-2">
                      <p className="text-xs font-semibold tracking-wide text-[#123458] uppercase">Bundle Base+Rec</p>
                      <p className="text-sm font-semibold text-[#015596]">{formatCurrency(resellerBundleTotals.domainPlusRecording)}</p>
                    </div>
                    <div className="rounded-lg border border-[#d9ece6] bg-[#f7fcfa] px-3 py-2">
                      <p className="text-xs font-semibold tracking-wide text-[#123458] uppercase">Bundle Full AI</p>
                      <p className="text-sm font-semibold text-[#0e7c86]">{formatCurrency(resellerBundleTotals.fullAiSuite)}</p>
                      <p className="text-xs text-[#4f6781]">
                        Usage-only subtotal: {formatCurrency(getAggregateEstimatedBilling(reseller.subtotal))}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 overflow-x-auto rounded-lg border border-[#e5eef5] bg-white">
                    <table className="min-w-full divide-y divide-[#e5eef5]">
                      <thead className="bg-[#f4f8fb]">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-[#123458] uppercase">Site ID</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-[#123458] uppercase">Site</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-[#123458] uppercase">Domain</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-[#123458] uppercase">Enabled</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Users</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Base $</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Base+Rec $</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Full AI $</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Transcription Hrs</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Period Rec Hrs</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Storage Hrs</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">Est Billing $</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eef4f8]">
                        {reseller.sites.map((site) => {
                          const bundlePricing = getSiteBundlePricing(site)
                          return (
                            <tr key={`${reseller.reseller_db_id}-${site.site_id}`}>
                              <td className="px-3 py-2 text-sm text-[#4f6781]">{site.site_id}</td>
                              <td className="px-3 py-2 text-sm text-[#0b1b2b]">{site.customer_name}</td>
                              <td className="px-3 py-2 text-sm text-[#0b1b2b]">{site.domain}</td>
                              <td className="px-3 py-2 text-sm text-[#4f6781]">{site.enabled ? 'Yes' : 'No'}</td>
                              <td className="px-3 py-2 text-right text-sm text-[#4f6781]">{formatInteger(site.billing_user_count ?? 0)}</td>
                              <td className="px-3 py-2 text-right text-sm text-[#123458]">{formatCurrency(bundlePricing.domainBase)}</td>
                              <td className="px-3 py-2 text-right text-sm text-[#123458]">{formatCurrency(bundlePricing.domainPlusRecording)}</td>
                              <td className="px-3 py-2 text-right text-sm font-semibold text-[#0e7c86]">{formatCurrency(bundlePricing.fullAiSuite)}</td>
                              <td className="px-3 py-2 text-right text-sm font-semibold text-[#123458]">{formatHours(site.transcription_hours)}</td>
                              <td className="px-3 py-2 text-right text-sm text-[#123458]">{formatHours(site.period_recording.recording_hours)}</td>
                              <td className="px-3 py-2 text-right text-sm text-[#123458]">{formatHours(site.current_storage.total_duration_hours)}</td>
                              <td className="px-3 py-2 text-right text-sm font-semibold text-[#0e7c86]">{formatCurrency(getSiteEstimatedBilling(site))}</td>
                            </tr>
                          )
                        })}
                        {reseller.sites.length === 0 && (
                          <tr>
                            <td colSpan={12} className="px-3 py-4 text-center text-sm text-[#4f6781]">
                              No sites for this reseller.
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-[#f8fbfe]">
                        <tr>
                          <td colSpan={8} className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-[#123458] uppercase">
                            Subtotal
                          </td>
                          <td className="px-3 py-2 text-right text-sm font-semibold text-[#123458]">
                            {formatHours(reseller.subtotal.transcription_hours)}
                          </td>
                          <td className="px-3 py-2 text-right text-sm font-semibold text-[#123458]">
                            {formatHours(reseller.subtotal.period_recording.recording_hours)}
                          </td>
                          <td className="px-3 py-2 text-right text-sm font-semibold text-[#123458]">
                            {formatHours(reseller.subtotal.current_storage.total_duration_hours)}
                          </td>
                          <td className="px-3 py-2 text-right text-sm font-semibold text-[#0e7c86]">
                            {formatCurrency(getAggregateEstimatedBilling(reseller.subtotal))}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && !data && !errorMessage && (
          <div className="mt-10 rounded-xl border border-[#d7e4ee] bg-white px-4 py-6 text-sm/6 text-[#4f6781]">
            No usage data available.
          </div>
        )}
          </div>
        )}

        {activeTab === 'pricing' && <ResellerPriceEstimatorSection embedded />}

        {activeTab === 'docs' && <ResellerPricingDocsSection embedded />}
      </Container>
    </section>
  )
}
