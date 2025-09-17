'use client'

import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function LoginButton() {
  const [showModal, setShowModal] = useState(false)

  // Handle body class and header glass effect when modal opens/closes
  useEffect(() => {
    if (showModal) {
      // Add class to disable header glass effect
      document.body.classList.add('modal-open')
      const header = document.querySelector('.site-header')
      if (header) {
        header.classList.add('glass-disable')
      }
    } else {
      // Remove classes when modal closes
      document.body.classList.remove('modal-open')
      const header = document.querySelector('.site-header')
      if (header) {
        header.classList.remove('glass-disable')
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open')
      const header = document.querySelector('.site-header')
      if (header) {
        header.classList.remove('glass-disable')
      }
    }
  }, [showModal])

  // Also listen for Clerk modal state changes
  useEffect(() => {
    const handleClerkModalChange = () => {
      const clerkModal = document.querySelector('.cl-modal, .cl-signIn, .cl-signUp')
      const header = document.querySelector('.site-header')
      
      if (clerkModal && header) {
        header.classList.add('glass-disable')
      } else if (header) {
        header.classList.remove('glass-disable')
      }
    }

    // Watch for DOM changes that might indicate Clerk modal appearance
    const observer = new MutationObserver(handleClerkModalChange)
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      attributeFilter: ['class', 'role']
    })

    return () => observer.disconnect()
  }, [])

  if (showModal) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          {/* Modal */}
          <div 
            className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 relative z-[1000]"
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