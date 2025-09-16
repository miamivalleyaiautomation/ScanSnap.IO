'use client'

import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs"
import { useUserProfile } from "@/hooks/useUserProfile"
import Link from "next/link"

export default function UserMenu() {
  const { isSignedIn, user } = useUser()
  const { userProfile } = useUserProfile()

  if (!isSignedIn) {
    return (
      <div className="flex items-center space-x-4">
        <SignInButton mode="modal">
          <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Get Started
          </button>
        </SignUpButton>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Credits Display */}
      <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
        <span className="text-xs text-gray-600">Credits:</span>
        <span className="text-sm font-medium text-gray-900">
          {userProfile?.scan_credits || 0}
        </span>
      </div>

      {/* Subscription Status */}
      {userProfile?.subscription_status === 'active' && (
        <div className="hidden sm:flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Pro
          </span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-4">
        <Link 
          href="/dashboard" 
          className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          Dashboard
        </Link>
        <Link 
          href="/pricing" 
          className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          Pricing
        </Link>
      </nav>

      {/* User Button */}
      <UserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "w-8 h-8"
          }
        }}
      />
    </div>
  )
}