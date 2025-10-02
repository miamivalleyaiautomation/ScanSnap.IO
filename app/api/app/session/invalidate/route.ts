// Create /app/api/app/session/invalidate/route.ts

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Deactivate all sessions for this user
    await supabaseAdmin
      .from('app_sessions')
      .update({ is_active: false })
      .eq('clerk_user_id', userId)

    console.log('✅ Invalidated all sessions for user:', userId)

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Session invalidation error:', error)
    return NextResponse.json(
      { error: 'Failed to invalidate sessions' },
      { status: 500 }
    )
  }
}