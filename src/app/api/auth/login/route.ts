import { normalizeValue, setAuthCookies } from '@/lib/auth-session'
import { getRuntimeEnvValue } from '@/lib/runtime-env'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type LoginRequestBody = {
  username?: string
  password?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getLoganLoginUrl(baseUrl: string) {
  return `${baseUrl.replace(/\/+$/, '')}/auth/login`
}

function getErrorMessage(payload: unknown) {
  if (!isRecord(payload)) return ''
  const message = normalizeValue(payload.message)
  if (message) return message
  return normalizeValue(payload.error)
}

export async function POST(request: NextRequest) {
  let payload: LoginRequestBody

  try {
    payload = (await request.json()) as LoginRequestBody
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 })
  }

  const username = normalizeValue(payload.username)
  const password = normalizeValue(payload.password)

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 })
  }

  const loganApiBase = normalizeValue(await getRuntimeEnvValue('LOGAN_API_URL'))
  if (!loganApiBase) {
    return NextResponse.json({ error: 'LOGAN_API_URL is not configured.' }, { status: 500 })
  }

  const loginFormBody = new URLSearchParams({
    username,
    password,
  })

  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(getLoganLoginUrl(loganApiBase), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: loginFormBody.toString(),
      cache: 'no-store',
    })
  } catch {
    return NextResponse.json({ error: 'Unable to reach authentication service.' }, { status: 502 })
  }

  const upstreamPayload = await upstreamResponse.json().catch(() => null)
  if (!upstreamResponse.ok) {
    const upstreamMessage = getErrorMessage(upstreamPayload)
    const message = upstreamMessage || 'User name or password is incorrect.'
    return NextResponse.json({ error: message }, { status: upstreamResponse.status === 403 ? 403 : 401 })
  }

  if (!isRecord(upstreamPayload)) {
    return NextResponse.json({ error: 'Unexpected authentication response.' }, { status: 502 })
  }

  const token = normalizeValue(upstreamPayload.token)
  if (!token) {
    return NextResponse.json({ error: 'Authentication token missing from response.' }, { status: 502 })
  }

  const role = normalizeValue(upstreamPayload.role)
  const siteIdValue = upstreamPayload.site_id
  const siteId = Number.isFinite(Number(siteIdValue)) ? Number(siteIdValue) : null

  const response = NextResponse.json({
    ok: true,
    role,
    siteId,
  })

  setAuthCookies(response, token)

  return response
}
