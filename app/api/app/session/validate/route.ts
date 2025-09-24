// app/api/app/session/validate/route.ts
import { NextRequest, NextResponse } from "next/server"
import { sessions, cleanupExpiredSessions } from "../session-store"

export async function POST(request: NextRequest) {
  try {
    cleanupExpiredSessions()
    
    const body = await request.json()
    const { sessionToken } = body
    
    if (!sessionToken) {
      return NextResponse.json({ error: "No session token" }, { status: 400 })
    }
    
    const session = sessions.get(sessionToken)
    
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }
    
    const now = new Date()
    const expiresAt = new Date(session.expiresAt)
    
    if (now > expiresAt) {
      sessions.delete(sessionToken)
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
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
    })
  } catch (error) {
    return NextResponse.json({ 
      error: "Validation failed"
    }, { status: 500 })
  }
}