// app/api/fix-purchase/route.ts
// Temporary endpoint to create missing purchase record
// DELETE THIS FILE after using it once!

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  // Only allow this in development or with a secret key
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== 'fix-my-purchase-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find Tirth's user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', 'user_3325Ot2neC1W6guxHX5jpIvXEaC')
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if purchase already exists
    const { data: existingPurchase } = await supabaseAdmin
      .from('purchases')
      .select('id')
      .eq('lemon_squeezy_order_id', '6447245')
      .single()

    if (existingPurchase) {
      return NextResponse.json({ 
        message: 'Purchase already exists',
        purchase: existingPurchase 
      })
    }

    // Create the missing purchase record
    const purchaseData = {
      user_id: userProfile.id,
      lemon_squeezy_order_id: '6447245',
      product_name: 'Scan Snap plus',
      variant_name: 'Default',
      amount: 999, // $9.99 in cents
      currency: 'USD',
      status: 'paid',
      purchase_date: '2025-09-22T01:27:41.000000Z',
      lemon_squeezy_data: {
        note: 'Manually created - order_created webhook was not enabled',
        subscription_id: '1505640',
        customer_id: '6792206',
        user_email: 'tirth.m.soni2018@gmail.com'
      }
    }

    const { data: newPurchase, error: insertError } = await supabaseAdmin
      .from('purchases')
      .insert(purchaseData)
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ 
        error: 'Failed to create purchase',
        details: insertError 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Purchase created successfully',
      purchase: newPurchase
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error 
    }, { status: 500 })
  }
}