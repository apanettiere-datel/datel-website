export type DomainUserTier = {
  label: string
  minUsers: number
  maxUsers: number
  reportingProduct: string
  reportingPartnerMonthly: number
  reportingListMonthly: number
  recordingProduct: string
  recordingPartnerMonthly: number
  recordingListMonthly: number
}

export type TranscriptionTier = {
  maxHours: number
  rate: number
  label: string
}

export const DOMAIN_USER_TIERS: DomainUserTier[] = [
  {
    label: '1 to 20 users',
    minUsers: 1,
    maxUsers: 20,
    reportingProduct: 'H4001',
    reportingPartnerMonthly: 10,
    reportingListMonthly: 20,
    recordingProduct: 'H4001CRE',
    recordingPartnerMonthly: 5,
    recordingListMonthly: 10,
  },
  {
    label: '21 to 50 users',
    minUsers: 21,
    maxUsers: 50,
    reportingProduct: 'H4002',
    reportingPartnerMonthly: 15,
    reportingListMonthly: 30,
    recordingProduct: 'H4002CRE',
    recordingPartnerMonthly: 7,
    recordingListMonthly: 14,
  },
  {
    label: '51 to 100 users',
    minUsers: 51,
    maxUsers: 100,
    reportingProduct: 'H4003',
    reportingPartnerMonthly: 25,
    reportingListMonthly: 50,
    recordingProduct: 'H4003CRE',
    recordingPartnerMonthly: 10,
    recordingListMonthly: 20,
  },
  {
    label: '101 to 200 users',
    minUsers: 101,
    maxUsers: 200,
    reportingProduct: 'H4004',
    reportingPartnerMonthly: 45,
    reportingListMonthly: 90,
    recordingProduct: 'H4004CRE',
    recordingPartnerMonthly: 12,
    recordingListMonthly: 30,
  },
  {
    label: '201 to 300 users',
    minUsers: 201,
    maxUsers: 300,
    reportingProduct: 'H4004',
    reportingPartnerMonthly: 60,
    reportingListMonthly: 120,
    recordingProduct: 'H4004CRE',
    recordingPartnerMonthly: 15,
    recordingListMonthly: 30,
  },
  {
    label: '301 to 500 users',
    minUsers: 301,
    maxUsers: 500,
    reportingProduct: 'H4005',
    reportingPartnerMonthly: 100,
    reportingListMonthly: 200,
    recordingProduct: 'H4005CRE',
    recordingPartnerMonthly: 20,
    recordingListMonthly: 40,
  },
  {
    label: '501 to 1,000 users',
    minUsers: 501,
    maxUsers: 1000,
    reportingProduct: 'H4006',
    reportingPartnerMonthly: 180,
    reportingListMonthly: 320,
    recordingProduct: 'H4006CRE',
    recordingPartnerMonthly: 25,
    recordingListMonthly: 45,
  },
  {
    label: '1,001 to 2,000 users',
    minUsers: 1001,
    maxUsers: 2000,
    reportingProduct: 'H4007',
    reportingPartnerMonthly: 360,
    reportingListMonthly: 480,
    recordingProduct: 'H4007CRE',
    recordingPartnerMonthly: 30,
    recordingListMonthly: 47,
  },
  {
    label: '2,001 to 3,000 users',
    minUsers: 2001,
    maxUsers: 3000,
    reportingProduct: 'H4008',
    reportingPartnerMonthly: 510,
    reportingListMonthly: 680,
    recordingProduct: 'H4008CRE',
    recordingPartnerMonthly: 39,
    recordingListMonthly: 61,
  },
  {
    label: '3,001 to 5,000 users',
    minUsers: 3001,
    maxUsers: 5000,
    reportingProduct: 'H4009',
    reportingPartnerMonthly: 800,
    reportingListMonthly: 1066,
    recordingProduct: 'H4009CRE',
    recordingPartnerMonthly: 61,
    recordingListMonthly: 95,
  },
  {
    label: '5,001 to 7,000 users',
    minUsers: 5001,
    maxUsers: 7000,
    reportingProduct: 'H4010',
    reportingPartnerMonthly: 1050,
    reportingListMonthly: 1400,
    recordingProduct: 'H4010CRE',
    recordingPartnerMonthly: 80,
    recordingListMonthly: 125,
  },
]

