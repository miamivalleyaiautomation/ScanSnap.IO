// app/api/app/session/validate/route.ts - FIXED VERSION with proper CORS handling
import { NextRequest, NextResponse } from “next/server”
import { sessions, cleanupExpiredSessions } from “../session-store”

// CORS headers configuration
const CORS_HEADERS = {
‘Access-Control-Allow-Origin’: process.env.NEXT_PUBLIC_APP_URL || ‘https://app.scansnap.io’,
‘Access-Control-Allow-Methods’: ‘POST, OPTIONS’,
‘Access-Control-Allow-Headers’: ‘Content-Type, Authorization, X-Requested-With, Accept, Origin’,
‘Access-Control-Allow-Credentials’: ‘true’,
‘Access-Control-Max-Age’: ‘86400’,
}

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
console.log(‘🔧 CORS preflight request received’)
console.log(‘Origin:’, request.headers.get(‘origin’))

return new NextResponse(null, {
status: 200,
headers: CORS_HEADERS,
})
}

export async function POST(request: NextRequest) {
console.log(‘🔐 Session validation started’)
console.log(‘Origin:’, request.headers.get(‘origin’))

try {
cleanupExpiredSessions()

```
const body = await request.json()
const { sessionToken } = body

console.log('🎫 Token received:', sessionToken ? sessionToken.substring(0, 20) + '...' : 'None')

if (!sessionToken) {
  console.error('❌ No session token provided')
  return NextResponse.json({ 
    success: false, 
    error: "No session token provided" 
  }, { 
    status: 400,
    headers: CORS_HEADERS 
  })
}

const session = sessions.get(sessionToken)
console.log('🔍 Session lookup result:', session ? 'Found' : 'Not found')
console.log('📊 Total active sessions:', sessions.size)

if (!session) {
  console.error('❌ Invalid session token')
  // List first few characters of all active sessions for debugging
  const activeSessions = Array.from(sessions.keys()).map(key => key.substring(0, 20) + '...')
  console.log('🔍 Active sessions:', activeSessions)
  
  return NextResponse.json({ 
    success: false, 
    error: "Invalid or expired session" 
  }, { 
    status: 401,
    headers: CORS_HEADERS 
  })
}

const now = new Date()
const expiresAt = new Date(session.expiresAt)

console.log('⏰ Time check:', {
  now: now.toISOString(),
  expiresAt: expiresAt.toISOString(),
  isExpired: now > expiresAt
})

if (now > expiresAt) {
  console.warn('⚠️ Session expired, removing from store')
  sessions.delete(sessionToken)
  return NextResponse.json({ 
    success: false, 
    error: "Session expired" 
  }, { 
    status: 401,
    headers: CORS_HEADERS 
  })
}

console.log('✅ Session validation successful')
console.log('👤 User info:', {
  userId: session.userId,
  email: session.email,
  subscription: session.subscription
})

const response = { 
  success: true,
  session: {
    userId: session.userId,
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
    subscription: session.subscription,
    dashboardUrl: session.dashboardUrl,
    expiresAt: session.expiresAt
  }
}

return NextResponse.json(response, {
  status: 200,
  headers: CORS_HEADERS
})
```

} catch (error) {
console.error(‘💥 Session validation error:’, error)
return NextResponse.json({
success: false,
error: “Validation failed”,
details: error instanceof Error ? error.message : ‘Unknown error’
}, {
status: 500,
headers: CORS_HEADERS
})
}
}
