// app/api/app/session/create/route.ts
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Simple session storage (in production, use Redis or database)
const sessions = new Map<string, any>()

export async function POST(request: NextRequest) {
  console.log('🔐 Session create endpoint called')
  
  try {
    // 1. Verify user is authenticated
    const { userId } = auth()
    console.log('🔐 Auth check - User ID:', userId)
    
    if (!userId) {
      console.log('❌ No user ID found')
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // 2. Get user profile from Supabase
    console.log('📊 Fetching user profile from Supabase...')
    const { data: profiles, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
    
    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('❌ No profile found for user:', userId)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }
    
    const profile = profiles[0]
    console.log('✅ Profile found:', {
      email: profile.email,
      subscription: profile.subscription_status
    })
    
    // 3. Generate session token
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    
    // 4. Create session data
    const sessionData = {
      userId: userId,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      subscription: profile.subscription_status || 'basic',
      dashboardUrl: process.env.NEXT_PUBLIC_PORTAL_URL || 'https://scansnap.io/dashboard',
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    }
    
    // 5. Store session (in-memory for now, use Redis in production)
    sessions.set(sessionToken, sessionData)
    console.log('✅ Session created:', sessionToken)
    console.log('📦 Session data:', sessionData)
    
    // Clean up expired sessions
    setTimeout(() => {
      sessions.delete(sessionToken)
      console.log('🧹 Session expired and removed:', sessionToken)
    }, 30 * 60 * 1000)
    
    return NextResponse.json({ 
      success: true,
      sessionToken,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://app.scansnap.io'
    })
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Debug endpoint to check sessions
export async function GET() {
  console.log('📊 Active sessions:', sessions.size)
  
  // Don't expose actual session data in production
  const sessionList = Array.from(sessions.keys()).map(key => ({
    token: key.substring(0, 20) + '...',
    createdAt: sessions.get(key)?.createdAt
  }))
  
  return NextResponse.json({ 
    activeSessionCount: sessions.size,
    sessions: sessionList
  })
}