export const TRANSCRIPTION_TIERS: TranscriptionTier[] = [
  { maxHours: 1000, rate: 0.23, label: 'Up to 1,000 hrs' },
  { maxHours: 5000, rate: 0.21, label: 'Up to 5,000 hrs' },
  { maxHours: 10000, rate: 0.19, label: 'Up to 10,000 hrs' },
  { maxHours: 30000, rate: 0.19, label: '10,001 to 30,000 hrs' },
  { maxHours: Number.POSITIVE_INFINITY, rate: 0.17, label: '30,001+ hrs' },
]

export const STORAGE_BASE_HOURS = 2000
export const STORAGE_BASE_PRICE = 6
export const STORAGE_BLOCK_HOURS = 500
export const STORAGE_BLOCK_PRICE = 1

export const REAL_TIME_AGENT_RATE = 4
export const REAL_TIME_MIN_AGENTS = 5
export const SENTIMENT_INTRO_RATE = 8
export const SENTIMENT_STANDARD_RATE = 13

export function clampToNonNegativeNumber(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0
}

export function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function getDomainTierForUsers(users: number) {
  const normalizedUsers = Math.floor(clampToNonNegativeNumber(users))
  return DOMAIN_USER_TIERS.find((tier) => normalizedUsers >= tier.minUsers && normalizedUsers <= tier.maxUsers) ?? null
}

export function getTranscriptionTierForHours(hours: number) {
  const normalizedHours = clampToNonNegativeNumber(hours)
  return TRANSCRIPTION_TIERS.find((tier) => normalizedHours <= tier.maxHours) ?? TRANSCRIPTION_TIERS[TRANSCRIPTION_TIERS.length - 1]
}

export function estimateStorageMonthlyCost(hours: number) {
  const normalizedHours = clampToNonNegativeNumber(hours)
  if (normalizedHours <= 0) return 0
  const overflowHours = Math.max(0, normalizedHours - STORAGE_BASE_HOURS)
  const additionalBlocks = Math.ceil(overflowHours / STORAGE_BLOCK_HOURS)
  return roundCurrency(STORAGE_BASE_PRICE + additionalBlocks * STORAGE_BLOCK_PRICE)
}

export function estimateTranscriptionMonthlyCost(hours: number) {
  const tier = getTranscriptionTierForHours(hours)
  return roundCurrency(clampToNonNegativeNumber(hours) * tier.rate)
}

export function estimateSiteBundleCosts(input: { users: number; transcriptionHours: number; storageHours: number }) {
  const tier = getDomainTierForUsers(input.users)
  if (!tier) {
    return {
      hasTier: false,
      domainBase: 0,
      domainPlusRecording: 0,
      fullAiSuite: 0,
      reportingBase: 0,
      recordingBase: 0,
      transcriptionUsage: estimateTranscriptionMonthlyCost(input.transcriptionHours),
      storageUsage: estimateStorageMonthlyCost(input.storageHours),
    }
  }

  const reportingBase = tier.reportingPartnerMonthly
  const recordingBase = tier.recordingPartnerMonthly
  const transcriptionUsage = estimateTranscriptionMonthlyCost(input.transcriptionHours)
  const storageUsage = estimateStorageMonthlyCost(input.storageHours)

  const domainBase = roundCurrency(reportingBase)
  const domainPlusRecording = roundCurrency(reportingBase + recordingBase + storageUsage)
  const fullAiSuite = roundCurrency(reportingBase + recordingBase + storageUsage + transcriptionUsage)

  return {
    hasTier: true,
    domainBase,
    domainPlusRecording,
    fullAiSuite,
    reportingBase,
    recordingBase,
    transcriptionUsage,
    storageUsage,
  }
}
