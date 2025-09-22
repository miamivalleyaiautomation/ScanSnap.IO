// app/actions/ensure-profile.ts
'use server'

import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function ensureUserProfile() {
  const { userId } = auth()
  
  if (!userId) {
    return { error: "Not authenticated" }
  }

  try {
    // Check if profile exists
    const { data: existing } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (existing) {
      return { data: existing }
    }

    // Get user from Clerk
    const { clerkClient } = await import("@clerk/nextjs/server")
    const user = await clerkClient.users.getUser(userId)

    // Create profile
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        clerk_user_id: userId,
        email: user.emailAddresses[0]?.emailAddress,
        first_name: user.firstName,
        last_name: user.lastName,
        profile_image_url: user.imageUrl,
        subscription_status: 'basic',
        subscription_plan: 'basic',
        app_preferences: {},
        onboarding_completed: false,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error('Error ensuring profile:', error)
    return { error: 'Failed to ensure profile exists' }
  }
}