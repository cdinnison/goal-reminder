'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { posthogClient } from '@/lib/posthog'

function PostHogPageTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (posthogClient) {
      // Track page views
      posthogClient.capture('$pageview')
    }
  }, [pathname, searchParams])

  return null
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageTracker />
      </Suspense>
      {children}
    </>
  )
} 