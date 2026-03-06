import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function getRuntimeEnvValue(key: string) {
  const processValue = (process.env[key] ?? '').trim()
  if (processValue) return processValue

  try {
    const context = await getCloudflareContext({ async: true })
    const envMap = context.env as Record<string, unknown>
    return String(envMap[key] ?? '').trim()
  } catch {
    return ''
  }
}
