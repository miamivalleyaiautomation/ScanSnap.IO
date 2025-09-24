// app/api/app/session/create/route.ts
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { sessions, cleanupExpiredSessions, type SessionData } from "../session-store"

export async function POST() {
  try {
    cleanupExpiredSessions()
    
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { data: profiles, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
    
    if (error || !profiles || profiles.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }
    
    const profile = profiles[0]
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000)
    
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
    
    sessions.set(sessionToken, sessionData)
    
    return NextResponse.json({ 
      success: true,
      sessionToken,
      appUrl: 'https://app.scansnap.io'
    })
  } catch (error) {
    return NextResponse.json({ 
      error: "Internal server error"
    }, { status: 500 })
  }
}

export async function GET() {
  cleanupExpiredSessions()
  return NextResponse.json({ 
    activeSessionCount: sessions.size
  })
}