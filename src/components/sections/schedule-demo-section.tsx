'use client'

import Script from 'next/script'
import Link from 'next/link'
import { type FormEvent, useMemo, useState } from 'react'
import { MotionReveal } from '../elements/motion'

const turnstileSiteKey = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '').trim()

function getValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

export function ScheduleDemoSection() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const minDate = useMemo(() => new Date().toISOString().split('T')[0], [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submitting) return
    const form = event.currentTarget

    const formData = new FormData(form)
    const firstName = getValue(formData, 'first-name')
    const lastName = getValue(formData, 'last-name')
    const company = getValue(formData, 'company')
    const email = getValue(formData, 'email')
    const country = getValue(formData, 'country')
    const phoneNumber = getValue(formData, 'phone-number')
    const preferredDate = getValue(formData, 'preferred-date')
    const preferredTime = getValue(formData, 'preferred-time')
    const timezone = getValue(formData, 'timezone')
    const message = getValue(formData, 'message')

    setSubmitting(true)
    setErrorMessage(null)
    setSubmitted(false)

    try {
      const subject = `Demo request from ${firstName} ${lastName}`.trim()
      const body = [
        `First name: ${firstName}`,
        `Last name: ${lastName}`,
        `Company: ${company}`,
        `Email: ${email}`,
        `Country code: ${country || 'N/A'}`,
        `Phone: ${phoneNumber || 'N/A'}`,
        `Preferred date: ${preferredDate}`,
        `Preferred time: ${preferredTime}`,
        `Timezone: ${timezone || 'N/A'}`,
        '',
        'Message:',
        message || '(No message provided)',
      ].join('\n')

      window.location.href = `mailto:sales@datel-group.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

      setSubmitted(true)
      form.reset()
      setStartedAt(Date.now())
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Unable to send your demo request right now.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="isolate relative px-6 py-12 sm:py-16 lg:px-8">
      <MotionReveal
        className="mx-auto max-w-5xl rounded-[var(--radius-card)] border border-[#d7e4ee] bg-white/96 p-6 shadow-[0_24px_56px_rgb(18_52_88/10%)] sm:p-10"
        amount={0.15}
      >
        <MotionReveal className="mx-auto max-w-2xl text-center" delay={0.04} amount={0.2}>
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-[#015596] sm:text-5xl">Request a demo</h2>
          <p className="mt-2 text-lg/8 text-[#4f6781]">
            Select your preferred date and time to review Cloud SWEET AI Analytics, real-time views, and deployment options.
            Our team will confirm availability by email.
          </p>
        </MotionReveal>

        {submitted && (
          <MotionReveal className="mx-auto mt-8 max-w-xl rounded-xl border border-[#0e7c86]/25 bg-[#49d6c8]/15 px-4 py-3 text-sm/6 text-[#0b1b2b]" delay={0.08}>
            Thanks, your demo request was sent. A DATEL representative will follow up shortly.
          </MotionReveal>
        )}
        {errorMessage && (
          <MotionReveal className="mx-auto mt-8 max-w-xl rounded-xl border border-[#ff9f01]/35 bg-[#fff7eb] px-4 py-3 text-sm/6 text-[#123458]" delay={0.08}>
            {errorMessage}
          </MotionReveal>
        )}

        <MotionReveal delay={0.1} y={20} amount={0.12}>
          <form onSubmit={handleSubmit} className="mx-auto mt-14 max-w-xl">
            <input type="hidden" name="submitted-at" value={startedAt} />
            <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="first-name" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                  First name
                </label>
                <div className="mt-2.5">
                  <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="block w-full rounded-xl bg-white px-3.5 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] placeholder:text-[#4f6781] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="last-name" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                  Last name
                </label>
                <div className="mt-2.5">
                  <input
                    id="last-name"
                    name="last-name"
                    type="text"
                    autoComplete="family-name"
                    required
                    className="block w-full rounded-xl bg-white px-3.5 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] placeholder:text-[#4f6781] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="company" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                  Company
                </label>
                <div className="mt-2.5">
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    required
                    className="block w-full rounded-xl bg-white px-3.5 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] placeholder:text-[#4f6781] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                  Email
                </label>
                <div className="mt-2.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-xl bg-white px-3.5 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] placeholder:text-[#4f6781] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                  Phone number
                </label>
                <div className="mt-2.5">
                  <div className="flex rounded-xl bg-white outline-1 -outline-offset-1 outline-[#d7e4ee] has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-[#0e7c86]">
                    <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                      <select
                        id="country"
                        name="country"
                        autoComplete="country"
                        aria-label="Country"
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pr-7 pl-3.5 text-base text-[#4f6781] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86] sm:text-sm/6"
                      >
                        <option value="US +1">US +1</option>
                        <option value="CA +1">CA +1</option>
                        <option value="EU">EU</option>
                      </select>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-[#4f6781] sm:size-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      id="phone-number"
                      name="phone-number"
                      type="text"
                      placeholder="123-456-7890"
                      className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-[#0b1b2b] placeholder:text-[#4f6781] focus:outline-none sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="preferred-date" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                  Preferred date
                </label>
                <div className="mt-2.5">
                  <input
                    id="preferred-date"
                    name="preferred-date"
                    type="date"
                    min={minDate}
                    required
                    className="block w-full rounded-xl bg-white px-3.5 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="preferred-time" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                  Preferred time
                </label>
                <div className="mt-2.5">
                  <input
                    id="preferred-time"
                    name="preferred-time"
                    type="time"
                    required
                    className="block w-full rounded-xl bg-white px-3.5 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="timezone" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                  Timezone
                </label>
                <div className="mt-2.5">
                  <select
                    id="timezone"
                    name="timezone"
                    required
                    className="block w-full rounded-xl bg-white px-3.5 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
                  >
                    <option value="America/New_York">Eastern (ET)</option>
                    <option value="America/Chicago">Central (CT)</option>
                    <option value="America/Denver">Mountain (MT)</option>
                    <option value="America/Los_Angeles">Pacific (PT)</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                  Message
                </label>
                <div className="mt-2.5">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    maxLength={500}
                    className="block w-full rounded-xl bg-white px-3.5 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] placeholder:text-[#4f6781] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
                    defaultValue={''}
                  />
                </div>
              </div>

              <div className="flex gap-x-4 sm:col-span-2">
                <div className="flex h-6 items-center">
                  <input
                    id="agree-to-policies"
                    name="agree-to-policies"
                    type="checkbox"
                    required
                    className="size-4 rounded border-[#d7e4ee] text-[#0e7c86] focus:ring-[#0e7c86]"
                  />
                </div>
                <label htmlFor="agree-to-policies" className="text-sm/6 text-[#4f6781]">
                  By selecting this, you agree to our{' '}
                  <Link href="/privacy-policy" className="font-semibold whitespace-nowrap text-[#0e7c86]">
                    privacy policy
                  </Link>
                  .
                </label>
              </div>
            </div>

            {turnstileSiteKey && (
              <>
                <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
                <div className="mt-6">
                  <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="light" />
                </div>
              </>
            )}

            <div className="mt-10">
              <button
                type="submit"
                disabled={submitting}
                className="block w-full rounded-full border border-[#FF9F01] bg-[#FF9F01] px-3 py-2 text-center text-xs font-semibold text-white shadow-[0_8px_20px_rgb(255_159_1/28%)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#e58f00] hover:bg-[#e58f00] disabled:cursor-not-allowed disabled:opacity-70 sm:px-3.5 sm:py-2.5 sm:text-sm focus-visible:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF9F01]"
              >
                {submitting ? 'Sending...' : 'Request demo'}
              </button>
            </div>
          </form>
        </MotionReveal>
      </MotionReveal>
    </div>
  )
}
