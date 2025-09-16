'use client'

import { useUser } from "@clerk/nextjs"
import { useUserProfile } from "@/hooks/useUserProfile"

interface PricingPlan {
  name: string
  price: number
  interval: string
  features: string[]
  lemonsqueezyUrl: string
  popular?: boolean
}

const plans: PricingPlan[] = [
  {
    name: "Free",
    price: 0,
    interval: "forever",
    features: [
      "10 scans per month",
      "Basic OCR",
      "PDF output",
      "Email support"
    ],
    lemonsqueezyUrl: "",
  },
  {
    name: "Pro",
    price: 19,
    interval: "month",
    popular: true,
    features: [
      "1,000 scans per month",
      "Advanced AI OCR",
      "Multiple output formats",
      "Batch processing",
      "Priority support",
      "API access"
    ],
    lemonsqueezyUrl: "https://scansnap.lemonsqueezy.com/checkout/buy/YOUR_VARIANT_ID",
  },
  {
    name: "Enterprise",
    price: 99,
    interval: "month",
    features: [
      "Unlimited scans",
      "Premium AI features",
      "Custom integrations",
      "White-label options",
      "Dedicated support",
      "SLA guarantee"
    ],
    lemonsqueezyUrl: "https://scansnap.lemonsqueezy.com/checkout/buy/YOUR_ENTERPRISE_VARIANT_ID",
  }
]

export default function PricingPage() {
  const { user } = useUser()
  const { userProfile, isSubscribed } = useUserProfile()

  const handleUpgrade = (plan: PricingPlan) => {
    if (!user) {
      // Redirect to sign in
      window.location.href = '/sign-in'
      return
    }

    if (plan.price === 0) {
      // Already on free plan
      return
    }

    // Add clerk_user_id to the checkout URL
    const checkoutUrl = `${plan.lemonsqueezyUrl}?checkout[custom][clerk_user_id]=${user.id}`
    window.open(checkoutUrl, '_blank')
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Scale your document processing with AI-powered scanning
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg shadow-md divide-y divide-gray-200 ${
                plan.popular 
                  ? 'border-2 border-blue-500 bg-white' 
                  : 'border border-gray-200 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-blue-500 text-white">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">
                    ${plan.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold">
                    /{plan.interval}
                  </span>
                </div>
                <p className="mt-5 text-lg text-gray-500">
                  Perfect for {plan.name.toLowerCase()} users
                </p>
              </div>

              <div className="pt-6 pb-8 px-6">
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {userProfile?.subscription_plan === plan.name.toLowerCase() ? (
                    <button
                      disabled
                      className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-md text-sm font-medium cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan)}
                      className={`w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium ${
                        plan.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-800 text-white hover:bg-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200`}
                    >
                      {plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Subscription Status */}
        {user && userProfile && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow px-6 py-4 max-w-2xl mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your Current Plan
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    {userProfile.subscription_plan || 'Free'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    Status: {userProfile.subscription_status}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium text-gray-900">
                    {userProfile.scan_credits} scans left
                  </div>
                  <div className="text-sm text-gray-500">
                    {userProfile.total_scans_used} total scans used
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}