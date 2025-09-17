“use client”

import { useUser } from “@clerk/nextjs”
import { useEffect, useState } from “react”
import { UserButton } from “@clerk/nextjs”
import Link from “next/link”

interface UserProfile {
id: string
clerk_user_id: string
email: string
first_name?: string
last_name?: string
subscription_status: string
subscription_plan: string
created_at: string
}

export default function Dashboard() {
const { user, isLoaded } = useUser()
const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const appUrl = process.env.NEXT_PUBLIC_APP_URL || “https://app.scansnap.io”

useEffect(() => {
if (isLoaded && user) {
fetchUserProfile()
}
}, [isLoaded, user])

const fetchUserProfile = async () => {
try {
console.log(“Fetching user profile for:”, user?.id)

```
  const { createClient } = await import("@supabase/supabase-js")
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  console.log("Supabase URL:", supabaseUrl)
  console.log("Supabase Key exists:", !!supabaseAnonKey)
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("clerk_user_id", user?.id)
    .single()

  console.log("Supabase response - data:", data)
  console.log("Supabase response - error:", error)

  if (error) {
    console.error("Error fetching user profile:", error)
    setError(`Database error: ${error.message}`)
  } else {
    setUserProfile(data)
    console.log("User profile loaded successfully:", data)
  }
} catch (err) {
  console.error("Error in fetchUserProfile:", err)
  setError(`Failed to load profile: ${err}`)
} finally {
  setLoading(false)
}
```

}

const handleLaunchApp = () => {
if (!userProfile) return;

```
const userData = {
  clerk_user_id: userProfile.clerk_user_id,
  subscription_status: userProfile.subscription_status,
  subscription_plan: userProfile.subscription_plan,
  email: userProfile.email,
  first_name: userProfile.first_name,
  last_name: userProfile.last_name
};

localStorage.setItem("scansnap_user_data", JSON.stringify(userData));
window.open(appUrl, "_blank");
```

}

const getSubscriptionDisplayName = (status: string): string => {
switch (status) {
case “basic”: return “Basic (Free)”;
case “plus”: return “Plus”;
case “pro”: return “Pro”;
case “pro_dpms”: return “Pro + DPMS”;
case “cancelled”: return “Cancelled”;
case “expired”: return “Expired”;
default: return status;
}
}

if (!isLoaded || loading) {
return (
<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
<div className="text-center">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
<p>Loading dashboard…</p>
</div>
</div>
)
}

if (!user) {
return (
<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
<div className="text-center">
<h1 className="text-2xl font-bold mb-4">Please sign in</h1>
<Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded">Go Home</Link>
</div>
</div>
)
}

if (error) {
return (
<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
<div className="text-center max-w-md">
<h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Dashboard</h1>
<p className="text-gray-600 mb-4">{error}</p>
<div className="space-x-4">
<button
onClick={() => window.location.reload()}
className=“bg-blue-600 text-white px-4 py-2 rounded”
>
Retry
</button>
<Link href="/" className="bg-gray-600 text-white px-4 py-2 rounded">Go Home</Link>
</div>
</div>
</div>
)
}

return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
<header className="bg-white dark:bg-gray-800 shadow">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex justify-between h-16">
<div className="flex items-center">
<Link href="/" className="flex items-center gap-3">
<img className=“mark mark-light” src=”/assets/favicon_1024_light.png” alt=”” style={{ height: “32px” }} />
<img className=“mark mark-dark” src=”/assets/favicon_1024_dark.png” alt=”” style={{ height: “32px” }} />
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

```
  <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div className="px-4 py-6 sm:px-0">
      
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.firstName || "there"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your ScanSnap account is ready to go. Launch the app to start scanning.
          </p>
          <button
            onClick={handleLaunchApp}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
          >
            Launch ScanSnap App
          </button>
        </div>
      </div>

      {userProfile ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    userProfile.subscription_status === "basic" ? "bg-gray-100 dark:bg-gray-700" : "bg-green-100 dark:bg-green-900"
                  }`}>
                    <span className={`text-sm font-medium ${
                      userProfile.subscription_status === "basic" ? "text-gray-600 dark:text-gray-400" : "text-green-800 dark:text-green-200"
                    }`}>
                      {userProfile.subscription_status === "basic" ? "O" : "Y"}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Current Plan
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {getSubscriptionDisplayName(userProfile.subscription_status)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">U</span>
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

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-200">D</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Member Since
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {new Date(userProfile.created_at).toLocaleDateString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8">
          <p className="text-yellow-800">
            Setting up your profile... This may take a moment for new accounts.
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleLaunchApp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>App</span> Launch App
            </button>
            
            <Link
              href="/subscription"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Sub</span> Manage Subscription
            </Link>
            
            <Link
              href="/purchases"
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Buy</span> View Purchases
            </Link>
            
            <Link
              href="/#pricing"
              className="w-full border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Up</span> Upgrade Plan
            </Link>
          </div>
        </div>
      </div>

      {userProfile?.subscription_status === "basic" && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
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
                  You are on the Basic plan. Upgrade to Plus or Pro to unlock catalog import, verify mode, order builder, and advanced scanning features.
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
```

)
}
