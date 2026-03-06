const bareEmailPattern = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/i
const namedEmailPattern = /^([^<>"\r\n]+?)\s*<\s*([^<>\s"]+@[^\s<>"]+\.[^\s<>"]+)\s*>$/i
const firstEmailPattern = /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i

function cleanupRawAddress(value: string) {
  return value
    .trim()
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^['"`]+/, '')
    .replace(/['"`]+$/, '')
    .trim()
}

export function normalizeFromAddress(value: string, fallback: string) {
  const cleanedValue = cleanupRawAddress(value)
  const cleanedFallback = cleanupRawAddress(fallback)

  const normalized = normalizeAddress(cleanedValue)
  if (normalized) return normalized

  const fallbackNormalized = normalizeAddress(cleanedFallback)
  if (fallbackNormalized) return fallbackNormalized

  throw new Error('Invalid sender email configuration. Set CONTACT_FROM_EMAIL to "email@example.com" or "Name <email@example.com>".')
}

function normalizeAddress(value: string) {
  if (!value) return ''

  if (bareEmailPattern.test(value)) {
    return value.toLowerCase()
  }

  const namedMatch = value.match(namedEmailPattern)
  if (namedMatch) {
    const name = namedMatch[1].trim()
    const email = namedMatch[2].trim().toLowerCase()
    return name ? `${name} <${email}>` : email
  }

  const firstEmailMatch = value.match(firstEmailPattern)
  if (!firstEmailMatch) return ''

  const email = firstEmailMatch[1].toLowerCase()
  const maybeName = value.replace(firstEmailMatch[1], '').replace(/[<>]/g, '').trim()
  return maybeName ? `${maybeName} <${email}>` : email
}
