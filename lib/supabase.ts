// lib/supabase.ts - Updated with Clerk JWT integration
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// =====================================================
// CLIENT-SIDE: Authenticated Supabase client with Clerk JWT
// Use this in client components and API routes for user operations
// =====================================================
export const createClerkSupabaseClient = async () => {
  const { getToken } = auth()
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options = {}) => {
        // Get Clerk JWT token for Supabase
        const clerkToken = await getToken({ template: 'supabase' })
        
        const headers = new Headers(options.headers)
        if (clerkToken) {
          headers.set('Authorization', `Bearer ${clerkToken}`)
        }

        return fetch(url, {
          ...options,
          headers,
        })
      },
    },
  })
}

// =====================================================
// SERVER-SIDE: Admin client for webhooks and system operations
// This bypasses RLS - use ONLY for:
// - Webhook handlers (Clerk, Lemon Squeezy)
// - System operations that need elevated privileges
// - Cross-user operations (admin features)
// =====================================================
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// =====================================================
// SERVER-SIDE: User-scoped client for API routes
// Use this in API routes that serve authenticated users
// Respects RLS policies
// =====================================================
export const createServerSupabaseClient = async () => {
  const { getToken } = auth()
  const token = await getToken({ template: 'supabase' })
  
  if (!token) {
    throw new Error('No authentication token available')
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

// =====================================================
// BROWSER CLIENT: For client-side operations
// Use in browser contexts where Clerk is available
// =====================================================
export const createBrowserSupabaseClient = (clerkToken: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  })
}

// =====================================================
// TYPES
// =====================================================
export interface UserProfile {
  id: string
  clerk_user_id: string
  email: string
  first_name?: string
  last_name?: string
  profile_image_url?: string
  subscription_status: 'basic' | 'plus' | 'pro' | 'pro_dpms' | 'cancelled' | 'expired'
  subscription_plan: string
  lemon_squeezy_customer_id?: string
  lemon_squeezy_subscription_id?: string
  subscription_expires_at?: string
  subscription_started_at?: string
  subscription_cancelled_at?: string
  app_preferences: Record<string, any>
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface Purchase {
  id: string
  user_id: string
  lemon_squeezy_order_id: string
  product_name: string
  variant_name?: string
  amount: number
  currency: string
  status: string
  purchase_date: string
  lemon_squeezy_data: Record<string, any>
}

export interface SubscriptionEvent {
  id: string
  user_id?: string
  event_type: string
  lemon_squeezy_subscription_id?: string
  lemon_squeezy_event_id?: string
  event_data: Record<string, any>
  processed_at: string
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================
export const canAccessFeature = (userProfile: UserProfile, feature: string): boolean => {
  const { subscription_status } = userProfile;
  
  if (feature === 'basic_scanning') return true;
  if (feature === 'pdf_export') return true;
  
  if (feature === 'catalog_import' || feature === 'verify_mode' || feature === 'order_builder') {
    return ['plus', 'pro', 'pro_dpms'].includes(subscription_status);
  }
  
  if (feature === 'qr_codes' || feature === 'datamatrix') {
    return ['pro', 'pro_dpms'].includes(subscription_status);
  }
  
  if (feature === 'dot_peen' || feature === 'laser_marked') {
    return subscription_status === 'pro_dpms';
  }
  
  return false;
}

export const getSubscriptionDisplayName = (status: string): string => {
  switch (status) {
    case 'basic': return 'Basic (Free)';
    case 'plus': return 'Plus';
    case 'pro': return 'Pro';
    case 'pro_dpms': return 'Pro + DPMS';
    case 'cancelled': return 'Cancelled';
    case 'expired': return 'Expired';
    default: return status;
  }
}