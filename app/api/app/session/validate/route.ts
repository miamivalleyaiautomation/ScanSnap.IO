// app/api/app/session/validate/route.ts
import { NextRequest, NextResponse } from "next/server"
import { sessions, cleanupExpiredSessions } from "../session-store"

// CORS headers - ensure app.scansnap.io is allowed
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'https://app.scansnap.io',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
}

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  console.log('🔧 CORS preflight request received for session validation')
  console.log('Origin:', request.headers.get('origin'))
  
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  })
}

// Make this accessible via GET for easier cross-domain access
export async function GET(request: NextRequest) {
  console.log('🔐 Session validation via GET')
  
  try {
    cleanupExpiredSessions()
    
    // Get session token from query params
    const { searchParams } = new URL(request.url)
    const sessionToken = searchParams.get('token')
    
    console.log('🎫 Token received:', sessionToken ? sessionToken.substring(0, 20) + '...' : 'None')
    
    if (!sessionToken) {
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
    
    if (!session) {
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
    
    if (now > expiresAt) {
      sessions.delete(sessionToken)
      return NextResponse.json({ 
        success: false, 
        error: "Session expired" 
      }, { 
        status: 401,
        headers: CORS_HEADERS 
      })
    }
    
    return NextResponse.json({
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
    }, {
      status: 200,
      headers: CORS_HEADERS
    })
    
  } catch (error) {
    console.error('💥 Session validation error:', error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, {
      status: 500,
      headers: CORS_HEADERS
    })
  }
}

// Keep POST method for backward compatibility
export async function POST(request: NextRequest) {
  console.log('🔐 Session validation via POST')
  
  try {
    cleanupExpiredSessions()
    
    const body = await request.json()
    const { sessionToken } = body
    
    if (!sessionToken) {
      return NextResponse.json({ 
        success: false, 
        error: "No session token provided" 
      }, { 
        status: 400,
        headers: CORS_HEADERS 
      })
    }
    
    const session = sessions.get(sessionToken)
    
    if (!session) {
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
    
    if (now > expiresAt) {
      sessions.delete(sessionToken)
      return NextResponse.json({ 
        success: false, 
        error: "Session expired" 
      }, { 
        status: 401,
        headers: CORS_HEADERS 
      })
    }
    
    return NextResponse.json({
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
    }, {
      status: 200,
      headers: CORS_HEADERS
    })
    
  } catch (error) {
    console.error('💥 Session validation error:', error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, {
      status: 500,
      headers: CORS_HEADERS
    })
  }
}