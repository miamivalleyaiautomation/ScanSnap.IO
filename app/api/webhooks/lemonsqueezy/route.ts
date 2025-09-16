import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headerPayload = headers()
  const signature = headerPayload.get('x-signature')

  if (!signature) {
    console.error('No signature header')
    return new Response('Unauthorized', { status: 401 })
  }

  // Verify the webhook signature
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(body)
  const digest = hmac.digest('hex')

  if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(digest, 'hex'))) {
    console.error('Invalid signature')
    return new Response('Unauthorized', { status: 401 })
  }

  let event
  try {
    event = JSON.parse(body)
  } catch (error) {
    console.error('Invalid JSON:', error)
    return new Response('Invalid JSON', { status: 400 })
  }

  const eventType = event.meta.event_name
  const eventData = event.data

  console.log(`Lemon Squeezy webhook: ${eventType}`)

  try {
    // Check if we've already processed this event
    if (event.meta.custom_data?.event_id) {
      const { data: existingEvent } = await supabaseAdmin
        .from('subscription_events')
        .select('id')
        .eq('lemon_squeezy_event_id', event.meta.custom_data.event_id)
        .single()

      if (existingEvent) {
        console.log('Event already processed, skipping')
        return new Response('OK', { status: 200 })
      }
    }

    switch (eventType) {
      case 'subscription_created':
        await handleSubscriptionCreated(eventData, event)
        break
      case 'subscription_updated':
        await handleSubscriptionUpdated(eventData, event)
        break
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(eventData, event)
        break
      case 'subscription_resumed':
        await handleSubscriptionResumed(eventData, event)
        break
      case 'subscription_expired':
        await handleSubscriptionExpired(eventData, event)
        break
      case 'subscription_payment_success':
        await handlePaymentSuccess(eventData, event)
        break
      case 'order_created':
        await handleOrderCreated(eventData, event)
        break
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    // Log the event for debugging
    await supabaseAdmin.from('subscription_events').insert({
      event_type: eventType,
      lemon_squeezy_subscription_id: eventData.attributes?.subscription_id || eventData.id,
      lemon_squeezy_event_id: event.meta.custom_data?.event_id || `${eventType}_${Date.now()}`,
      event_data: event,
    })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Internal server error', { status: 500 })
  }

  return new Response('OK', { status: 200 })
}

async function handleSubscriptionCreated(data: any, event: any) {
  const customData = data.attributes.custom_data || {}
  const clerkUserId = customData.clerk_user_id

  if (!clerkUserId) {
    console.error('No clerk_user_id in custom_data')
    return
  }

  // Map product/variant to subscription status
  const subscriptionStatus = getSubscriptionStatusFromProduct(data.attributes.product_name, data.attributes.variant_name)

  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: subscriptionStatus,
      subscription_plan: subscriptionStatus,
      lemon_squeezy_customer_id: data.attributes.customer_id,
      lemon_squeezy_subscription_id: data.id,
      subscription_expires_at: data.attributes.renews_at,
      subscription_started_at: data.attributes.created_at,
      updated_at: new Date().toISOString(),
    })
    .eq('clerk_user_id', clerkUserId)

  if (error) {
    console.error('Error updating user profile:', error)
  } else {
    console.log('Subscription created for user:', clerkUserId)
  }
}

async function handleSubscriptionUpdated(data: any, event: any) {
  const subscriptionStatus = data.attributes.status === 'active' ? 
    getSubscriptionStatusFromProduct(data.attributes.product_name, data.attributes.variant_name) : 
    'cancelled'

  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: subscriptionStatus,
      subscription_expires_at: data.attributes.renews_at,
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', data.id)

  if (error) {
    console.error('Error updating subscription:', error)
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
    console.error('Error cancelling subscription:', error)
  }
}

async function handleSubscriptionResumed(data: any, event: any) {
  const subscriptionStatus = getSubscriptionStatusFromProduct(data.attributes.product_name, data.attributes.variant_name)

  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: subscriptionStatus,
      subscription_expires_at: data.attributes.renews_at,
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', data.id)

  if (error) {
    console.error('Error resuming subscription:', error)
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
    console.error('Error expiring subscription:', error)
  }
}

async function handlePaymentSuccess(data: any, event: any) {
  // Ensure subscription is active after successful payment
  const subscriptionStatus = getSubscriptionStatusFromProduct(data.attributes.product_name, data.attributes.variant_name)

  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: subscriptionStatus,
      subscription_expires_at: data.attributes.renews_at,
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', data.id)

  if (error) {
    console.error('Error processing payment success:', error)
  }
}

async function handleOrderCreated(data: any, event: any) {
  const customData = data.attributes.custom_data || {}
  const clerkUserId = customData.clerk_user_id

  if (!clerkUserId) {
    console.error('No clerk_user_id in order custom_data')
    return
  }

  // Get user profile to get internal user ID
  const { data: userProfile, error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (profileError || !userProfile) {
    console.error('User profile not found for order')
    return
  }

  // Create purchase record
  const { error } = await supabaseAdmin.from('purchases').insert({
    user_id: userProfile.id,
    lemon_squeezy_order_id: data.id,
    product_name: data.attributes.product_name,
    variant_name: data.attributes.variant_name,
    amount: data.attributes.total,
    currency: data.attributes.currency,
    status: data.attributes.status,
    purchase_date: data.attributes.created_at,
    lemon_squeezy_data: event,
  })

  if (error) {
    console.error('Error creating purchase record:', error)
  } else {
    console.log('Purchase record created for order:', data.id)
  }
}

// Helper function to map product names to subscription status
function getSubscriptionStatusFromProduct(productName: string, variantName?: string): string {
  const product = productName?.toLowerCase() || ''
  const variant = variantName?.toLowerCase() || ''
  
  if (product.includes('basic') || variant.includes('basic')) {
    return 'basic'
  } else if (product.includes('plus') || variant.includes('plus')) {
    return 'plus'
  } else if (product.includes('pro') && (product.includes('dpms') || variant.includes('dpms'))) {
    return 'pro_dpms'
  } else if (product.includes('pro') || variant.includes('pro')) {
    return 'pro'
  }
  
  // Default fallback
  return 'plus'
}