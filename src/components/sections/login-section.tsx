'use client'

import { Button } from '@/components/elements/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'

function getDefaultPostLoginPath() {
  const configured = String(process.env.NEXT_PUBLIC_AUTH_POST_LOGIN_REDIRECT_PATH ?? '').trim()
  if (!configured) return '/dashboard'
  if (configured.startsWith('/')) return configured
  return `/${configured}`
}

type LoginApiSuccess = {
  ok: true
  role: string
  siteId: number | null
}

type LoginApiError = {
  error: string
}

export function LoginSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultPostLoginPath = getDefaultPostLoginPath()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submitting) return

    setSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const payload = (await response.json().catch(() => null)) as LoginApiSuccess | LoginApiError | null

      if (!response.ok) {
        const message = payload && 'error' in payload ? payload.error : 'Unable to sign in right now.'
        throw new Error(message)
      }

      setPassword('')
      const nextPath = String(searchParams.get('next') ?? '').trim()
      const redirectTarget = nextPath.startsWith('/') ? nextPath : defaultPostLoginPath
      router.push(redirectTarget)
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Unable to sign in right now.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="relative isolate px-6 py-12 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[var(--radius-card)] border border-[#d7e4ee] bg-white/96 p-6 shadow-[0_24px_56px_rgb(18_52_88/10%)] sm:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-[#015596] sm:text-5xl">Portal login</h1>
          <p className="mt-2 text-lg/8 text-[#4f6781]">
            Sign in with your existing Cloud SWEET username and password.
          </p>
        </div>

        {errorMessage && (
          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-[#ff9f01]/35 bg-[#fff7eb] px-4 py-3 text-sm/6 text-[#123458]">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-xl space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm/6 font-semibold text-[#0b1b2b]">
              Username
            </label>
            <div className="mt-2.5">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="block w-full rounded-xl bg-white px-3.5 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] placeholder:text-[#4f6781] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm/6 font-semibold text-[#0b1b2b]">
              Password
            </label>
            <div className="mt-2.5">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="block w-full rounded-xl bg-white px-3.5 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] placeholder:text-[#4f6781] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </Button>
        </form>
      </div>
    </section>
  )
}
