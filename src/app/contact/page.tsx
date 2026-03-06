import { Suspense } from 'react'
import { ContactSalesSection } from '@/components/sections/contact-sales-section'

export default function Page() {
  return (
    <Suspense fallback={<div className="px-6 py-12 sm:py-16 lg:px-8" />}>
      <ContactSalesSection />
    </Suspense>
  )
}
