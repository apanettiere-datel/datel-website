import type { NextRequest, NextResponse } from 'next/server'

const DEFAULT_AUTH_TOKEN_COOKIE = 'clsw_token'
const DEFAULT_AUTH_LOGIN_TYPE_COOKIE = 'clsw_login_type'
const DEFAULT_LOGIN_TYPE = 'clsw'
const DEFAULT_TOKEN_MAX_AGE_SECONDS = 60 * 60
const DEFAULT_COOKIE_PATH = '/'
const DEFAULT_COOKIE_SAME_SITE = 'lax'
const DEFAULT_LOGIN_PATH = '/login'
const DEFAULT_POST_LOGIN_REDIRECT_PATH = '/dashboard'
const REQUIRED_PROTECTED_PATH_PREFIXES = ['/dashboard', '/accounting', '/docs', '/estimator', '/reseller-pricing']

export function normalizeValue(value: unknown) {
  return String(value ?? '').trim()
}

function normalizePathValue(value: string, fallback: string) {
  const normalized = normalizeValue(value)
  if (!normalized) return fallback
  if (normalized.startsWith('/')) return normalized
  return `/${normalized}`
}

function parseIntegerEnv(value: string, fallback: number) {
  const parsed = Number.parseInt(normalizeValue(value), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function parseBooleanEnv(value: string, fallback: boolean) {
  const normalized = normalizeValue(value).toLowerCase()
  if (!normalized) return fallback
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false
  return fallback
}

function getCookieSameSite() {
  const value = normalizeValue(process.env.AUTH_COOKIE_SAME_SITE).toLowerCase()
  if (value === 'strict' || value === 'none' || value === 'lax') return value
  return DEFAULT_COOKIE_SAME_SITE
}

function getCookiePath() {
  return normalizePathValue(process.env.AUTH_COOKIE_PATH ?? '', DEFAULT_COOKIE_PATH)
}

function getCookieMaxAgeSeconds() {
  return parseIntegerEnv(process.env.AUTH_COOKIE_MAX_AGE_SECONDS ?? '', DEFAULT_TOKEN_MAX_AGE_SECONDS)
}

function isSecureCookie() {
  const defaultValue = process.env.NODE_ENV === 'production'
  return parseBooleanEnv(process.env.AUTH_COOKIE_SECURE ?? '', defaultValue)
}

export function getLoginPath() {
  return normalizePathValue(process.env.AUTH_LOGIN_PATH ?? '', DEFAULT_LOGIN_PATH)
}

export function getPostLoginRedirectPath() {
  const serverOverride = normalizeValue(process.env.AUTH_POST_LOGIN_REDIRECT_PATH)
  const publicFallback = normalizeValue(process.env.NEXT_PUBLIC_AUTH_POST_LOGIN_REDIRECT_PATH)
  return normalizePathValue(serverOverride || publicFallback, DEFAULT_POST_LOGIN_REDIRECT_PATH)
}

export function getDefaultLoginType() {
  return normalizeValue(process.env.AUTH_DEFAULT_LOGIN_TYPE) || DEFAULT_LOGIN_TYPE
}

export function getProtectedPathPrefixes() {
  const configured = normalizeValue(process.env.AUTH_PROTECTED_PATH_PREFIXES)
  const values = configured
    ? configured.split(',').map((item) => normalizePathValue(item, '')).filter(Boolean)
    : REQUIRED_PROTECTED_PATH_PREFIXES

  const merged = [...new Set([...REQUIRED_PROTECTED_PATH_PREFIXES, ...values])]
  return merged.length > 0 ? merged : REQUIRED_PROTECTED_PATH_PREFIXES
}

export function getAuthTokenCookieName() {
  return normalizeValue(process.env.AUTH_TOKEN_COOKIE_NAME) || DEFAULT_AUTH_TOKEN_COOKIE
}

export function getAuthLoginTypeCookieName() {
  return normalizeValue(process.env.AUTH_LOGIN_TYPE_COOKIE_NAME) || DEFAULT_AUTH_LOGIN_TYPE_COOKIE
}

export function getSessionToken(request: NextRequest) {
  return normalizeValue(request.cookies.get(getAuthTokenCookieName())?.value)
}

export function getLoginType(request: NextRequest) {
  const loginType = normalizeValue(request.cookies.get(getAuthLoginTypeCookieName())?.value)
  return loginType || getDefaultLoginType()
}

export function setAuthCookies(response: NextResponse, token: string) {
  const secure = isSecureCookie()
  const maxAge = getCookieMaxAgeSeconds()
  const path = getCookiePath()
  const sameSite = getCookieSameSite()

  response.cookies.set({
    name: getAuthTokenCookieName(),
    value: token,
    httpOnly: true,
    sameSite,
    secure,
    path,
    maxAge,
  })

  response.cookies.set({
    name: getAuthLoginTypeCookieName(),
    value: getDefaultLoginType(),
    httpOnly: true,
    sameSite,
    secure,
    path,
    maxAge,
  })
}

export function clearAuthCookies(response: NextResponse) {
  const secure = isSecureCookie()
  const path = getCookiePath()
  const sameSite = getCookieSameSite()

  response.cookies.set({
    name: getAuthTokenCookieName(),
    value: '',
    httpOnly: true,
    sameSite,
    secure,
    path,
    maxAge: 0,
    expires: new Date(0),
  })

  response.cookies.set({
    name: getAuthLoginTypeCookieName(),
    value: '',
    httpOnly: true,
    sameSite,
    secure,
    path,
    maxAge: 0,
    expires: new Date(0),
  })
}
