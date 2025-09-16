'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { createClerkSupabaseClient, UserProfile, getSubscriptionDisplayName, canAccessFeature } from "@/lib/supabase"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.scansnap.io"

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProfile()
    }
  }, [isLoaded, user])

  const fetchUserProfile = async () => {
    const supabase = createClerkSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', user?.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
    } else {
      setUserProfile(data)
    }
    setLoading(false)
  }

  const handleLaunchApp = () => {
    if (!userProfile) return;
    
    // Pass user data to app.scansnap.io via URL params or localStorage
    const userData = {
      clerk_user_id: userProfile.clerk_user_id,
      subscription_status: userProfile.subscription_status,
      subscription_plan: userProfile.subscription_plan,
      email: userProfile.email,
      first_name: userProfile.first_name,
      last_name: userProfile.last_name
    };
    
    // Store in localStorage for app to read
    localStorage.setItem('scansnap_user_data', JSON.stringify(userData));
    
    // Open app
    window.open(appUrl, '_blank');
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <Link href="/" className="btn primary">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3">
                <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" style={{ height: '32px' }} />
                <img className="mark mark-dark" src="/assets/favicon_1024_dark.png" alt="" style={{ height: '32px' }} />
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  ScanSnap Dashboard
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user.firstName || user.emailAddresses[0].emailAddress}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Welcome Section */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user.firstName || 'there'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your ScanSnap account is ready to go. Launch the app to start scanning.
              </p>
              <button
                onClick={handleLaunchApp}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
              >
                🚀 Launch ScanSnap App
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Subscription Status */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      userProfile?.subscription_status === 'basic' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-green-100 dark:bg-green-900'
                    }`}>
                      <span className={`text-sm font-medium ${
                        userProfile?.subscription_status === 'basic' ? 'text-gray-600 dark:text-gray-400' : 'text-green-800 dark:text-green-200'
                      }`}>
                        {userProfile?.subscription_status === 'basic' ? '○' : '✓'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Current Plan
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {getSubscriptionDisplayName(userProfile?.subscription_status || 'basic')}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">👤</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Account Status
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        Active
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Available */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-800 dark:text-purple-200">⚡</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Features Unlocked
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {userProfile ? getFeatureCount(userProfile) : '0'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Available Features */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Available Features</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {userProfile && (
                    <>
                      <FeatureItem 
                        name="Basic Scanning"
                        available={canAccessFeature(userProfile, 'basic_scanning')}
                        description="Scan standard barcodes with your camera"
                      />
                      <FeatureItem 
                        name="PDF Export"
                        available={canAccessFeature(userProfile, 'pdf_export')}
                        description="Export scans to PDF format"
                      />
                      <FeatureItem 
                        name="Catalog Import"
                        available={canAccessFeature(userProfile, 'catalog_import')}
                        description="Import CSV/Excel catalogs for verification"
                      />
                      <FeatureItem 
                        name="Verify Mode"
                        available={canAccessFeature(userProfile, 'verify_mode')}
                        description="Verify scans against imported data"
                      />
                      <FeatureItem 
                        name="Order Builder"
                        available={canAccessFeature(userProfile, 'order_builder')}
                        description="Build orders by scanning items"
                      />
                      <FeatureItem 
                        name="QR Codes"
                        available={canAccessFeature(userProfile, 'qr_codes')}
                        description="Scan QR codes and DataMatrix codes"
                      />
                      <FeatureItem 
                        name="Dot-Peen & Laser Marked"
                        available={canAccessFeature(userProfile, 'dot_peen')}
                        description="Advanced scanning for industrial codes"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <button
                    onClick={handleLaunchApp}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>🚀</span> Launch App
                  </button>
                  
                  <Link
                    href="/subscription"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>⚡</span> Manage Subscription
                  </Link>
                  
                  <Link
                    href="/purchases"
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>📄</span> View Purchases
                  </Link>
                  
                  <Link
                    href="/#pricing"
                    className="w-full border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>💎</span> Upgrade Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Prompt for Basic Users */}
          {userProfile?.subscription_status === 'basic' && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Unlock More Features
                  </h3>
                  <div className="mt-2 text-sm text-blue-800 dark:text-blue-300">
                    <p>
                      You're on the Basic plan. Upgrade to Plus or Pro to unlock catalog import, verify mode, order builder, and advanced scanning features.
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <Link
                        href="/#pricing"
                        className="bg-blue-100 dark:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium text-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Plans
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

interface FeatureItemProps {
  name: string
  available: boolean
  description: string
}

function FeatureItem({ name, available, description }: FeatureItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className={`text-sm ${available ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}>
            {available ? '✅' : '❌'}
          </span>
          <div>
            <p className={`font-medium ${available ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function getFeatureCount(userProfile: UserProfile): number {
  const allFeatures = [
    'basic_scanning',
    'pdf_export',
    'catalog_import',
    'verify_mode',
    'order_builder',
    'qr_codes',
    'datamatrix',
    'dot_peen'
  ]
  
  return allFeatures.filter(feature => canAccessFeature(userProfile, feature)).length
}