import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { createClerkSupabaseClient, UserProfile } from "@/lib/supabase"

export function useUserProfile() {
  const { user, isLoaded } = useUser()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProfile()
    } else if (isLoaded && !user) {
      setLoading(false)
    }
  }, [isLoaded, user])

  const fetchUserProfile = async () => {
    try {
      const supabase = createClerkSupabaseClient()
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('clerk_user_id', user?.id)
        .single()

      if (error) {
        throw error
      }

      setUserProfile(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching user profile:', err)
      setError('Failed to load user profile')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return

    try {
      const supabase = createClerkSupabaseClient()
      
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('clerk_user_id', user.id)

      if (error) {
        throw error
      }

      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...updates } : null)
    } catch (err) {
      console.error('Error updating profile:', err)
      throw err
    }
  }

  const canScan = () => {
    return userProfile?.scan_credits && userProfile.scan_credits > 0
  }

  const isSubscribed = () => {
    return userProfile?.subscription_status === 'active'
  }

  const deductScanCredit = async () => {
    if (!userProfile || userProfile.scan_credits <= 0) {
      throw new Error('No scan credits remaining')
    }

    await updateProfile({
      scan_credits: userProfile.scan_credits - 1,
      total_scans_used: userProfile.total_scans_used + 1
    })
  }

  return {
    user,
    userProfile,
    loading,
    error,
    isLoaded,
    updateProfile,
    refetch: fetchUserProfile,
    canScan,
    isSubscribed,
    deductScanCredit
  }
}