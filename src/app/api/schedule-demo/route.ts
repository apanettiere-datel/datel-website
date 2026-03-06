import { processDemoIntake } from '@/lib/demo-intake'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type ScheduleDemoRequestBody = {
  firstName?: string
  lastName?: string
  company?: string
  email?: string
  country?: string
  phoneNumber?: string
  preferredDate?: string
  preferredTime?: string
  timezone?: string
  message?: string
  website?: string
  submittedAt?: number
  captchaToken?: string
}

const minFormFillMs = 3000
const maxFormAgeMs = 1000 * 60 * 60 * 6
const rateLimitWindowMs = 1000 * 60 * 10
const maxRequestsPerWindow = 5

type RateLimitEntry = {
  count: number
  resetAt: number
}

declare global {
  // eslint-disable-next-line no-var
  var __scheduleDemoRateLimitStore: Map<string, RateLimitEntry> | undefined
}

const rateLimitStore = globalThis.__scheduleDemoRateLimitStore ?? new Map<string, RateLimitEntry>()
globalThis.__scheduleDemoRateLimitStore = rateLimitStore

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || 'unknown'

  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp

  return 'unknown'
}

function normalizeValue(value: unknown) {
  return String(value ?? '').trim()
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isRateLimited(ipAddress: string, now: number) {
  const entry = rateLimitStore.get(ipAddress)

  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(ipAddress, {
      count: 1,
      resetAt: now + rateLimitWindowMs,
    })
    return false
  }

  if (entry.count >= maxRequestsPerWindow) return true

  entry.count += 1
  rateLimitStore.set(ipAddress, entry)
  return false
}

async function verifyTurnstile(token: string, ipAddress: string) {
  const secretKey = normalizeValue(process.env.TURNSTILE_SECRET_KEY)
  if (!secretKey) return true
  if (!token) return false

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
  })

  if (ipAddress !== 'unknown') {
    body.set('remoteip', ipAddress)
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
    cache: 'no-store',
  })

  if (!response.ok) return false

  const result = (await response.json()) as { success?: boolean }
  return Boolean(result.success)
}

export async function POST(request: NextRequest) {
  let payload: ScheduleDemoRequestBody

  try {
    payload = (await request.json()) as ScheduleDemoRequestBody
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 })
  }

  const ipAddress = getClientIp(request)
  const now = Date.now()

  const website = normalizeValue(payload.website)
  if (website) {
    return NextResponse.json({ ok: true })
  }

  if (isRateLimited(ipAddress, now)) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const firstName = normalizeValue(payload.firstName)
  const lastName = normalizeValue(payload.lastName)
  const company = normalizeValue(payload.company)
  const email = normalizeValue(payload.email)
  const country = normalizeValue(payload.country)
  const phoneNumber = normalizeValue(payload.phoneNumber)
  const preferredDate = normalizeValue(payload.preferredDate)
  const preferredTime = normalizeValue(payload.preferredTime)
  const timezone = normalizeValue(payload.timezone)
  const message = normalizeValue(payload.message)
  const submittedAt = Number(payload.submittedAt ?? 0)
  const captchaToken = normalizeValue(payload.captchaToken)

  if (!firstName || !lastName || !company || !email || !preferredDate || !preferredTime || !timezone) {
    return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (!Number.isFinite(submittedAt) || now - submittedAt < minFormFillMs || now - submittedAt > maxFormAgeMs) {
    return NextResponse.json({ error: 'Form verification failed. Please refresh and try again.' }, { status: 400 })
  }

  const captchaVerified = await verifyTurnstile(captchaToken, ipAddress)
  if (!captchaVerified) {
    return NextResponse.json({ error: 'Captcha verification failed. Please try again.' }, { status: 400 })
  }

  try {
    await processDemoIntake({
      firstName,
      lastName,
      company,
      email,
      country,
      phoneNumber,
      preferredDate,
      preferredTime,
      timezone,
      message,
      ipAddress,
    })
  } catch (error) {
    console.error('Schedule demo submission failed', error)
    return NextResponse.json({ error: 'Unable to send your demo request right now. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
