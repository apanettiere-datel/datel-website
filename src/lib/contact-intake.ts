import { normalizeFromAddress } from './email-address'
import { getRuntimeEnvValue } from './runtime-env'

type ContactIntakeInput = {
  team: 'sales' | 'support'
  firstName: string
  lastName: string
  company: string
  email: string
  phone?: string
  message: string
  ipAddress: string
}

const defaultRecipients: Record<ContactIntakeInput['team'], string> = {
  sales: 'sales@datel-group.com',
  support: 'support@datel-group.com',
}

function formatContactEmailBody(input: ContactIntakeInput) {
  return [
    'Website contact request',
    '',
    `Team: ${input.team === 'support' ? 'Support' : 'Sales'}`,
    `Name: ${`${input.firstName} ${input.lastName}`.trim()}`,
    `Company: ${input.company}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || 'Not provided'}`,
    `IP Address: ${input.ipAddress}`,
    '',
    'Message:',
    input.message,
  ].join('\n')
}

async function sendContactEmail(input: ContactIntakeInput) {
  const resendApiKey = await getRuntimeEnvValue('RESEND_API_KEY')

  if (!resendApiKey) {
    throw new Error('Contact service is not configured. Add RESEND_API_KEY to enable email delivery.')
  }

  const toEmail =
    input.team === 'support'
      ? (await getRuntimeEnvValue('CONTACT_SUPPORT_EMAIL')) || defaultRecipients.support
      : (await getRuntimeEnvValue('CONTACT_SALES_EMAIL')) || defaultRecipients.sales
  const fromEmail = normalizeFromAddress(
    await getRuntimeEnvValue('CONTACT_FROM_EMAIL'),
    'DATEL Website <onboarding@resend.dev>',
  )
  const subject = `${input.team === 'support' ? 'Support' : 'Sales'} request from ${input.firstName} ${input.lastName}`.trim()

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: input.email,
      subject,
      text: formatContactEmailBody(input),
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Email delivery failed: ${errorBody || response.statusText}`)
  }
}

export async function processContactIntake(input: ContactIntakeInput) {
  await sendContactEmail(input)
}
