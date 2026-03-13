import { Suspense } from 'react'
import { LoginSection } from '@/components/sections/login-section'

export default function Page() {
  return (
    <Suspense fallback={<div className="px-6 py-12 sm:py-16 lg:px-8" />}>
      <LoginSection />
    </Suspense>
  )
}
