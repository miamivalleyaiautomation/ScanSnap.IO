// app/api/webhooks/lemonsqueezy/route.ts
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  console.log('🍋 Lemon Squeezy webhook received')
  
  const body = await request.text()
  const headerPayload = headers()
  const signature = headerPayload.get('x-signature')

  console.log('Webhook headers:', {
    hasSignature: !!signature,
    contentLength: headerPayload.get('content-length')
  })

  if (!signature) {
    console.error('❌ No signature header')
    return new Response('Unauthorized - No signature', { status: 401 })
  }

  // Verify the webhook signature
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
  if (!secret) {
    console.error('❌ LEMONSQUEEZY_WEBHOOK_SECRET not configured')
    return new Response('Server configuration error', { status: 500 })
  }

  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(body)
  const digest = hmac.digest('hex')

  if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(digest, 'hex'))) {
    console.error('❌ Invalid signature')
    console.error('Expected:', digest)
    console.error('Received:', signature)
    return new Response('Unauthorized - Invalid signature', { status: 401 })
  }

  console.log('✅ Signature verified')

  let event
  try {
    event = JSON.parse(body)
  } catch (error) {
    console.error('❌ Invalid JSON:', error)
    return new Response('Invalid JSON', { status: 400 })
  }

  const eventType = event.meta.event_name
  const eventData = event.data

  console.log(`📨 Lemon Squeezy webhook: ${eventType}`)
  console.log('Event data:', {
    id: eventData.id,
    attributes: {
      customer_id: eventData.attributes?.customer_id,
      custom_data: eventData.attributes?.custom_data,
      product_name: eventData.attributes?.product_name,
      variant_name: eventData.attributes?.variant_name
    }
  })

  try {
    // Check if we've already processed this event
    if (event.meta.custom_data?.event_id) {
      const { data: existingEvent } = await supabaseAdmin
        .from('subscription_events')
        .select('id')
        .eq('lemon_squeezy_event_id', event.meta.custom_data.event_id)
        .single()

      if (existingEvent) {
        console.log('⏭️ Event already processed, skipping')
        return new Response('OK - Already processed', { status: 200 })
      }
    }

    switch (eventType) {
      case 'subscription_created':
        console.log('🔄 Processing subscription_created')
        await handleSubscriptionCreated(eventData, event)
        break
      case 'subscription_updated':
        console.log('🔄 Processing subscription_updated')
        await handleSubscriptionUpdated(eventData, event)
        break
      case 'subscription_cancelled':
        console.log('🔄 Processing subscription_cancelled')
        await handleSubscriptionCancelled(eventData, event)
        break
      case 'subscription_resumed':
        console.log('🔄 Processing subscription_resumed')
        await handleSubscriptionResumed(eventData, event)
        break
      case 'subscription_expired':
        console.log('🔄 Processing subscription_expired')
        await handleSubscriptionExpired(eventData, event)
        break
      case 'subscription_payment_success':
        console.log('🔄 Processing subscription_payment_success')
        await handlePaymentSuccess(eventData, event)
        break
      case 'order_created':
        console.log('🔄 Processing order_created')
        await handleOrderCreated(eventData, event)
        break
      default:
        console.log(`⚠️ Unhandled event type: ${eventType}`)
    }

    // Log the event for debugging
    const { error: logError } = await supabaseAdmin.from('subscription_events').insert({
      event_type: eventType,
      lemon_squeezy_subscription_id: eventData.attributes?.subscription_id || eventData.id,
      lemon_squeezy_event_id: event.meta.custom_data?.event_id || `${eventType}_${Date.now()}`,
      event_data: event,
    })

    if (logError) {
      console.error('❌ Error logging event:', logError)
    } else {
      console.log('✅ Event logged successfully')
    }

  } catch (error) {
    console.error('❌ Error processing webhook:', error)
    return new Response('Internal server error', { status: 500 })
  }

  console.log('✅ Webhook processed successfully')
  return new Response('OK', { status: 200 })
}

