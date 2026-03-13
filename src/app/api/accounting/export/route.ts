import { normalizeValue } from '@/lib/auth-session'
import { estimateSiteBundleCosts } from '@/lib/cloudsweet-pricing'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

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

type ExportFormat = 'excel' | 'pdf'

type ExportRow = {
  row_type: string
  scope: 'admin' | 'reseller'
  billing_month: string
  period_start: string
  period_end: string
  reseller_id: string
  site_id: string
  billing_user_count: string
  site_name: string
  domain: string
  enabled: string
  bundle_domain_base_usd: string
  bundle_domain_plus_recording_usd: string
  bundle_full_ai_suite_usd: string
  transcription_hours: string
  transcription_seconds: string
  transcription_cost_usd: string
  period_recording_hours: string
  period_recording_seconds: string
  period_recording_cost_usd: string
  storage_hours: string
  storage_seconds: string
  storage_cost_usd: string
  total_recordings: string
}

const BILLING_MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/

function toNumber(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeBillingMonth(value: unknown) {
  const normalized = normalizeValue(value)
  return BILLING_MONTH_REGEX.test(normalized) ? normalized : ''
}

function formatHours(value: number) {
  return toNumber(value).toFixed(2)
}

function formatMoney(value: number) {
  return toNumber(value).toFixed(2)
}

function formatInteger(value: number) {
  return Math.trunc(toNumber(value)).toString()
}

function sanitizeFilenamePart(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, '_')
}

function parseFormat(value: unknown): ExportFormat {
  const normalized = normalizeValue(value).toLowerCase()
  if (normalized === 'pdf') return 'pdf'
  return 'excel'
}

