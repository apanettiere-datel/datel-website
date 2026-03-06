import { processContactIntake } from '@/lib/contact-intake'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type ContactRequestBody = {
  team?: string
  firstName?: string
  lastName?: string
  company?: string
  email?: string
  phone?: string
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
  var __contactRateLimitStore: Map<string, RateLimitEntry> | undefined
}

const rateLimitStore = globalThis.__contactRateLimitStore ?? new Map<string, RateLimitEntry>()
globalThis.__contactRateLimitStore = rateLimitStore

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
  const secretKey = process.env.TURNSTILE_SECRET_KEY
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
  let payload: ContactRequestBody

  try {
    payload = (await request.json()) as ContactRequestBody
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 })
  }

  const ipAddress = getClientIp(request)
  const now = Date.now()

  // Honeypot trap: quietly drop likely bot submissions.
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
  const phone = normalizeValue(payload.phone)
  const message = normalizeValue(payload.message)
  const teamValue = normalizeValue(payload.team).toLowerCase()
  const team = teamValue === 'support' ? 'support' : 'sales'
  const submittedAt = Number(payload.submittedAt ?? 0)
  const captchaToken = normalizeValue(payload.captchaToken)

  if (!firstName || !lastName || !company || !email || !message) {
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
    await processContactIntake({
      team,
      firstName,
      lastName,
      company,
      email,
      phone,
      message,
      ipAddress,
    })
  } catch (error) {
    console.error('Contact submission failed', error)
    return NextResponse.json({ error: 'Unable to send your message right now. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