async function handleSubscriptionCreated(data: any, event: any) {
  console.log('🎯 handleSubscriptionCreated called')
  
  // Custom data is in event.meta.custom_data for Lemon Squeezy webhooks!
  const customData = event.meta?.custom_data || data.attributes?.custom_data || {}
  console.log('Custom data found:', customData)
  
  const clerkUserId = customData.clerk_user_id

  if (!clerkUserId) {
    console.error('❌ No clerk_user_id in custom_data')
    console.error('Full data.attributes:', JSON.stringify(data.attributes, null, 2))
    return
  }

  console.log('👤 Updating user:', clerkUserId)

  // Map product/variant to subscription status
  const subscriptionStatus = getSubscriptionStatusFromProduct(
    data.attributes.product_name, 
    data.attributes.variant_name
  )
  
  console.log('📦 Subscription status:', subscriptionStatus)

  const updateData = {
    subscription_status: subscriptionStatus,
    subscription_plan: subscriptionStatus,
    lemon_squeezy_customer_id: data.attributes.customer_id,
    lemon_squeezy_subscription_id: data.id,
    subscription_expires_at: data.attributes.renews_at,
    subscription_started_at: data.attributes.created_at,
    updated_at: new Date().toISOString(),
  }

  console.log('📝 Update data:', updateData)

  const { data: updatedProfile, error } = await supabaseAdmin
    .from('user_profiles')
    .update(updateData)
    .eq('clerk_user_id', clerkUserId)
    .select()

  if (error) {
    console.error('❌ Error updating user profile:', error)
  } else {
    console.log('✅ Subscription created for user:', clerkUserId)
    console.log('Updated profile:', updatedProfile)
  }
}

async function handleSubscriptionUpdated(data: any, event: any) {
  console.log('🎯 handleSubscriptionUpdated called')
  
  // Get clerk_user_id from meta.custom_data
  const customData = event.meta?.custom_data || {}
  const clerkUserId = customData.clerk_user_id
  
  if (!clerkUserId) {
    // If no clerk_user_id, try to update by lemon_squeezy_subscription_id
    console.log('⚠️ No clerk_user_id, updating by subscription ID')
  }
  
  const subscriptionStatus = data.attributes.status === 'active' ? 
    getSubscriptionStatusFromProduct(data.attributes.product_name, data.attributes.variant_name) : 
    'cancelled'

  const updateData = {
    subscription_status: subscriptionStatus,
    subscription_expires_at: data.attributes.renews_at,
    updated_at: new Date().toISOString(),
  }
  
  // If we have clerk_user_id from custom_data, update by that
  if (clerkUserId) {
    updateData['lemon_squeezy_subscription_id'] = data.id
    updateData['lemon_squeezy_customer_id'] = data.attributes.customer_id
    
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update(updateData)
      .eq('clerk_user_id', clerkUserId)
    
    if (error) {
      console.error('❌ Error updating subscription by clerk_user_id:', error)
    } else {
      console.log('✅ Subscription updated for user:', clerkUserId)
    }
  } else {
    // Fallback: update by lemon_squeezy_subscription_id
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update(updateData)
      .eq('lemon_squeezy_subscription_id', data.id)
    
    if (error) {
      console.error('❌ Error updating subscription by subscription_id:', error)
    } else {
      console.log('✅ Subscription updated by subscription_id:', data.id)
    }
  }
}

async function handleSubscriptionCancelled(data: any, event: any) {
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', data.id)

  if (error) {
    console.error('❌ Error cancelling subscription:', error)
  } else {
    console.log('✅ Subscription cancelled')
  }
}

async function handleSubscriptionResumed(data: any, event: any) {
  const subscriptionStatus = getSubscriptionStatusFromProduct(
    data.attributes.product_name, 
    data.attributes.variant_name
  )

  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: subscriptionStatus,
      subscription_expires_at: data.attributes.renews_at,
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', data.id)

  if (error) {
    console.error('❌ Error resuming subscription:', error)
  } else {
    console.log('✅ Subscription resumed')
  }
}