function getDisplayBillingMonth(period: UsagePeriod) {
  const fromPayload = normalizeBillingMonth(period.billing_month)
  if (fromPayload) return fromPayload
  const start = normalizeValue(period.start_date)
  if (start.length >= 7) {
    const maybeMonth = start.slice(0, 7)
    if (BILLING_MONTH_REGEX.test(maybeMonth)) return maybeMonth
  }
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function isUsagePayload(value: unknown): value is UsagePayload {
  if (!value || typeof value !== 'object') return false
  const candidate = value as { scope?: unknown; period?: unknown }
  if (candidate.scope !== 'admin' && candidate.scope !== 'reseller') return false
  return typeof candidate.period === 'object' && candidate.period !== null
}

function pushSiteRow(rows: ExportRow[], payload: UsagePayload, resellerId: string, site: UsageSite) {
  const bundlePricing = estimateSiteBundleCosts({
    users: toNumber(site.billing_user_count),
    transcriptionHours: site.transcription_hours,
    storageHours: site.current_storage.total_duration_hours,
  })

  rows.push({
    row_type: 'Site',
    scope: payload.scope,
    billing_month: getDisplayBillingMonth(payload.period),
    period_start: payload.period.start_date,
    period_end: payload.period.end_date,
    reseller_id: resellerId,
    site_id: formatInteger(site.site_id),
    billing_user_count: formatInteger(toNumber(site.billing_user_count)),
    site_name: normalizeValue(site.customer_name),
    domain: normalizeValue(site.domain),
    enabled: site.enabled ? 'Yes' : 'No',
    bundle_domain_base_usd: formatMoney(bundlePricing.domainBase),
    bundle_domain_plus_recording_usd: formatMoney(bundlePricing.domainPlusRecording),
    bundle_full_ai_suite_usd: formatMoney(bundlePricing.fullAiSuite),
    transcription_hours: formatHours(site.transcription_hours),
    transcription_seconds: formatInteger(site.transcription_seconds),
    transcription_cost_usd: formatMoney(site.estimated_transcription_cost),
    period_recording_hours: formatHours(site.period_recording.recording_hours),
    period_recording_seconds: formatInteger(site.period_recording.recording_seconds),
    period_recording_cost_usd: formatMoney(site.period_recording.estimated_recording_cost),
    storage_hours: formatHours(site.current_storage.total_duration_hours),
    storage_seconds: formatInteger(site.current_storage.total_duration_seconds),
    storage_cost_usd: formatMoney(site.current_storage.estimated_storage_cost),
    total_recordings: formatInteger(site.current_storage.total_recordings),
  })
}

function pushAggregateRow(
  rows: ExportRow[],
  payload: UsagePayload,
  rowType: 'Subtotal' | 'Grand Total' | 'Reseller Total',
  resellerId: string,
  aggregate: UsageAggregate,
) {
  rows.push({
    row_type: rowType,
    scope: payload.scope,
    billing_month: getDisplayBillingMonth(payload.period),
    period_start: payload.period.start_date,
    period_end: payload.period.end_date,
    reseller_id: resellerId,
    site_id: '',
    billing_user_count: '',
    site_name: '',
    domain: '',
    enabled: '',
    bundle_domain_base_usd: '',
    bundle_domain_plus_recording_usd: '',
    bundle_full_ai_suite_usd: '',
    transcription_hours: formatHours(aggregate.transcription_hours),
    transcription_seconds: formatInteger(aggregate.transcription_seconds),
    transcription_cost_usd: formatMoney(aggregate.estimated_transcription_cost),
    period_recording_hours: formatHours(aggregate.period_recording.recording_hours),
    period_recording_seconds: formatInteger(aggregate.period_recording.recording_seconds),
    period_recording_cost_usd: formatMoney(aggregate.period_recording.estimated_recording_cost),
    storage_hours: formatHours(aggregate.current_storage.total_duration_hours),
    storage_seconds: formatInteger(aggregate.current_storage.total_duration_seconds),
    storage_cost_usd: formatMoney(aggregate.current_storage.estimated_storage_cost),
    total_recordings: formatInteger(aggregate.current_storage.total_recordings),
  })
}

function buildExportRows(payload: UsagePayload) {
  const rows: ExportRow[] = []

  if (payload.scope === 'admin') {
    for (const reseller of payload.resellers) {
      for (const site of reseller.sites) {
        pushSiteRow(rows, payload, reseller.reseller_id, site)
      }
      pushAggregateRow(rows, payload, 'Subtotal', reseller.reseller_id, reseller.subtotal)
    }
    pushAggregateRow(rows, payload, 'Grand Total', 'ALL', payload.grand_total)
    return rows
  }

  for (const site of payload.sites) {
    pushSiteRow(rows, payload, payload.reseller_id, site)
  }
  pushAggregateRow(rows, payload, 'Reseller Total', payload.reseller_id, payload.total)
  return rows
}

function csvEscape(value: string) {
  const normalized = normalizeValue(value)
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`
  }
  return normalized
}

function buildCsv(rows: ExportRow[]) {
  const headers: Array<keyof ExportRow> = [
    'row_type',
    'scope',
    'billing_month',
    'period_start',
    'period_end',
    'reseller_id',
    'site_id',
    'billing_user_count',
    'site_name',
    'domain',
    'enabled',
    'bundle_domain_base_usd',
    'bundle_domain_plus_recording_usd',
    'bundle_full_ai_suite_usd',
    'transcription_hours',
    'transcription_seconds',
    'transcription_cost_usd',
    'period_recording_hours',
    'period_recording_seconds',
    'period_recording_cost_usd',
    'storage_hours',
    'storage_seconds',
    'storage_cost_usd',
    'total_recordings',
  ]

  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(','))
  }
  return `${lines.join('\n')}\n`
}

function pdfEscape(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, '?')
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value
  if (maxLength <= 1) return value.slice(0, maxLength)
  return `${value.slice(0, maxLength - 1)}…`
}

function buildPdfLines(payload: UsagePayload, rows: ExportRow[]) {
  const lines: string[] = []
  const period = payload.period
  lines.push('CloudSWEET Usage Hours Export')
  lines.push(`Scope: ${payload.scope === 'admin' ? 'Admin' : 'Reseller'}`)
  lines.push(`Billing Month: ${getDisplayBillingMonth(period)}`)
  lines.push(`Period: ${period.start_date} to ${period.end_date}`)
  lines.push('')
  lines.push('Columns: RowType | Reseller | SiteID | Users | Site | Domain | FullAI$ | TransHrs | RecHrs | StorageHrs')
  lines.push('')

  for (const row of rows) {
    lines.push(
      [
        truncate(row.row_type, 13).padEnd(13),
        truncate(row.reseller_id || '-', 10).padEnd(10),
        truncate(row.site_id || '-', 6).padEnd(6),
        truncate(row.billing_user_count || '-', 5).padEnd(5),
        truncate(row.site_name || '-', 20).padEnd(20),
        truncate(row.domain || '-', 16).padEnd(16),
        row.bundle_full_ai_suite_usd.padStart(8),
        row.transcription_hours.padStart(8),
        row.period_recording_hours.padStart(8),
        row.storage_hours.padStart(9),
      ].join(' | '),
    )
  }

  return lines
}

function buildPdfPages(lines: string[]) {
  const linesPerPage = 48
  const pages: string[] = []

  for (let i = 0; i < lines.length; i += linesPerPage) {
    const pageLines = lines.slice(i, i + linesPerPage)
    const commands = ['BT', '/F1 9 Tf', '13 TL', '40 760 Td']

    for (const line of pageLines) {
      commands.push(`(${pdfEscape(line)}) Tj`)
      commands.push('T*')
    }

    commands.push('ET')
    pages.push(commands.join('\n'))
  }

  return pages.length > 0 ? pages : ['BT\n/F1 10 Tf\n40 760 Td\n(No data) Tj\nET']
}

function buildPdfBinary(contentPages: string[]) {
  const objectMap: Record<number, string> = {}
  const pageCount = contentPages.length

  objectMap[1] = '<< /Type /Catalog /Pages 2 0 R >>'

  const pageObjectIds: number[] = []
  const firstPageObjectId = 4
  for (let i = 0; i < pageCount; i += 1) {
    pageObjectIds.push(firstPageObjectId + i * 2)
  }

  objectMap[2] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageCount} >>`
  objectMap[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>'

  for (let i = 0; i < pageCount; i += 1) {
    const pageId = firstPageObjectId + i * 2
    const contentId = pageId + 1
    const stream = contentPages[i]
    const length = Buffer.byteLength(stream, 'utf8')

    objectMap[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`
    objectMap[contentId] = `<< /Length ${length} >>\nstream\n${stream}\nendstream`
  }

  const maxObjectId = Math.max(...Object.keys(objectMap).map((value) => Number(value)))

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = [0]

  for (let objectId = 1; objectId <= maxObjectId; objectId += 1) {
    const body = objectMap[objectId]
    offsets[objectId] = Buffer.byteLength(pdf, 'utf8')
    pdf += `${objectId} 0 obj\n${body}\nendobj\n`
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf8')
  pdf += `xref\n0 ${maxObjectId + 1}\n`
  pdf += '0000000000 65535 f \n'

  for (let objectId = 1; objectId <= maxObjectId; objectId += 1) {
    pdf += `${String(offsets[objectId]).padStart(10, '0')} 00000 n \n`
  }

  pdf += `trailer\n<< /Size ${maxObjectId + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return Buffer.from(pdf, 'utf8')
}

async function fetchUsagePayload(request: NextRequest) {
  const url = new URL('/api/accounting/hours', request.url)

  const billingMonth = normalizeBillingMonth(request.nextUrl.searchParams.get('billing_month'))
  const startDate = normalizeValue(request.nextUrl.searchParams.get('start_date'))
  const endDate = normalizeValue(request.nextUrl.searchParams.get('end_date'))

  if (billingMonth) {
    url.searchParams.set('billing_month', billingMonth)
  } else {
    if (startDate) url.searchParams.set('start_date', startDate)
    if (endDate) url.searchParams.set('end_date', endDate)
  }

  const upstreamResponse = await fetch(url, {
    method: 'GET',
    headers: {
      cookie: request.headers.get('cookie') ?? '',
    },
    cache: 'no-store',
  })

  const payload = await upstreamResponse.json().catch(() => null)
  return { upstreamResponse, payload }
}

export async function GET(request: NextRequest) {
  const format = parseFormat(request.nextUrl.searchParams.get('format'))

  const { upstreamResponse, payload } = await fetchUsagePayload(request)
  if (!upstreamResponse.ok) {
    const status = upstreamResponse.status >= 400 ? upstreamResponse.status : 502
    return NextResponse.json(payload ?? { error: 'Unable to load usage data for export.' }, { status })
  }

  if (!isUsagePayload(payload)) {
    return NextResponse.json({ error: 'Unexpected usage export payload.' }, { status: 502 })
  }

  const rows = buildExportRows(payload)
  const billingMonth = sanitizeFilenamePart(getDisplayBillingMonth(payload.period))

  if (format === 'pdf') {
    const lines = buildPdfLines(payload, rows)
    const pages = buildPdfPages(lines)
    const pdfBinary = buildPdfBinary(pages)
    const fileName = `usage-hours-${payload.scope}-${billingMonth}.pdf`

    return new NextResponse(pdfBinary, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    })
  }

  const csv = buildCsv(rows)
  const fileName = `usage-hours-${payload.scope}-${billingMonth}.csv`
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-store',
    },
  })
}
