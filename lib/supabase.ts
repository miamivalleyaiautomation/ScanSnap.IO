import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser usage with Clerk integration
export const createClerkSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      // Get the custom Supabase token from Clerk
      fetch: async (url, options = {}) => {
        const clerkToken = await window.Clerk?.session?.getToken({
          template: 'supabase',
        })

        // Insert the Clerk Supabase token into the headers
        const headers = new Headers(options?.headers)
        headers.set('Authorization', `Bearer ${clerkToken}`)

        // Now call the default fetch
        return fetch(url, {
          ...options,
          headers,
        })
      },
    },
  })
}

// Server-side client with service key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Regular client for server components
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface UserProfile {
  id: string
  clerk_user_id: string
  email: string
  first_name?: string
  last_name?: string
  profile_image_url?: string
  subscription_status: 'free' | 'active' | 'cancelled' | 'expired'
  subscription_plan: string
  lemon_squeezy_customer_id?: string
  lemon_squeezy_subscription_id?: string
  subscription_expires_at?: string
  scan_credits: number
  total_scans_used: number
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface Scan {
  id: string
  user_id: string
  file_name: string
  file_size?: number
  scan_type: string
  processing_status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
}