async function handleSubscriptionExpired(data: any, event: any) {
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'expired',
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', data.id)

  if (error) {
    console.error('❌ Error expiring subscription:', error)
  } else {
    console.log('✅ Subscription expired')
  }
}

async function handlePaymentSuccess(data: any, event: any) {
  const subscriptionStatus = getSubscriptionStatusFromProduct(
    data.attributes.product_name, 
    data.attributes.variant_name
  )

  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: subscriptionStatus,
      subscription_expires_at: data.attributes.renews_at,
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', data.id)

  if (error) {
    console.error('❌ Error processing payment success:', error)
  } else {
    console.log('✅ Payment processed')
  }
}

async function handleOrderCreated(data: any, event: any) {
  console.log('🎯 handleOrderCreated called')
  
  // Custom data is in event.meta.custom_data for Lemon Squeezy webhooks!
  const customData = event.meta?.custom_data || data.attributes?.custom_data || {}
  console.log('Custom data found:', customData)
  
  const clerkUserId = customData.clerk_user_id

  if (!clerkUserId) {
    console.error('❌ No clerk_user_id in order custom_data')
    console.error('Full data.attributes:', JSON.stringify(data.attributes, null, 2))
    return
  }

  console.log('👤 Processing order for user:', clerkUserId)

  // Get user profile to get internal user ID
  const { data: userProfile, error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (profileError || !userProfile) {
    console.error('❌ User profile not found for order:', profileError)
    return
  }

  console.log('👤 Found user profile:', userProfile.id)

  // Create purchase record
  const purchaseData = {
    user_id: userProfile.id,
    lemon_squeezy_order_id: data.id,
    product_name: data.attributes.product_name,
    variant_name: data.attributes.variant_name,
    amount: data.attributes.total,
    currency: data.attributes.currency,
    status: data.attributes.status,
    purchase_date: data.attributes.created_at,
    lemon_squeezy_data: event,
  }

  console.log('📝 Creating purchase record:', purchaseData)

  const { error } = await supabaseAdmin.from('purchases').insert(purchaseData)

  if (error) {
    console.error('❌ Error creating purchase record:', error)
  } else {
    console.log('✅ Purchase record created for order:', data.id)
  }
  
  // Also update subscription status if it's a subscription product
  if (data.attributes.product_name && !data.attributes.product_name.toLowerCase().includes('one-time')) {
    console.log('📊 Also updating subscription status from order')
    
    const subscriptionStatus = getSubscriptionStatusFromProduct(
      data.attributes.product_name,
      data.attributes.variant_name
    )
    
    const { error: subError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        subscription_status: subscriptionStatus,
        subscription_plan: subscriptionStatus,
        lemon_squeezy_customer_id: data.attributes.customer_id,
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_user_id', clerkUserId)
    
    if (subError) {
      console.error('❌ Error updating subscription from order:', subError)
    } else {
      console.log('✅ Subscription status updated from order')
    }
  }
}

// Helper function to map product names to subscription status
function getSubscriptionStatusFromProduct(productName: string, variantName?: string): string {
  console.log('🏷️ Mapping product to status:', { productName, variantName })
  
  const product = productName?.toLowerCase() || ''
  const variant = variantName?.toLowerCase() || ''
  
  let status = 'plus' // default
  
  if (product.includes('basic') || variant.includes('basic')) {
    status = 'basic'
  } else if (product.includes('plus') || variant.includes('plus')) {
    status = 'plus'
  } else if (product.includes('pro') && (product.includes('dpms') || variant.includes('dpms'))) {
    status = 'pro_dpms'
  } else if (product.includes('pro') || variant.includes('pro')) {
    status = 'pro'
  }
  
  console.log('📊 Mapped to status:', status)
  return status
}