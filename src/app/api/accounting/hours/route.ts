import { getLoginType, getSessionToken, normalizeValue } from '@/lib/auth-session'
import { getRuntimeEnvValue } from '@/lib/runtime-env'
import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const DEFAULT_MYSQL_PORT = 3306
const BILLING_MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/
const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
const TRANSCRIPTION_TIERS: Array<{ cap: number; rate: number }> = [
  { cap: 1000, rate: 0.23 },
  { cap: 5000, rate: 0.21 },
  { cap: 10000, rate: 0.19 },
  { cap: Number.POSITIVE_INFINITY, rate: 0.17 },
]

type UsagePeriod = {
  type?: string
  billing_month?: string
  start_date?: string
  end_date?: string
}

type UsageAggregate = {
  transcription_seconds?: number
  transcription_hours?: number
  estimated_transcription_cost?: number
  period_recording?: {
    recording_seconds?: number
    recording_hours?: number
    estimated_recording_cost?: number
  }
  current_storage?: {
    total_recordings?: number
    total_duration_seconds?: number
    total_duration_hours?: number
    ave_daily_recordings?: number
    stats_last_updated?: string | null
    estimated_storage_cost?: number
  }
}

type UsageSite = {
  site_id?: number
  customer_name?: string
  display_name?: string
  domain?: string
  enabled?: boolean
  billing_user_count?: number
  transcription_seconds?: number
  transcription_hours?: number
  estimated_transcription_cost?: number
  period_recording?: {
    recording_seconds?: number
    recording_hours?: number
    estimated_recording_cost?: number
  }
  current_storage?: {
    total_recordings?: number
    total_duration_seconds?: number
    total_duration_hours?: number
    ave_daily_recordings?: number
    stats_last_updated?: string | null
    estimated_storage_cost?: number
  }
}

type UsageReseller = {
  reseller_id?: string
  reseller_db_id?: number
  subtotal?: UsageAggregate
  sites?: UsageSite[]
}

type NormalizedPeriod = {
  type: string
  billing_month: string | null
  start_date: string
  end_date: string
}

