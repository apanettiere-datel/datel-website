'use client'

import Script from 'next/script'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type FormEvent, useEffect, useState } from 'react'
import { MotionReveal } from '../elements/motion'
import { AlertTriangleIcon } from '../icons/alert-triangle-icon'
import { ChatBubbleCircleIcon } from '../icons/chat-bubble-circle-icon'
import { CogIcon } from '../icons/cog-icon'

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

const contactTeams = {
  sales: {
    label: 'Sales',
    formHeading: 'Send sales message',
    formHelper: 'Share your sales request and our team will respond with next steps.',
  },
  support: {
    label: 'Support',
    formHeading: 'Send support message',
    formHelper: 'Share your technical issue or question and our support team will follow up.',
  },
} as const

type ContactTeam = keyof typeof contactTeams

function normalizeTeam(value: string | null): ContactTeam {
  return value === 'support' ? 'support' : 'sales'
}

function getValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

export function ContactSalesSection() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const urlTeam = normalizeTeam(searchParams.get('team'))
  const [selectedTeam, setSelectedTeam] = useState<ContactTeam>(urlTeam)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [startedAt, setStartedAt] = useState(() => Date.now())

  useEffect(() => {
    setSelectedTeam(urlTeam)
  }, [urlTeam])

  function handleTeamChange(team: ContactTeam) {
    setSelectedTeam(team)
    setSubmitted(false)
    setErrorMessage(null)

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.set('team', team)
    const query = nextParams.toString()
    router.replace(query ? `${pathname}?${query}#contact` : `${pathname}#contact`, { scroll: false })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submitting) return

    const formData = new FormData(event.currentTarget)
    const firstName = getValue(formData, 'first-name')
    const lastName = getValue(formData, 'last-name')
    const company = getValue(formData, 'company')
    const email = getValue(formData, 'email')
    const phone = getValue(formData, 'phone')
    const message = getValue(formData, 'message')
    const website = getValue(formData, 'website')
    const captchaToken = getValue(formData, 'cf-turnstile-response')

    setSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team: selectedTeam,
          firstName,
          lastName,
          company,
          email,
          phone,
          message,
          website,
          submittedAt: startedAt,
          captchaToken,
        }),
      })

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error || 'Unable to send your message right now.')
      }

      setSubmitted(true)
      event.currentTarget.reset()
      setStartedAt(Date.now())
    } catch (error) {
      setSubmitted(false)
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Unable to send your message right now.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const activeTeam = contactTeams[selectedTeam]

  return (
    <section id="contact" className="relative px-6 py-12 sm:py-16 lg:px-8">
      <MotionReveal
        className="mx-auto max-w-[var(--layout-max-width)] overflow-hidden rounded-[var(--radius-card)] border border-[#d7e4ee] bg-white/96 shadow-[0_24px_56px_rgb(18_52_88/10%)]"
        amount={0.15}
      >
        <div className="relative px-6 py-14 sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(73,214,200,0.2)_0%,rgba(73,214,200,0)_68%)]" />

          <div className="relative grid grid-cols-1 gap-14 lg:grid-cols-2">
            <div>
              <MotionReveal amount={0.2}>
                <h2 className="text-4xl font-semibold tracking-tight text-[#015596] sm:text-5xl">Contact Sales and Support</h2>
                <p className="mt-3 text-lg/8 text-[#4f6781]">
                  Reach out for licensing, implementation planning, support, and platform questions related to Cloud SWEET AI Analytics.
                </p>
                <p className="mt-4 text-sm/6 font-semibold text-[#0e7c86]">Currently messaging: {activeTeam.label}</p>
              </MotionReveal>

              <div className="mt-12 space-y-8">
                <MotionReveal className="flex gap-x-4" delay={0.08}>
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0e7c86] text-white">
                    <ChatBubbleCircleIcon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base/7 font-semibold text-[#123458]">Sales support</h3>
                    <p className="mt-2 text-base/7 text-[#4f6781]">Discuss licensing, implementation plans, and the right Cloud SWEET package.</p>
                    <p className="mt-3 text-sm/6 font-semibold text-[#123458]">
                      <a href="mailto:sales@datel-group.com">sales@datel-group.com</a>
                    </p>
                    <button
                      type="button"
                      onClick={() => handleTeamChange('sales')}
                      className="mt-3 inline-flex items-center rounded-full border border-[#d7e4ee] bg-white px-3 py-1 text-xs/6 font-semibold text-[#123458] transition-colors hover:border-[#0e7c86] hover:text-[#0e7c86]"
                    >
                      {selectedTeam === 'sales' ? 'Selected' : 'Message sales'}
                    </button>
                  </div>
                </MotionReveal>

                <MotionReveal className="flex gap-x-4" delay={0.14}>
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0e7c86] text-white">
                    <AlertTriangleIcon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base/7 font-semibold text-[#123458]">Support</h3>
                    <p className="mt-2 text-base/7 text-[#4f6781]">Need technical assistance with reporting or configuration. Our team is ready to help.</p>
                    <p className="mt-3 text-sm/6 font-semibold text-[#123458]">
                      <a href="mailto:support@datel-group.com">support@datel-group.com</a>
                    </p>
                    <button
                      type="button"
                      onClick={() => handleTeamChange('support')}
                      className="mt-3 inline-flex items-center rounded-full border border-[#d7e4ee] bg-white px-3 py-1 text-xs/6 font-semibold text-[#123458] transition-colors hover:border-[#0e7c86] hover:text-[#0e7c86]"
                    >
                      {selectedTeam === 'support' ? 'Selected' : 'Message support'}
                    </button>
                  </div>
                </MotionReveal>

                <MotionReveal className="flex gap-x-4" delay={0.2}>
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0e7c86] text-white">
                    <CogIcon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base/7 font-semibold text-[#123458]">Phone</h3>
                    <p className="mt-2 text-base/7 text-[#4f6781]">Sales and support: (724) 940-0400</p>
                    <p className="mt-3 text-sm/6 font-semibold text-[#123458]">
                      <a href="tel:+17249400400">Call now</a>
                    </p>
                  </div>
                </MotionReveal>
              </div>
            </div>

            <MotionReveal delay={0.12} y={20} amount={0.2}>
              <div className="rounded-[1.75rem] border border-[#d7e4ee] bg-[#f7fbfe] p-6 shadow-[0_12px_30px_rgb(18_52_88/10%)] sm:p-8">
                <div className="inline-flex rounded-full border border-[#d7e4ee] bg-white p-1">
                  {(Object.keys(contactTeams) as ContactTeam[]).map((team) => (
                    <button
                      key={team}
                      type="button"
                      onClick={() => handleTeamChange(team)}
                      className={`rounded-full px-4 py-1.5 text-sm/6 font-semibold transition-colors ${
                        selectedTeam === team
                          ? 'bg-[#123458] text-white'
                          : 'text-[#4f6781] hover:text-[#123458]'
                      }`}
                    >
                      {contactTeams[team].label}
                    </button>
                  ))}
                </div>

                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[#123458]">{activeTeam.formHeading}</h3>
                <p className="mt-2 text-sm/6 text-[#4f6781]">{activeTeam.formHelper}</p>

                {submitted && (
                  <div className="mt-6 rounded-lg border border-[#0e7c86]/25 bg-[#49d6c8]/15 px-4 py-3 text-sm/6 text-[#0b1b2b]">
                    Thanks, your message was sent to {activeTeam.label}. A DATEL representative will follow up shortly.
                  </div>
                )}
                {errorMessage && (
                  <div className="mt-6 rounded-lg border border-[#ff9f01]/35 bg-[#fff7eb] px-4 py-3 text-sm/6 text-[#123458]">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8">
                  <input type="hidden" name="submitted-at" value={startedAt} />
                  <input type="hidden" name="team" value={selectedTeam} />
                  <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="first-name" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                        First name
                      </label>
                      <input
                        id="first-name"
                        name="first-name"
                        type="text"
                        required
                        className="mt-2 block w-full rounded-xl bg-white px-3 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
                      />
                    </div>
                    <div>
                      <label htmlFor="last-name" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                        Last name
                      </label>
                      <input
                        id="last-name"
                        name="last-name"
                        type="text"
                        required
                        className="mt-2 block w-full rounded-xl bg-white px-3 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="company" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                        Company
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        className="mt-2 block w-full rounded-xl bg-white px-3 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-2 block w-full rounded-xl bg-white px-3 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <div className="flex justify-between">
                        <label htmlFor="phone" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                          Phone
                        </label>
                        <span className="text-sm/6 text-[#4f6781]">Optional</span>
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="mt-2 block w-full rounded-xl bg-white px-3 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="message" className="block text-sm/6 font-semibold text-[#0b1b2b]">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        className="mt-2 block w-full rounded-xl bg-white px-3 py-2 text-base text-[#0b1b2b] outline-1 -outline-offset-1 outline-[#d7e4ee] focus:outline-2 focus:-outline-offset-2 focus:outline-[#0e7c86]"
                      />
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

                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-full border border-[#FF9F01] bg-[#FF9F01] px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgb(255_159_1/28%)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#e58f00] hover:bg-[#e58f00] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF9F01]"
                    >
                      {submitting ? 'Sending...' : `Send to ${activeTeam.label}`}
                    </button>
                  </div>
                </form>
              </div>
            </MotionReveal>
          </div>
        </div>
      </MotionReveal>
    </section>
  )
}
