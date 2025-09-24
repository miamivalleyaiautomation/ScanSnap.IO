// app/api/app/session/validate/route.ts
import { NextRequest, NextResponse } from "next/server"

// Import the sessions map (in production, use shared storage)
// For now, we'll validate against the same in-memory store
const sessions = new Map<string, any>()

export async function POST(request: NextRequest) {
  console.log('🔍 Session validate endpoint called')
  
  try {
    const body = await request.json()
    const { sessionToken } = body
    
    console.log('🔍 Validating token:', sessionToken?.substring(0, 20) + '...')
    
    if (!sessionToken) {
      console.log('❌ No session token provided')
      return NextResponse.json({ error: "No session token" }, { status: 400 })
    }
    
    // Get session from storage
    const session = sessions.get(sessionToken)
    
    if (!session) {
      console.log('❌ Session not found')
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }
    
    // Check expiration
    const now = new Date()
    const expiresAt = new Date(session.expiresAt)
    
    if (now > expiresAt) {
      console.log('❌ Session expired')
      sessions.delete(sessionToken)
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }
    
    console.log('✅ Session valid for:', session.email)
    console.log('📦 Subscription:', session.subscription)
    
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
    })
    
  } catch (error) {
    console.error('❌ Validation error:', error)
    return NextResponse.json({ 
      error: "Validation failed",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}