type NormalizedAggregate = {
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

type NormalizedSite = {
  site_id: number
  customer_name: string
  display_name: string
  domain: string
  enabled: boolean
  billing_user_count: number
  transcription_seconds: number
  transcription_hours: number
  estimated_transcription_cost: number
  period_recording: NormalizedAggregate['period_recording']
  current_storage: NormalizedAggregate['current_storage']
}

type NormalizedAdminReseller = {
  reseller_id: string
  reseller_db_id: number
  subtotal: NormalizedAggregate
  sites: NormalizedSite[]
}

type NormalizedAdminPayload = {
  scope: 'admin'
  period: NormalizedPeriod
  grand_total: NormalizedAggregate
  resellers: NormalizedAdminReseller[]
}

type NormalizedResellerPayload = {
  scope: 'reseller'
  period: NormalizedPeriod
  reseller_id: string
  total: NormalizedAggregate
  sites: NormalizedSite[]
}

type DbConfig = {
  host: string
  port: number
  user: string
  password: string
  database: string
}

type AiMonthlyUsage = {
  usage_seconds: number
  usage_hours_rounded: number
}

type AiMonthlyRow = RowDataPacket & {
  site_id: number
  usage_seconds: number
  usage_hours_rounded: number
}

type SiteUserCountRow = RowDataPacket & {
  site_id: number
  billing_user_count: number
}

let mysqlPool: Pool | null = null
let mysqlPoolKey = ''

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toFiniteNumber(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function toNullableString(value: unknown) {
  const normalized = normalizeValue(value)
  return normalized || null
}

function getUpstreamErrorMessage(payload: unknown) {
  if (!isRecord(payload)) return ''
  const message = normalizeValue(payload.message)
  if (message) return message
  return normalizeValue(payload.error)
}

function getApiUrl(baseUrl: string, path: string, queryString: string) {
  const trimmedBase = baseUrl.replace(/\/+$/, '')
  return `${trimmedBase}${path}${queryString}`
}

function roundToFour(value: number) {
  return Math.round((value + Number.EPSILON) * 10000) / 10000
}

function estimateTranscriptionCost(totalHours: number) {
  const hours = Math.max(0, totalHours)
  const tier = TRANSCRIPTION_TIERS.find((item) => hours <= item.cap) ?? TRANSCRIPTION_TIERS[TRANSCRIPTION_TIERS.length - 1]
  return roundToFour(hours * tier.rate)
}

function estimateStorageCost(totalHours: number) {
  const hours = Math.max(0, totalHours)
  if (hours <= 0) return 0
  const baseCost = 6
  const overflow = Math.max(0, hours - 2000)
  const overflowBlocks = Math.ceil(overflow / 500)
  return roundToFour(baseCost + overflowBlocks)
}

function normalizeBillingMonth(value: unknown) {
  const normalized = normalizeValue(value)
  return BILLING_MONTH_REGEX.test(normalized) ? normalized : ''
}

function normalizeDate(value: unknown) {
  const normalized = normalizeValue(value)
  return DATE_REGEX.test(normalized) ? normalized : ''
}

function getCurrentBillingMonth() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function buildMonthSeries(startDate: string, endDate: string) {
  const start = normalizeDate(startDate)
  const end = normalizeDate(endDate)
  if (!start || !end) return []

  const [startYearText, startMonthText] = start.slice(0, 7).split('-')
  const [endYearText, endMonthText] = end.slice(0, 7).split('-')
  let year = Number(startYearText)
  let month = Number(startMonthText)
  const endYear = Number(endYearText)
  const endMonth = Number(endMonthText)

  const startComparable = `${startYearText}-${startMonthText}`
  const endComparable = `${endYearText}-${endMonthText}`
  if (endComparable < startComparable) return []

  const months: string[] = []
  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push(`${year}-${String(month).padStart(2, '0')}`)
    month += 1
    if (month > 12) {
      month = 1
      year += 1
    }
  }
  return months
}

function buildQueryString(searchParams: URLSearchParams) {
  const outgoing = new URLSearchParams()
  const billingMonth = normalizeBillingMonth(searchParams.get('billing_month'))
  const startDate = normalizeValue(searchParams.get('start_date'))
  const endDate = normalizeValue(searchParams.get('end_date'))

  if (billingMonth) {
    outgoing.set('billing_month', billingMonth)
  } else {
    if (startDate) outgoing.set('start_date', startDate)
    if (endDate) outgoing.set('end_date', endDate)
  }

  const query = outgoing.toString()
  return query ? `?${query}` : ''
}

async function requestUsageData(baseUrl: string, path: string, loginType: string, token: string, queryString: string) {
  const response = await fetch(getApiUrl(baseUrl, path, queryString), {
    method: 'GET',
    headers: {
      login_type: loginType,
      token,
    },
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => null)
  return { response, payload }
}

function normalizePeriod(period: unknown): NormalizedPeriod {
  const p = isRecord(period) ? (period as UsagePeriod) : {}
  return {
    type: normalizeValue(p.type) || 'month',
    billing_month: normalizeBillingMonth(p.billing_month) || null,
    start_date: normalizeValue(p.start_date) || '',
    end_date: normalizeValue(p.end_date) || '',
  }
}

function normalizeAggregate(aggregate: unknown): NormalizedAggregate {
  const a = isRecord(aggregate) ? (aggregate as UsageAggregate) : {}
  const periodRecording = isRecord(a.period_recording) ? a.period_recording : {}
  const currentStorage = isRecord(a.current_storage) ? a.current_storage : {}

  return {
    transcription_seconds: toFiniteNumber(a.transcription_seconds),
    transcription_hours: toFiniteNumber(a.transcription_hours),
    estimated_transcription_cost: toFiniteNumber(a.estimated_transcription_cost),
    period_recording: {
      recording_seconds: toFiniteNumber(periodRecording.recording_seconds),
      recording_hours: toFiniteNumber(periodRecording.recording_hours),
      estimated_recording_cost: toFiniteNumber(periodRecording.estimated_recording_cost),
    },
    current_storage: {
      total_recordings: toFiniteNumber(currentStorage.total_recordings),
      total_duration_seconds: toFiniteNumber(currentStorage.total_duration_seconds),
      total_duration_hours: toFiniteNumber(currentStorage.total_duration_hours),
      ave_daily_recordings: toFiniteNumber(currentStorage.ave_daily_recordings),
      stats_last_updated: toNullableString(currentStorage.stats_last_updated),
      estimated_storage_cost: toFiniteNumber(currentStorage.estimated_storage_cost),
    },
  }
}

function normalizeSite(site: unknown): NormalizedSite {
  const s = isRecord(site) ? (site as UsageSite) : {}
  return {
    site_id: toFiniteNumber(s.site_id),
    customer_name: normalizeValue(s.customer_name) || 'Unknown Site',
    display_name: normalizeValue(s.display_name) || '',
    domain: normalizeValue(s.domain) || '-',
    enabled: Boolean(s.enabled),
    billing_user_count: toFiniteNumber(s.billing_user_count),
    transcription_seconds: toFiniteNumber(s.transcription_seconds),
    transcription_hours: toFiniteNumber(s.transcription_hours),
    estimated_transcription_cost: toFiniteNumber(s.estimated_transcription_cost),
    period_recording: normalizeAggregate({ period_recording: s.period_recording }).period_recording,
    current_storage: normalizeAggregate({ current_storage: s.current_storage }).current_storage,
  }
}

function normalizeAdminPayload(payload: unknown): NormalizedAdminPayload | null {
  if (!isRecord(payload)) return null

  const resellersRaw = Array.isArray(payload.resellers) ? (payload.resellers as UsageReseller[]) : []
  return {
    scope: 'admin' as const,
    period: normalizePeriod(payload.period),
    grand_total: normalizeAggregate(payload.grand_total),
    resellers: resellersRaw
      .map((reseller) => ({
        reseller_id: normalizeValue(reseller.reseller_id) || 'Unknown Reseller',
        reseller_db_id: toFiniteNumber(reseller.reseller_db_id),
        subtotal: normalizeAggregate(reseller.subtotal),
        sites: (Array.isArray(reseller.sites) ? reseller.sites : []).map((site) => normalizeSite(site)),
      }))
      .sort((a, b) => a.reseller_id.localeCompare(b.reseller_id)),
  }
}

function normalizeResellerPayload(payload: unknown): NormalizedResellerPayload | null {
  if (!isRecord(payload)) return null

  return {
    scope: 'reseller' as const,
    period: normalizePeriod(payload.period),
    reseller_id: normalizeValue(payload.reseller_id) || 'Reseller',
    total: normalizeAggregate(payload.total),
    sites: (Array.isArray(payload.sites) ? payload.sites : []).map((site) => normalizeSite(site)),
  }
}

function cloneSite(site: NormalizedSite): NormalizedSite {
  return {
    ...site,
    period_recording: { ...site.period_recording },
    current_storage: { ...site.current_storage },
  }
}

function updateDerivedCosts(site: NormalizedSite) {
  site.transcription_hours = roundToFour(site.transcription_hours)
  site.estimated_transcription_cost = estimateTranscriptionCost(site.transcription_hours)
  site.period_recording.recording_hours = roundToFour(site.period_recording.recording_hours)
  site.period_recording.estimated_recording_cost = estimateStorageCost(site.period_recording.recording_hours)
  site.current_storage.total_duration_hours = roundToFour(site.current_storage.total_duration_hours)
  site.current_storage.estimated_storage_cost = estimateStorageCost(site.current_storage.total_duration_hours)
}

function mergeSiteAcrossMonths(target: NormalizedSite, source: NormalizedSite) {
  target.customer_name = source.customer_name || target.customer_name
  target.display_name = source.display_name || target.display_name
  target.domain = source.domain || target.domain
  target.enabled = source.enabled

  target.transcription_seconds += source.transcription_seconds
  target.transcription_hours += source.transcription_hours

  target.period_recording.recording_seconds += source.period_recording.recording_seconds
  target.period_recording.recording_hours += source.period_recording.recording_hours

  target.current_storage = { ...source.current_storage }
  updateDerivedCosts(target)
}

function aggregateFromSites(sites: NormalizedSite[]): NormalizedAggregate {
  const transcriptionSeconds = sites.reduce((sum, site) => sum + site.transcription_seconds, 0)
  const transcriptionHours = roundToFour(sites.reduce((sum, site) => sum + site.transcription_hours, 0))
  const recordingSeconds = sites.reduce((sum, site) => sum + site.period_recording.recording_seconds, 0)
  const recordingHours = roundToFour(sites.reduce((sum, site) => sum + site.period_recording.recording_hours, 0))
  const storageRecordings = sites.reduce((sum, site) => sum + site.current_storage.total_recordings, 0)
  const storageSeconds = sites.reduce((sum, site) => sum + site.current_storage.total_duration_seconds, 0)
  const storageHours = roundToFour(sites.reduce((sum, site) => sum + site.current_storage.total_duration_hours, 0))

  return {
    transcription_seconds: transcriptionSeconds,
    transcription_hours: transcriptionHours,
    estimated_transcription_cost: estimateTranscriptionCost(transcriptionHours),
    period_recording: {
      recording_seconds: recordingSeconds,
      recording_hours: recordingHours,
      estimated_recording_cost: estimateStorageCost(recordingHours),
    },
    current_storage: {
      total_recordings: storageRecordings,
      total_duration_seconds: storageSeconds,
      total_duration_hours: storageHours,
      ave_daily_recordings: 0,
      stats_last_updated: null,
      estimated_storage_cost: estimateStorageCost(storageHours),
    },
  }
}

function mergeAdminPayloadsForRange(monthlyPayloads: NormalizedAdminPayload[], startDate: string, endDate: string) {
  const resellerMap = new Map<string, { reseller_id: string; reseller_db_id: number; sites: Map<number, NormalizedSite> }>()

  for (const payload of monthlyPayloads) {
    for (const reseller of payload.resellers) {
      const key = `${reseller.reseller_id}::${reseller.reseller_db_id}`
      if (!resellerMap.has(key)) {
        resellerMap.set(key, {
          reseller_id: reseller.reseller_id,
          reseller_db_id: reseller.reseller_db_id,
          sites: new Map<number, NormalizedSite>(),
        })
      }
      const accumulator = resellerMap.get(key)!

      for (const site of reseller.sites) {
        const existing = accumulator.sites.get(site.site_id)
        if (!existing) {
          accumulator.sites.set(site.site_id, cloneSite(site))
          continue
        }
        mergeSiteAcrossMonths(existing, site)
      }
    }
  }

  const resellers = Array.from(resellerMap.values())
    .map((reseller) => {
      const sites = Array.from(reseller.sites.values()).sort((a, b) => a.customer_name.localeCompare(b.customer_name))
      return {
        reseller_id: reseller.reseller_id,
        reseller_db_id: reseller.reseller_db_id,
        subtotal: aggregateFromSites(sites),
        sites,
      }
    })
    .sort((a, b) => a.reseller_id.localeCompare(b.reseller_id))

  const grandSites = resellers.flatMap((reseller) => reseller.sites)

  return {
    scope: 'admin' as const,
    period: {
      type: 'range',
      billing_month: null,
      start_date: startDate,
      end_date: endDate,
    },
    grand_total: aggregateFromSites(grandSites),
    resellers,
  }
}

function mergeResellerPayloadsForRange(monthlyPayloads: NormalizedResellerPayload[], startDate: string, endDate: string) {
  const first = monthlyPayloads[0]
  const siteMap = new Map<number, NormalizedSite>()

  for (const payload of monthlyPayloads) {
    for (const site of payload.sites) {
      const existing = siteMap.get(site.site_id)
      if (!existing) {
        siteMap.set(site.site_id, cloneSite(site))
        continue
      }
      mergeSiteAcrossMonths(existing, site)
    }
  }

  const sites = Array.from(siteMap.values()).sort((a, b) => a.customer_name.localeCompare(b.customer_name))
  return {
    scope: 'reseller' as const,
    period: {
      type: 'range',
      billing_month: null,
      start_date: startDate,
      end_date: endDate,
    },
    reseller_id: first.reseller_id,
    total: aggregateFromSites(sites),
    sites,
  }
}

function parseDbString(rawValue: string) {
  const raw = normalizeValue(rawValue)
  if (!raw) return null

  const withoutScheme = raw.replace(/^[a-z]+:\/\//i, '')
  const match = withoutScheme.match(/^([^:]+):([^@]*)@([^:/?#]+)(?::(\d+))?\/([^/?#]+)$/)
  if (!match) return null

  return {
    user: normalizeValue(match[1]),
    password: match[2] ?? '',
    host: normalizeValue(match[3]),
    port: toFiniteNumber(match[4]) || DEFAULT_MYSQL_PORT,
    database: normalizeValue(match[5]),
  }
}

async function getDbConfig(): Promise<DbConfig | null> {
  const [hostValue, portValue, userValue, passwordValue, databaseValue, dbStringValue] = await Promise.all([
    getRuntimeEnvValue('DB_HOST'),
    getRuntimeEnvValue('DB_PORT'),
    getRuntimeEnvValue('DB_USER'),
    getRuntimeEnvValue('DB_PASS'),
    getRuntimeEnvValue('DB_NAME'),
    getRuntimeEnvValue('DB_STRING'),
  ])

  const dbFromString = parseDbString(dbStringValue)
  const host = normalizeValue(hostValue) || dbFromString?.host || ''
  const user = normalizeValue(userValue) || dbFromString?.user || ''
  const password = normalizeValue(passwordValue) || dbFromString?.password || ''
  const database = normalizeValue(databaseValue) || dbFromString?.database || ''
  const port = toFiniteNumber(portValue) || dbFromString?.port || DEFAULT_MYSQL_PORT

  if (!host || !user || !database) return null
  return { host, port, user, password, database }
}

function getMysqlPool(config: DbConfig) {
  const key = `${config.host}|${config.port}|${config.user}|${config.database}`
  if (mysqlPool && mysqlPoolKey === key) return mysqlPool

  mysqlPool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 5,
    namedPlaceholders: false,
  })
  mysqlPoolKey = key
  return mysqlPool
}

async function fetchAiMonthlyUsageBySite(siteIds: number[], billingMonth: string): Promise<Map<number, AiMonthlyUsage> | null> {
  const month = normalizeBillingMonth(billingMonth)
  if (!month) return null

  const uniqueSiteIds = Array.from(new Set(siteIds.filter((siteId) => Number.isFinite(siteId) && siteId > 0)))
  if (uniqueSiteIds.length === 0) return new Map()

  const config = await getDbConfig()
  if (!config) return null

  const placeholders = uniqueSiteIds.map(() => '?').join(',')
  const sql = `
    SELECT
      site_id,
      COALESCE(SUM(usage_seconds), 0) AS usage_seconds,
      COALESCE(SUM(usage_hours_rounded), 0) AS usage_hours_rounded
    FROM ai_analytics_usage_monthly
    WHERE \`year_month\` = ?
      AND site_id IN (${placeholders})
    GROUP BY site_id
  `

  try {
    const pool = getMysqlPool(config)
    const [rows] = await pool.query<AiMonthlyRow[]>(sql, [month, ...uniqueSiteIds])
    const usageBySite = new Map<number, AiMonthlyUsage>()
    for (const row of rows) {
      usageBySite.set(toFiniteNumber(row.site_id), {
        usage_seconds: toFiniteNumber(row.usage_seconds),
        usage_hours_rounded: roundToFour(toFiniteNumber(row.usage_hours_rounded)),
      })
    }
    return usageBySite
  } catch {
    return null
  }
}

async function fetchSiteUserCounts(siteIds: number[]): Promise<Map<number, number> | null> {
  const uniqueSiteIds = Array.from(new Set(siteIds.filter((siteId) => Number.isFinite(siteId) && siteId > 0)))
  if (uniqueSiteIds.length === 0) return new Map()

  const config = await getDbConfig()
  if (!config) return null

  const placeholders = uniqueSiteIds.map(() => '?').join(',')
  const sql = `
    SELECT
      id AS site_id,
      COALESCE(NULLIF(ai_license_count, 0), NULLIF(extension_limit, 0), NULLIF(real_time_licenses, 0), 0) AS billing_user_count
    FROM site
    WHERE id IN (${placeholders})
  `

  try {
    const pool = getMysqlPool(config)
    const [rows] = await pool.query<SiteUserCountRow[]>(sql, uniqueSiteIds)
    const counts = new Map<number, number>()
    for (const row of rows) {
      counts.set(toFiniteNumber(row.site_id), Math.max(0, toFiniteNumber(row.billing_user_count)))
    }
    return counts
  } catch {
    return null
  }
}

function mergeAiUsageIntoSite(site: NormalizedSite, usageBySite: Map<number, AiMonthlyUsage>) {
  const usage = usageBySite.get(site.site_id)
  const hours = roundToFour(usage?.usage_hours_rounded ?? 0)
  const seconds = usage?.usage_seconds ?? Math.round(hours * 3600)

  return {
    ...site,
    transcription_hours: hours,
    transcription_seconds: seconds,
    estimated_transcription_cost: estimateTranscriptionCost(hours),
  }
}

function summarizeTranscription(sites: NormalizedSite[]) {
  const seconds = sites.reduce((sum, site) => sum + site.transcription_seconds, 0)
  const hours = roundToFour(sites.reduce((sum, site) => sum + site.transcription_hours, 0))
  return {
    transcription_seconds: seconds,
    transcription_hours: hours,
    estimated_transcription_cost: estimateTranscriptionCost(hours),
  }
}

function applyAiMonthlyToAdminPayload(payload: NormalizedAdminPayload, usageBySite: Map<number, AiMonthlyUsage>) {
  const resellers = payload.resellers.map((reseller) => {
    const sites = reseller.sites.map((site) => mergeAiUsageIntoSite(site, usageBySite))
    const transcription = summarizeTranscription(sites)

    return {
      ...reseller,
      sites,
      subtotal: {
        ...reseller.subtotal,
        ...transcription,
      },
    }
  })

  const allSites = resellers.flatMap((reseller) => reseller.sites)
  const grandTranscription = summarizeTranscription(allSites)

  return {
    ...payload,
    resellers,
    grand_total: {
      ...payload.grand_total,
      ...grandTranscription,
    },
  }
}

function applyAiMonthlyToResellerPayload(payload: NormalizedResellerPayload, usageBySite: Map<number, AiMonthlyUsage>) {
  const sites = payload.sites.map((site) => mergeAiUsageIntoSite(site, usageBySite))
  const transcription = summarizeTranscription(sites)
  return {
    ...payload,
    sites,
    total: {
      ...payload.total,
      ...transcription,
    },
  }
}

function applyUserCountsToAdminPayload(payload: NormalizedAdminPayload, userCountsBySite: Map<number, number>) {
  return {
    ...payload,
    resellers: payload.resellers.map((reseller) => ({
      ...reseller,
      sites: reseller.sites.map((site) => ({
        ...site,
        billing_user_count: userCountsBySite.get(site.site_id) ?? site.billing_user_count,
      })),
    })),
  }
}

function applyUserCountsToResellerPayload(payload: NormalizedResellerPayload, userCountsBySite: Map<number, number>) {
  return {
    ...payload,
    sites: payload.sites.map((site) => ({
      ...site,
      billing_user_count: userCountsBySite.get(site.site_id) ?? site.billing_user_count,
    })),
  }
}

export async function GET(request: NextRequest) {
  const token = getSessionToken(request)
  if (!token) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const loginType = getLoginType(request)
  const loganApiBase = normalizeValue(await getRuntimeEnvValue('LOGAN_API_URL'))

  if (!loganApiBase) {
    return NextResponse.json({ error: 'LOGAN_API_URL is not configured.' }, { status: 500 })
  }

  const queryString = buildQueryString(request.nextUrl.searchParams)
  const requestedBillingMonth = normalizeBillingMonth(request.nextUrl.searchParams.get('billing_month'))
  const requestedStartDate = normalizeDate(request.nextUrl.searchParams.get('start_date'))
  const requestedEndDate = normalizeDate(request.nextUrl.searchParams.get('end_date'))
  const requestedRangeMonths =
    !requestedBillingMonth && requestedStartDate && requestedEndDate
      ? buildMonthSeries(requestedStartDate, requestedEndDate)
      : []

  let adminResult: { response: Response; payload: unknown } | null = null
  try {
    adminResult = await requestUsageData(loganApiBase, '/reseller/admin/usage', loginType, token, queryString)
  } catch {
    return NextResponse.json({ error: 'Unable to reach reseller usage service.' }, { status: 502 })
  }

  if (adminResult.response.ok) {
    const normalized = normalizeAdminPayload(adminResult.payload)
    if (!normalized) {
      return NextResponse.json({ error: 'Unexpected admin usage response.' }, { status: 502 })
    }

    const billingMonth = requestedBillingMonth || normalizeBillingMonth(normalized.period.billing_month) || getCurrentBillingMonth()
    const siteIds = normalized.resellers.flatMap((reseller) => reseller.sites.map((site) => site.site_id))
    const usageBySite = await fetchAiMonthlyUsageBySite(siteIds, billingMonth)
    if (usageBySite === null) {
      return NextResponse.json(
        {
          error:
            'AI monthly usage source unavailable. Ensure DB_HOST/DB_PORT/DB_USER/DB_PASS/DB_NAME are configured and reachable from Next.js.',
        },
        { status: 502 },
      )
    }
    const responsePayload = applyAiMonthlyToAdminPayload(normalized, usageBySite)
    const userCountsBySite = await fetchSiteUserCounts(siteIds)
    const withUserCounts = userCountsBySite ? applyUserCountsToAdminPayload(responsePayload, userCountsBySite) : responsePayload
    return NextResponse.json(withUserCounts, { status: 200 })
  }

  if (adminResult.response.status === 401) {
    const message = getUpstreamErrorMessage(adminResult.payload) || 'Authentication failed.'
    return NextResponse.json({ error: message }, { status: 401 })
  }

  if (requestedRangeMonths.length > 0) {
    const monthlyPayloads: NormalizedResellerPayload[] = []

    for (const month of requestedRangeMonths) {
      let monthResult: { response: Response; payload: unknown } | null = null
      try {
        monthResult = await requestUsageData(loganApiBase, '/reseller/usage', loginType, token, `?billing_month=${month}`)
      } catch {
        return NextResponse.json({ error: 'Unable to reach reseller usage service.' }, { status: 502 })
      }

      if (!monthResult.response.ok) {
        if (monthResult.response.status === 404) {
          return NextResponse.json(
            {
              error:
                'Reseller usage endpoints are not available on LOGAN_API_URL yet. Confirm /reseller/usage and /reseller/admin/usage are registered in api_main.py.',
            },
            { status: 502 },
          )
        }

        const monthMessage = getUpstreamErrorMessage(monthResult.payload) || 'Unable to load reseller usage data.'
        const monthStatus =
          monthResult.response.status >= 400 && monthResult.response.status !== 404 ? monthResult.response.status : 502
        return NextResponse.json({ error: monthMessage }, { status: monthStatus })
      }

      const monthPayload = normalizeResellerPayload(monthResult.payload)
      if (!monthPayload) {
        return NextResponse.json({ error: 'Unexpected reseller usage response.' }, { status: 502 })
      }

      const usageBySite = await fetchAiMonthlyUsageBySite(
        monthPayload.sites.map((site) => site.site_id),
        month,
      )
      if (usageBySite === null) {
        return NextResponse.json(
          {
            error:
              'AI monthly usage source unavailable. Ensure DB_HOST/DB_PORT/DB_USER/DB_PASS/DB_NAME are configured and reachable from Next.js.',
          },
          { status: 502 },
        )
      }

      monthlyPayloads.push(applyAiMonthlyToResellerPayload(monthPayload, usageBySite))
    }

    if (monthlyPayloads.length > 0) {
      const mergedPayload = mergeResellerPayloadsForRange(monthlyPayloads, requestedStartDate, requestedEndDate)
      const mergedSiteIds = mergedPayload.sites.map((site) => site.site_id)
      const userCountsBySite = await fetchSiteUserCounts(mergedSiteIds)
      const withUserCounts = userCountsBySite ? applyUserCountsToResellerPayload(mergedPayload, userCountsBySite) : mergedPayload
      return NextResponse.json(withUserCounts, { status: 200 })
    }
  }

  let resellerResult: { response: Response; payload: unknown } | null = null
  try {
    resellerResult = await requestUsageData(loganApiBase, '/reseller/usage', loginType, token, queryString)
  } catch {
    return NextResponse.json({ error: 'Unable to reach reseller usage service.' }, { status: 502 })
  }

  if (resellerResult.response.ok) {
    const normalized = normalizeResellerPayload(resellerResult.payload)
    if (!normalized) {
      return NextResponse.json({ error: 'Unexpected reseller usage response.' }, { status: 502 })
    }

    const billingMonth = requestedBillingMonth || normalizeBillingMonth(normalized.period.billing_month) || getCurrentBillingMonth()
    const siteIds = normalized.sites.map((site) => site.site_id)
    const usageBySite = await fetchAiMonthlyUsageBySite(siteIds, billingMonth)
    if (usageBySite === null) {
      return NextResponse.json(
        {
          error:
            'AI monthly usage source unavailable. Ensure DB_HOST/DB_PORT/DB_USER/DB_PASS/DB_NAME are configured and reachable from Next.js.',
        },
        { status: 502 },
      )
    }
    const responsePayload = applyAiMonthlyToResellerPayload(normalized, usageBySite)
    const userCountsBySite = await fetchSiteUserCounts(siteIds)
    const withUserCounts = userCountsBySite ? applyUserCountsToResellerPayload(responsePayload, userCountsBySite) : responsePayload
    return NextResponse.json(withUserCounts, { status: 200 })
  }

  if (resellerResult.response.status === 404) {
    return NextResponse.json(
      {
        error:
          'Reseller usage endpoints are not available on LOGAN_API_URL yet. Confirm /reseller/usage and /reseller/admin/usage are registered in api_main.py.',
      },
      { status: 502 },
    )
  }

  const message = getUpstreamErrorMessage(resellerResult.payload) || 'Unable to load usage data.'
  const status = resellerResult.response.status >= 400 && resellerResult.response.status !== 404 ? resellerResult.response.status : 502
  return NextResponse.json({ error: message }, { status })
}
