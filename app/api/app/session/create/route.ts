// app/api/app/session/create/route.ts
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// CORS headers configuration
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'https://app.scansnap.io',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
}

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  console.log('🔧 CORS preflight request received for session create')
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  })
}

export async function POST() {
  try {
    console.log('🚀 Session creation started')
    
    const { userId } = auth()
    console.log('👤 Clerk User ID:', userId)
    
    if (!userId) {
      console.error('❌ No user ID from Clerk auth')
      return NextResponse.json({ error: "Not authenticated" }, { 
        status: 401,
        headers: CORS_HEADERS 
      })
    }
    
    // Query user profile from Supabase
    console.log('🔍 Querying user profile from Supabase...')
    const { data: profiles, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
    
    console.log('📊 Supabase query result:', { 
      profiles: profiles?.length || 0, 
      error: error?.message 
    })
    
    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { 
        status: 500,
        headers: CORS_HEADERS 
      })
    }
    
    if (!profiles || profiles.length === 0) {
      console.error('❌ No profile found for user:', userId)
      return NextResponse.json({ error: "Profile not found" }, { 
        status: 404,
        headers: CORS_HEADERS 
      })
    }
    
    const profile = profiles[0]
    console.log('✅ Profile found:', {
      id: profile.id,
      email: profile.email,
      subscription: profile.subscription_status,
      firstName: profile.first_name,
      lastName: profile.last_name
    })
    
    // Generate session token
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
    
    // Store session in Supabase app_sessions table
    const { error: sessionError } = await supabaseAdmin
      .from('app_sessions')
      .insert({
        session_token: sessionToken,
        user_id: userId,
        email: profile.email,
        first_name: profile.first_name || null,
        last_name: profile.last_name || null,
        subscription: profile.subscription_status || 'basic',
        dashboard_url: 'https://scansnap.io/dashboard',
        expires_at: expiresAt.toISOString()
      })
    
    if (sessionError) {
      console.error('❌ Error storing session:', sessionError)
      return NextResponse.json({ 
        error: "Failed to create session",
        details: sessionError.message 
      }, { 
        status: 500,
        headers: CORS_HEADERS 
      })
    }
    
    console.log('💾 Session stored with token:', sessionToken.substring(0, 20) + '...')
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.scansnap.io'
    console.log('🎯 App URL:', appUrl)
    
    const response = { 
      success: true,
      sessionToken,
      appUrl,
      session: {
        userId,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        subscription: profile.subscription_status || 'basic',
        dashboardUrl: 'https://scansnap.io/dashboard',
        expiresAt: expiresAt.toISOString()
      }
    }
    
    console.log('✅ Session creation successful')
    return NextResponse.json(response, {
      status: 200,
      headers: CORS_HEADERS
    })
    
  } catch (error) {
    console.error('💥 Session creation error:', error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500,
      headers: CORS_HEADERS
    })
  }
}

// GET endpoint to check active sessions (for debugging)
export async function GET() {
  try {
    // Clean up expired sessions
    await supabaseAdmin
      .from('app_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString())
    
    // Get recent sessions
    const { data: sessions, error } = await supabaseAdmin
      .from('app_sessions')
      .select('session_token, email, subscription, expires_at, created_at')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      return NextResponse.json({
        error: "Failed to fetch sessions",
        details: error.message
      }, {
        status: 500,
        headers: CORS_HEADERS
      })
    }
    
    const sessionList = sessions?.map(s => ({
      token: s.session_token.substring(0, 20) + '...',
      email: s.email,
      subscription: s.subscription,
      expiresAt: s.expires_at,
      createdAt: s.created_at
    })) || []
    
    return NextResponse.json({
      activeSessionCount: sessions?.length || 0,
      sessions: sessionList
    }, {
      status: 200,
      headers: CORS_HEADERS
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({
      error: "Internal server error"
    }, {
      status: 500,
      headers: CORS_HEADERS
    })
  }
}