// components/LoginButton.tsx
'use client'

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { useState } from "react"

export default function LoginButton({ className = "" }: { className?: string }) {
  const { isSignedIn } = useUser()
  const [showOptions, setShowOptions] = useState(false)

  // Don't show login if user is already signed in
  if (isSignedIn) {
    return null
  }

  return (
    <div className="relative">
      <button 
        className={`chip primary ${className}`}
        onClick={() => setShowOptions(!showOptions)}
      >
        Login
      </button>

      {showOptions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setShowOptions(false)}
          />
          
          {/* Options Menu */}
          <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[200px] z-50">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                Welcome to ScanSnap
              </h3>
              
              <SignInButton mode="modal">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="w-full border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors">
                  Create Account
                </button>
              </SignUpButton>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}