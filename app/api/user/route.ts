import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/user - Get current user profile
export async function GET() {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userProfile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ user: userProfile })
  } catch (error) {
    console.error('Error in GET /api/user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/user - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    
    // Remove fields that shouldn't be updated directly
    const {
      id,
      clerk_user_id,
      created_at,
      lemon_squeezy_customer_id,
      lemon_squeezy_subscription_id,
      ...allowedUpdates
    } = updates

    const { data: updatedProfile, error } = await supabaseAdmin
      .from('user_profiles')
      .update({
        ...allowedUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return NextResponse.json({ error: 'Update failed' }, { status: 400 })
    }

    return NextResponse.json({ user: updatedProfile })
  } catch (error) {
    console.error('Error in PATCH /api/user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}