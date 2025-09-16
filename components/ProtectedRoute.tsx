'use client'

import { useUser } from "@clerk/nextjs"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireSubscription?: boolean
  requireCredits?: boolean
  fallbackUrl?: string
}

export default function ProtectedRoute({ 
  children, 
  requireSubscription = false,
  requireCredits = false,
  fallbackUrl = "/pricing"
}: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useUser()
  const { userProfile, loading } = useUserProfile()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
      return
    }

    if (!loading && userProfile) {
      // Check subscription requirement
      if (requireSubscription && userProfile.subscription_status !== 'active') {
        router.push(fallbackUrl)
        return
      }

      // Check credits requirement
      if (requireCredits && (!userProfile.scan_credits || userProfile.scan_credits <= 0)) {
        router.push(fallbackUrl)
        return
      }
    }
  }, [isLoaded, isSignedIn, loading, userProfile, requireSubscription, requireCredits, router, fallbackUrl])

  // Show loading while checking authentication
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!isSignedIn) {
    return null
  }

  // Don't render if subscription required but not active
  if (requireSubscription && userProfile?.subscription_status !== 'active') {
    return null
  }

  // Don't render if credits required but none available
  if (requireCredits && (!userProfile?.scan_credits || userProfile.scan_credits <= 0)) {
    return null
  }

  return <>{children}</>
}