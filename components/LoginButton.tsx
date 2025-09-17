'use client'

import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { useState } from "react"

export default function LoginButton() {
  const [showModal, setShowModal] = useState(false)

  if (showModal) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          {/* Modal */}
          <div 
            className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 relative z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal content */}
            <div className="text-center">
              <div className="mb-6">
                <img className="mark mark-light mx-auto mb-4" src="/assets/favicon_1024_light.png" alt="" style={{ height: '48px' }} />
                <img className="mark mark-dark mx-auto mb-4" src="/assets/favicon_1024_dark.png" alt="" style={{ height: '48px' }} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to ScanSnap
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose how you'd like to get started
                </p>
              </div>

              <div className="space-y-4">
                <SignInButton mode="modal">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="w-full border border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors">
                    Create Account
                  </button>
                </SignUpButton>
              </div>

              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <button 
      className="chip primary" 
      onClick={() => setShowModal(true)}
      type="button"
    >
      Login
    </button>
  )
}