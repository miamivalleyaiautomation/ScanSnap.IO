// components/LoginButton.tsx
'use client'

import { useUser } from "@clerk/nextjs"
import Link from "next/link"

export default function LoginButton({ 
  className = "", 
  isMobile = false 
}: { 
  className?: string, 
  isMobile?: boolean 
}) {
  const { isSignedIn } = useUser()

  // Don't show login if user is already signed in
  if (isSignedIn) {
    return null
  }

  // Mobile menu link
  if (isMobile) {
    return (
      <Link 
        href="/login"
        className="menu-link"
        style={{ 
          display: 'block',
          textAlign: 'center'
        }}
      >
        Login
      </Link>
    )
  }

  // Desktop button
  return (
    <Link 
      href="/login"
      className={`chip primary ${className}`}
    >
      Login
    </Link>
  )
}