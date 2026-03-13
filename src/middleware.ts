import {
  clearAuthCookies,
  getLoginType,
  getLoginPath,
  getPostLoginRedirectPath,
  getProtectedPathPrefixes,
  getSessionToken,
  normalizeValue,
} from '@/lib/auth-session'
import { NextRequest, NextResponse } from 'next/server'

function isProtectedPath(pathname: string) {
  return getProtectedPathPrefixes().some((prefix) => pathname.startsWith(prefix))
}

function isLoginPath(pathname: string) {
  return pathname === getLoginPath()
}

function getAuthValidateUrl(baseUrl: string) {
  return `${baseUrl.replace(/\/+$/, '')}/auth/validate`
}

async function validateAuthToken(token: string, loginType: string) {
  const loganApiBase = normalizeValue(process.env.LOGAN_API_URL)
  if (!loganApiBase) return false

  try {
    const response = await fetch(getAuthValidateUrl(loganApiBase), {
      method: 'GET',
      headers: {
        login_type: loginType,
        token,
      },
      cache: 'no-store',
    })

    if (!response.ok) return false

    const payload = (await response.json().catch(() => null)) as { success?: boolean } | null
    return Boolean(payload?.success)
  } catch {
    return false
  }
}

function buildLoginRedirect(request: NextRequest) {
  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = getLoginPath()
  const nextTarget = `${request.nextUrl.pathname}${request.nextUrl.search}`
  loginUrl.searchParams.set('next', nextTarget)
  return NextResponse.redirect(loginUrl)
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const protectedPath = isProtectedPath(pathname)
  const loginPath = isLoginPath(pathname)

  if (!protectedPath && !loginPath) {
    return NextResponse.next()
  }

  const token = getSessionToken(request)
  if (!token) {
    if (protectedPath) {
      return buildLoginRedirect(request)
    }
    return NextResponse.next()
  }

  const loginType = getLoginType(request)
  const isValid = await validateAuthToken(token, loginType)

  if (!isValid) {
    if (protectedPath) {
      const response = buildLoginRedirect(request)
      clearAuthCookies(response)
      return response
    }

    const response = NextResponse.next()
    clearAuthCookies(response)
    return response
  }

  if (loginPath) {
    const url = request.nextUrl.clone()
    url.pathname = getPostLoginRedirectPath()
    url.search = ''
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
