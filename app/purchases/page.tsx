'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { createClerkSupabaseClient, Purchase, UserProfile } from "@/lib/supabase"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

export default function PurchasesPage() {
  const { user, isLoaded } = useUser()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      fetchData()
    }
  }, [isLoaded, user])

  const fetchData = async () => {
    const supabase = createClerkSupabaseClient()
    
    try {
      // Get user profile first
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('clerk_user_id', user?.id)
        .single()

      if (profileError) {
        console.error('Error fetching user profile:', profileError)
      } else {
        setUserProfile(profile)
        
        // Get purchases
        const { data: purchaseData, error: purchaseError } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', profile.id)
          .order('purchase_date', { ascending: false })

        if (purchaseError) {
          console.error('Error fetching purchases:', purchaseError)
        } else {
          setPurchases(purchaseData || [])
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount / 100) // Convert cents to dollars
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
      case 'refunded':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
      case 'cancelled':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
    }
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
                  Purchase History
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
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Purchase History</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              View all your ScanSnap subscription purchases and transactions
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/subscription"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Manage Subscription
              </Link>
              <a
                href="https://app.lemonsqueezy.com/my-orders"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Lemon Squeezy Portal
              </a>
              <Link
                href="/#pricing"
                className="border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>

          {/* Purchases Table */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                All Purchases ({purchases.length})
              </h2>
            </div>
            
            {purchases.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No purchases yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  When you upgrade your plan, your purchases will appear here.
                </p>
                <div className="mt-6">
                  <Link
                    href="/subscription"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Choose a Plan
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Order ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {purchases.map((purchase) => (
                      <tr key={purchase.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {purchase.product_name}
                            </div>
                            {purchase.variant_name && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {purchase.variant_name}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatAmount(purchase.amount, purchase.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}
                          >
                            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(purchase.purchase_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">
                          #{purchase.lemon_squeezy_order_id.slice(-8)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Need Help with a Purchase?
            </h3>
            <p className="text-blue-800 dark:text-blue-300 mb-4">
              If you have questions about a specific purchase or need to request a refund, please contact our support team or access your Lemon Squeezy account directly.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:hello@scansnap.io?subject=Purchase Support"
                className="bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-200 px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="https://app.lemonsqueezy.com/my-orders"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lemon Squeezy Account
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}