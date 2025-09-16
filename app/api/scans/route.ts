import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/scans - Get user's scans
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile first to get the internal user ID
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') // 'pending', 'completed', 'failed'

    let query = supabaseAdmin
      .from('scans')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('processing_status', status)
    }

    const { data: scans, error } = await query

    if (error) {
      console.error('Error fetching scans:', error)
      return NextResponse.json({ error: 'Failed to fetch scans' }, { status: 400 })
    }

    return NextResponse.json({ scans })
  } catch (error) {
    console.error('Error in GET /api/scans:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/scans - Create new scan
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile and check credits
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has credits
    if (!userProfile.scan_credits || userProfile.scan_credits <= 0) {
      return NextResponse.json({ error: 'No scan credits remaining' }, { status: 402 })
    }

    const { file_name, file_size, scan_type = 'document' } = await request.json()

    if (!file_name) {
      return NextResponse.json({ error: 'File name is required' }, { status: 400 })
    }

    // Create scan record
    const { data: scan, error: scanError } = await supabaseAdmin
      .from('scans')
      .insert({
        user_id: userProfile.id,
        file_name,
        file_size,
        scan_type,
        processing_status: 'pending'
      })
      .select()
      .single()

    if (scanError) {
      console.error('Error creating scan:', scanError)
      return NextResponse.json({ error: 'Failed to create scan' }, { status: 400 })
    }

    // Deduct credit and update usage
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        scan_credits: userProfile.scan_credits - 1,
        total_scans_used: userProfile.total_scans_used + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', userProfile.id)

    if (updateError) {
      console.error('Error updating user credits:', updateError)
      // Note: We might want to rollback the scan creation here
    }

    return NextResponse.json({ scan })
  } catch (error) {
    console.error('Error in POST /api/scans:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}can