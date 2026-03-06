type DemoIntakeInput = {
  firstName: string
  lastName: string
  company: string
  email: string
  country?: string
  phoneNumber?: string
  preferredDate: string
  preferredTime: string
  timezone: string
  message?: string
  ipAddress: string
}

const defaultDemoRecipient = 'sales@datel-group.com'

function getEnvValue(key: string) {
  return (process.env[key] ?? '').trim()
}

function formatDemoEmailBody(input: DemoIntakeInput) {
  return [
    'Website demo request',
    '',
    `Name: ${`${input.firstName} ${input.lastName}`.trim()}`,
    `Company: ${input.company}`,
    `Email: ${input.email}`,
    `Phone: ${input.country || 'US'} ${input.phoneNumber || 'Not provided'}`,
    `Preferred date: ${input.preferredDate}`,
    `Preferred time: ${input.preferredTime}`,
    `Timezone: ${input.timezone}`,
    `IP Address: ${input.ipAddress}`,
    '',
    'Notes:',
    input.message || 'No additional notes.',
  ].join('\n')
}

async function sendDemoEmail(input: DemoIntakeInput) {
  const resendApiKey = getEnvValue('RESEND_API_KEY')

  if (!resendApiKey) {
    throw new Error('Contact service is not configured. Add RESEND_API_KEY to enable email delivery.')
  }

  const toEmail = getEnvValue('DEMO_REQUEST_EMAIL') || getEnvValue('CONTACT_SALES_EMAIL') || defaultDemoRecipient
  const fromEmail = getEnvValue('CONTACT_FROM_EMAIL') || 'DATEL Website <onboarding@resend.dev>'
  const subject = `Demo request from ${input.firstName} ${input.lastName} (${input.preferredDate} ${input.preferredTime})`.trim()

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
      text: formatDemoEmailBody(input),
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Email delivery failed: ${errorBody || response.statusText}`)
  }
}

export async function processDemoIntake(input: DemoIntakeInput) {
  await sendDemoEmail(input)
}
