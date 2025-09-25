// app/api/app/session/create/route.ts - FIXED VERSION with CORS support
import { auth } from “@clerk/nextjs/server”
import { NextRequest, NextResponse } from “next/server”
import { supabaseAdmin } from “@/lib/supabase”
import { sessions, cleanupExpiredSessions, type SessionData } from “../session-store”

// CORS headers configuration
const CORS_HEADERS = {
‘Access-Control-Allow-Origin’: process.env.NEXT_PUBLIC_APP_URL || ‘https://app.scansnap.io’,
‘Access-Control-Allow-Methods’: ‘GET, POST, OPTIONS’,
‘Access-Control-Allow-Headers’: ‘Content-Type, Authorization, X-Requested-With, Accept, Origin’,
‘Access-Control-Allow-Credentials’: ‘true’,
‘Access-Control-Max-Age’: ‘86400’,
}

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
console.log(‘🔧 CORS preflight request received for session create’)
return new NextResponse(null, {
status: 200,
headers: CORS_HEADERS,
})
}

export async function POST() {
try {
console.log(‘🚀 Session creation started’)
cleanupExpiredSessions()

```
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

const sessionData: SessionData = {
  userId: userId,
  email: profile.email,
  firstName: profile.first_name || undefined,
  lastName: profile.last_name || undefined,
  subscription: profile.subscription_status || 'basic',
  dashboardUrl: 'https://scansnap.io/dashboard',
  createdAt: new Date().toISOString(),
  expiresAt: expiresAt.toISOString()
}

// Store session in memory
sessions.set(sessionToken, sessionData)
console.log('💾 Session stored with token:', sessionToken.substring(0, 20) + '...')
console.log('📋 Session data:', {
  userId: sessionData.userId,
  email: sessionData.email,
  subscription: sessionData.subscription,
  expiresAt: sessionData.expiresAt
})

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.scansnap.io'
console.log('🎯 App URL:', appUrl)

const response = { 
  success: true,
  sessionToken,
  appUrl,
  session: {
    userId: sessionData.userId,
    email: sessionData.email,
    firstName: sessionData.firstName,
    lastName: sessionData.lastName,
    subscription: sessionData.subscription,
    dashboardUrl: sessionData.dashboardUrl,
    expiresAt: sessionData.expiresAt
  }
}

console.log('✅ Session creation successful')
return NextResponse.json(response, {
  status: 200,
  headers: CORS_HEADERS
})
```

} catch (error) {
console.error(‘💥 Session creation error:’, error)
return NextResponse.json({
error: “Internal server error”,
details: error instanceof Error ? error.message : ‘Unknown error’
}, {
status: 500,
headers: CORS_HEADERS
})
}
}

export async function GET() {
cleanupExpiredSessions()
console.log(‘📊 Active sessions:’, sessions.size)

// Return session info for debugging
const sessionList = Array.from(sessions.entries()).map(([token, data]) => ({
token: token.substring(0, 20) + ‘…’,
email: data.email,
subscription: data.subscription,
expiresAt: data.expiresAt,
userId: data.userId
}))

return NextResponse.json({
activeSessionCount: sessions.size,
sessions: sessionList
}, {
status: 200,
headers: CORS_HEADERS
})
}
