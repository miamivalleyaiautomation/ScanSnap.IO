'use client'

import { useUser } from "@clerk/nextjs"
import Link from "next/link"

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser()

  console.log('Dashboard - isLoaded:', isLoaded)
  console.log('Dashboard - isSignedIn:', isSignedIn)
  console.log('Dashboard - user:', user)

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <h1>Please sign in</h1>
          <Link href="/">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Info</h2>
          <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Email:</strong> {user?.emailAddresses?.[0]?.emailAddress}</p>
          <p><strong>User ID:</strong> {user?.id}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
          <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'}</p>
          <p><strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}</p>
        </div>

        <div className="mt-6">
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}