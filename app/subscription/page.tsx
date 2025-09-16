'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { createClerkSupabaseClient, UserProfile, getSubscriptionDisplayName } from "@/lib/supabase"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

// Plan configurations matching your existing structure
const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$0',
    interval: 'forever',
    description: 'Essential barcode scanning',
    features: [
      'Scan standard barcodes',
      'Manual barcode entry', 
      'Export to PDF, CSV, Excel',
      'Single user'
    ],
    variantEnv: 'NEXT_PUBLIC_LS_VARIANT_BASIC'
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$9.99',
    interval: 'month',
    description: 'Verification and order building',
    features: [
      'Everything in Basic',
      'Verify Mode: Import and verify delivery lists',
      'Order Builder: Upload catalogs, build orders',
      'Track quantities and discrepancies'
    ],
    variantEnv: 'NEXT_PUBLIC_LS_VARIANT_PLUS',
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro', 
    price: '$14.99',
    interval: 'month',
    description: 'Advanced code support',
    features: [
      'Everything in Plus',
      'QR code scanning',
      'DataMatrix code scanning',
      'Ideal for modern packaging'
    ],
    variantEnv: 'NEXT_PUBLIC_LS_VARIANT_PRO'
  },
  {
    id: 'pro_dpms',
    name: 'Pro + DPMS',
    price: '$49.99', 
    interval: 'month',
    description: 'Specialized algorithms for industrial codes',
    features: [
      'Everything in Pro',
      'Dot-peen marked codes',
      'Laser-etched difficult marks',
      'Custom scanning algorithms'
    ],
    variantEnv: 'NEXT_PUBLIC_LS_VARIANT_PRO_DPMS'
  }
]

export default function SubscriptionPage() {
  const { user, isLoaded } = useUser()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

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

  const handleUpgrade = (plan: typeof PLANS[0]) => {
    if (!user) {
      alert('Please sign in to upgrade')
      return
    }

    if (plan.id === 'basic') {
      alert('You are already on the Basic plan')
      return
    }

    const variantId = process.env[plan.variantEnv as keyof typeof process.env]
    if (!variantId) {
      alert('Checkout not configured for this plan')
      return
    }

    // Construct Lemon Squeezy checkout URL with user data
    const checkoutUrl = `https://app.lemonsqueezy.com/checkout/buy/${variantId}?` + 
      new URLSearchParams({
        'checkout[email]': user.emailAddresses[0].emailAddress,
        'checkout[custom][clerk_user_id]': user.id,
        'checkout[custom][user_name]': `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }).toString()

    window.open(checkoutUrl, '_blank')
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
              <Link href="/dashboard" className="flex items-center gap-3">
                <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" style={{ height: '32px' }} />
                <img className="mark mark-dark" src="/assets/favicon_1024_dark.png" alt="" style={{ height: '32px' }} />
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  Subscription
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                ← Back to Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Current Plan Status */}
          {userProfile && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Current Plan
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {getSubscriptionDisplayName(userProfile.subscription_status)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Status: <span className="capitalize">{userProfile.subscription_status}</span>
                  </p>
                  {userProfile.subscription_expires_at && (
                    <p className="text-gray-600 dark:text-gray-300">
                      {userProfile.subscription_status === 'cancelled' ? 'Expires' : 'Renews'}: {' '}
                      {new Date(userProfile.subscription_expires_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {userProfile.subscription_status !== 'basic' && userProfile.lemon_squeezy_subscription_id && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Manage your subscription directly with Lemon Squeezy
                    </p>
                    <a
                      href={`https://app.lemonsqueezy.com/my-orders`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Manage Subscription
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Available Plans */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Choose Your Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 ${
                    plan.popular 
                      ? 'border-blue-500' 
                      : userProfile?.subscription_status === plan.id
                      ? 'border-green-500'
                      : 'border-gray-200 dark:border-gray-700'
                  } relative`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  {userProfile?.subscription_status === plan.id && (
                    <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Current
                      </span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      {plan.interval !== 'forever' && (
                        <span className="text-gray-600 dark:text-gray-300">
                          /{plan.interval}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {plan.description}
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {userProfile?.subscription_status === plan.id ? (
                      <button
                        disabled
                        className="w-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed"
                      >
                        Current Plan
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(plan)}
                        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                          plan.popular
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-800 hover:bg-gray-900 text-white dark:bg-gray-600 dark:hover:bg-gray-500'
                        }`}
                      >
                        {plan.id === 'basic' ? 'Downgrade' : 'Upgrade'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Need Help?
            </h3>
            <p className="text-blue-800 dark:text-blue-300 mb-4">
              Have questions about which plan is right for you? Contact our sales team for personalized recommendations.
            </p>
            <div className="flex gap-4">
              <a
                href="mailto:hello@scansnap.io"
                className="bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-200 px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
              >
                Contact Sales
              </a>
              <Link
                href="/purchases"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Purchase History
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}