// app/api/app/session/validate/route.ts
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
  console.log('🔧 CORS preflight request received')
  console.log('Origin:', request.headers.get('origin'))
  
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  })
}

// GET method for cross-domain compatibility
export async function GET(request: NextRequest) {
  console.log('🔐 Session validation via GET')
  
  try {
    // Get session token from query params
    const { searchParams } = new URL(request.url)
    const sessionToken = searchParams.get('token')
    
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
    
    // Clean up expired sessions
    await supabaseAdmin
      .from('app_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString())
    
    // Get session from Supabase
    const { data: session, error } = await supabaseAdmin
      .from('app_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single()
    
    console.log('🔍 Session lookup result:', session ? 'Found' : 'Not found')
    
    if (error || !session) {
      console.error('❌ Invalid session token or expired')
      return NextResponse.json({ 
        success: false, 
        error: "Invalid or expired session" 
      }, { 
        status: 401,
        headers: CORS_HEADERS 
      })
    }
    
    console.log('✅ Session validation successful')
    console.log('👤 User info:', {
      userId: session.user_id,
      email: session.email,
      subscription: session.subscription
    })
    
    const response = { 
      success: true,
      session: {
        userId: session.user_id,
        email: session.email,
        firstName: session.first_name,
        lastName: session.last_name,
        subscription: session.subscription,
        dashboardUrl: session.dashboard_url,
        expiresAt: session.expires_at
      }
    }
    
    return NextResponse.json(response, {
      status: 200,
      headers: CORS_HEADERS
    })
    
  } catch (error) {
    console.error('💥 Session validation error:', error)
    return NextResponse.json({
      success: false,
      error: "Validation failed",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500,
      headers: CORS_HEADERS
    })
  }
}

// POST method for backward compatibility
export async function POST(request: NextRequest) {
  console.log('🔐 Session validation via POST')
  console.log('Origin:', request.headers.get('origin'))
  
  try {
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
    
    // Clean up expired sessions
    await supabaseAdmin
      .from('app_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString())
    
    // Get session from Supabase
    const { data: session, error } = await supabaseAdmin
      .from('app_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single()
    
    console.log('🔍 Session lookup result:', session ? 'Found' : 'Not found')
    
    if (error || !session) {
      console.error('❌ Invalid session token or expired')
      return NextResponse.json({ 
        success: false, 
        error: "Invalid or expired session" 
      }, { 
        status: 401,
        headers: CORS_HEADERS 
      })
    }
    
    console.log('✅ Session validation successful')
    console.log('👤 User info:', {
      userId: session.user_id,
      email: session.email,
      subscription: session.subscription
    })
    
    const response = { 
      success: true,
      session: {
        userId: session.user_id,
        email: session.email,
        firstName: session.first_name,
        lastName: session.last_name,
        subscription: session.subscription,
        dashboardUrl: session.dashboard_url,
        expiresAt: session.expires_at
      }
    }
    
    return NextResponse.json(response, {
      status: 200,
      headers: CORS_HEADERS
    })
    
  } catch (error) {
    console.error('💥 Session validation error:', error)
    return NextResponse.json({
      success: false,
      error: "Validation failed",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500,
      headers: CORS_HEADERS
    })
  }
}