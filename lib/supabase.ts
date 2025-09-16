import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Extend Window type to include Clerk
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: (options: { template: string }) => Promise<string | null>
      }
    }
  }
}

// Client for browser usage with Clerk integration
export const createClerkSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      // Get the custom Supabase token from Clerk
      fetch: async (url, options = {}) => {
        let clerkToken = null
        
        // Only try to get Clerk token if we're in browser and Clerk is available
        if (typeof window !== 'undefined' && window.Clerk?.session?.getToken) {
          try {
            clerkToken = await window.Clerk.session.getToken({
              template: 'supabase',
            })
          } catch (error) {
            console.warn('Failed to get Clerk token:', error)
          }
        }

        // Insert the Clerk Supabase token into the headers if available
        const headers = new Headers(options?.headers)
        if (clerkToken) {
          headers.set('Authorization', `Bearer ${clerkToken}`)
        }

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
  subscription_status: 'basic' | 'plus' | 'pro' | 'pro_dpms' | 'cancelled' | 'expired'
  subscription_plan: string
  lemon_squeezy_customer_id?: string
  lemon_squeezy_subscription_id?: string
  subscription_expires_at?: string
  subscription_started_at?: string
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

// Helper functions for subscription checks
export const canAccessFeature = (userProfile: UserProfile, feature: string): boolean => {
  const { subscription_status } = userProfile;
  
  // Basic features available to all
  if (feature === 'basic_scanning') return true;
  if (feature === 'pdf_export') return true;
  
  // Plus features
  if (feature === 'catalog_import' || feature === 'verify_mode' || feature === 'order_builder') {
    return ['plus', 'pro', 'pro_dpms'].includes(subscription_status);
  }
  
  // Pro features
  if (feature === 'qr_codes' || feature === 'datamatrix') {
    return ['pro', 'pro_dpms'].includes(subscription_status);
  }
  
  // Pro + DPMS features
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