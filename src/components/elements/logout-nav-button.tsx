'use client'

import { Button } from '@/components/elements/button'
import { clsx } from 'clsx/lite'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutNavButton({ className }: { className?: string }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  async function handleLogout() {
    if (submitting) return
    setSubmitting(true)

    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      color="light"
      onClick={handleLogout}
      disabled={submitting}
      className={clsx('hidden xl:inline-flex', className)}
    >
      {submitting ? 'Signing out...' : 'Logout'}
    </Button>
  )
}
