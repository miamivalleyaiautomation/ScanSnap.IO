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

  if (!signature) {
    console.error('No signature header')
    return new Response('Unauthorized', { status: 401 })
  }

  // Verify the webhook signature
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
  if (!secret) {
    console.error('LEMONSQUEEZY_WEBHOOK_SECRET not configured')
    return new Response('Server configuration error', { status: 500 })
  }

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
  console.log('Event ID:', eventData.id)
  console.log('Custom data:', event.meta?.custom_data)

  try {
    // Check if we've already processed this event
    const eventId = `${eventType}_${eventData.id}_${Date.now()}`
    const { data: existingEvent } = await supabaseAdmin
      .from('subscription_events')
      .select('id')
      .eq('lemon_squeezy_event_id', eventId)
      .single()

    if (existingEvent) {
      console.log('Event already processed, skipping')
      return new Response('OK', { status: 200 })
    }

    switch (eventType) {
      case 'order_created':
        console.log('Processing order_created')
        await handleOrderCreated(eventData, event)
        break
        
      case 'subscription_created':
        console.log('Processing subscription_created')
        await handleSubscriptionCreated(eventData, event)
        break
        
      case 'subscription_updated':
        console.log('Processing subscription_updated')
        await handleSubscriptionUpdated(eventData, event)
        break
        
      case 'subscription_cancelled':
        console.log('Processing subscription_cancelled')
        await handleSubscriptionCancelled(eventData, event)
        break
        
      case 'subscription_resumed':
        console.log('Processing subscription_resumed')
        await handleSubscriptionResumed(eventData, event)
        break
        
      case 'subscription_expired':
        console.log('Processing subscription_expired')
        await handleSubscriptionExpired(eventData, event)
        break
        
      case 'subscription_payment_success':
        console.log('Processing subscription_payment_success')
        await handlePaymentSuccess(eventData, event)
        break
        
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    // Log the event
    await supabaseAdmin.from('subscription_events').insert({
      event_type: eventType,
      lemon_squeezy_subscription_id: eventData.attributes?.subscription_id || eventData.id,
      lemon_squeezy_event_id: eventId,
      event_data: event,
    })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Internal server error', { status: 500 })
  }

  return new Response('OK', { status: 200 })
}

async function handleOrderCreated(data: any, event: any) {
  console.log('Processing order creation')
  
  // IMPORTANT: Custom data is in event.meta.custom_data for Lemon Squeezy!
  const customData = event.meta?.custom_data || {}
  const clerkUserId = customData.clerk_user_id

  if (!clerkUserId) {
    console.error('No clerk_user_id in custom_data')
    console.error('Available custom data:', customData)
    
    // Try to find user by email as fallback
    const email = data.attributes?.user_email
    if (email) {
      console.log('Attempting to find user by email:', email)
      const { data: userProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single()
      
      if (userProfile) {
        console.log('Found user by email, creating purchase')
        await createPurchaseFromSubscription(userProfile.id, data, event)
        
        // Update subscription if needed
        if (!data.attributes.product_name?.toLowerCase().includes('one-time')) {
          await updateSubscriptionFromOrder(userProfile.clerk_user_id, data)
        }
      }
    }
    return
  }

  console.log('Processing order for user:', clerkUserId)

  // Get user profile to get internal user ID
  const { data: userProfile, error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (profileError || !userProfile) {
    console.error('User profile not found:', profileError)
    return
  }

  // Create purchase record
  await createPurchaseFromSubscription(userProfile.id, data, event)
  
  // Update subscription status if it's a subscription product
  if (!data.attributes.product_name?.toLowerCase().includes('one-time')) {
    await updateSubscriptionFromOrder(clerkUserId, data)
  }
}

async function createPurchaseFromSubscription(userId: string, data: any, event: any) {
  // Check if purchase already exists for this order
  if (data.attributes?.order_id) {
    const { data: existing } = await supabaseAdmin
      .from('purchases')
      .select('id')
      .eq('lemon_squeezy_order_id', data.attributes.order_id.toString())
      .single()
    
    if (existing) {
      console.log('Purchase already exists for order:', data.attributes.order_id)
      return
    }
  }
  
  const purchaseData = {
    user_id: userId,
    lemon_squeezy_order_id: data.attributes?.order_id?.toString() || data.id.toString(),
    product_name: data.attributes.product_name,
    variant_name: data.attributes.variant_name || 'Default',
    amount: 999, // Default to $9.99 for Plus plan - adjust based on product
    currency: 'USD',
    status: 'paid',
    purchase_date: data.attributes.created_at || new Date().toISOString(),
    lemon_squeezy_data: event,
  }
  
  // Try to determine amount from product name
  if (data.attributes.product_name?.toLowerCase().includes('pro') && 
      data.attributes.product_name?.toLowerCase().includes('dpms')) {
    purchaseData.amount = 4999 // $49.99
  } else if (data.attributes.product_name?.toLowerCase().includes('pro')) {
    purchaseData.amount = 1499 // $14.99
  } else if (data.attributes.product_name?.toLowerCase().includes('plus')) {
    purchaseData.amount = 999 // $9.99
  }

  console.log('Creating purchase from subscription:', purchaseData)

  const { error } = await supabaseAdmin.from('purchases').insert(purchaseData)

  if (error) {
    console.error('Error creating purchase from subscription:', error)
  } else {
    console.log('Purchase record created from subscription')
  }
}

async function updateSubscriptionFromOrder(clerkUserId: string, data: any) {
  const subscriptionStatus = getSubscriptionStatusFromProduct(
    data.attributes.product_name,
    data.attributes.variant_name
  )
  
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: subscriptionStatus,
      subscription_plan: subscriptionStatus,
      lemon_squeezy_customer_id: data.attributes.customer_id?.toString(),
      updated_at: new Date().toISOString(),
    })
    .eq('clerk_user_id', clerkUserId)
  
  if (error) {
    console.error('Error updating subscription from order:', error)
  } else {
    console.log('Subscription updated from order')
  }
}

async function handleSubscriptionCreated(data: any, event: any) {
  console.log('Processing subscription creation')
  
  // IMPORTANT: Custom data is in event.meta.custom_data!
  const customData = event.meta?.custom_data || {}
  const clerkUserId = customData.clerk_user_id

  if (!clerkUserId) {
    console.error('No clerk_user_id in custom_data')
    
    // Try to find user by email as fallback
    const email = data.attributes?.user_email
    if (email) {
      console.log('Attempting to find user by email:', email)
      const { data: userProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single()
      
      if (userProfile) {
        await updateUserSubscription(userProfile.clerk_user_id, data, event)
        // Also create purchase record
        await createPurchaseFromSubscription(userProfile.id, data, event)
      }
    }
    return
  }

  await updateUserSubscription(clerkUserId, data, event)
  
  // Also create a purchase record since order_created might not fire
  const { data: userProfile } = await supabaseAdmin
    .from('user_profiles')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single()
    
  if (userProfile) {
    await createPurchaseFromSubscription(userProfile.id, data, event)
  }
}

async function updateUserSubscription(clerkUserId: string, data: any, event: any) {
  const subscriptionStatus = getSubscriptionStatusFromProduct(
    data.attributes.product_name, 
    data.attributes.variant_name
  )

  const updateData = {
    subscription_status: subscriptionStatus,
    subscription_plan: subscriptionStatus,
    lemon_squeezy_customer_id: data.attributes.customer_id?.toString(),
    lemon_squeezy_subscription_id: data.id?.toString(),
    subscription_expires_at: data.attributes.renews_at,
    subscription_started_at: data.attributes.created_at,
    updated_at: new Date().toISOString(),
  }

  console.log('Updating subscription for user:', clerkUserId)

  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update(updateData)
    .eq('clerk_user_id', clerkUserId)

  if (error) {
    console.error('Error updating user subscription:', error)
  } else {
    console.log('Subscription created/updated successfully')
  }
}

async function handleSubscriptionUpdated(data: any, event: any) {
  console.log('Processing subscription update')
  
  // Get custom data from meta
  const customData = event.meta?.custom_data || {}
  const clerkUserId = customData.clerk_user_id
  
  const subscriptionStatus = data.attributes.status === 'active' ? 
    getSubscriptionStatusFromProduct(data.attributes.product_name, data.attributes.variant_name) : 
    data.attributes.status === 'cancelled' ? 'cancelled' : 'expired'

  const updateData = {
    subscription_status: subscriptionStatus,
    subscription_expires_at: data.attributes.renews_at,
    updated_at: new Date().toISOString(),
  }
  
  // Try to update by clerk_user_id first
  if (clerkUserId) {
    updateData['lemon_squeezy_subscription_id'] = data.id?.toString()
    updateData['lemon_squeezy_customer_id'] = data.attributes.customer_id?.toString()
    
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update(updateData)
      .eq('clerk_user_id', clerkUserId)
    
    if (error) {
      console.error('Error updating subscription:', error)
    } else {
      console.log('Subscription updated successfully')
    }
  } else {
    // Fallback: update by subscription ID
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update(updateData)
      .eq('lemon_squeezy_subscription_id', data.id?.toString())
    
    if (error) {
      console.error('Error updating subscription by ID:', error)
    } else {
      console.log('Subscription updated by subscription ID')
    }
  }
}

async function handleSubscriptionCancelled(data: any, event: any) {
  console.log('Processing subscription cancellation')
  
  // When cancelled, the subscription stays active until expiry
  // We should NOT change the subscription_status to cancelled
  // The status should remain as the current plan (plus, pro, etc) until it expires
  
  // Just update the expiry date - the subscription remains active until then
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      // Keep current status - don't change it!
      // The subscription is still active until expiry
      subscription_expires_at: data.attributes?.ends_at || data.attributes?.renews_at,
      updated_at: new Date().toISOString(),
      // Note: We're NOT changing subscription_status here
    })
    .eq('lemon_squeezy_subscription_id', data.id?.toString())

  if (error) {
    console.error('Error updating subscription expiry:', error)
  } else {
    console.log('Subscription will remain active until:', data.attributes?.ends_at || data.attributes?.renews_at)
  }
}

async function handleSubscriptionResumed(data: any, event: any) {
  console.log('Processing subscription resumption')
  
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
    .eq('lemon_squeezy_subscription_id', data.id?.toString())

  if (error) {
    console.error('Error resuming subscription:', error)
  } else {
    console.log('Subscription resumed successfully')
  }
}

async function handleSubscriptionExpired(data: any, event: any) {
  console.log('Processing subscription expiration')
  
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'expired',
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', data.id?.toString())

  if (error) {
    console.error('Error expiring subscription:', error)
  } else {
    console.log('Subscription expired successfully')
  }
}

async function handlePaymentSuccess(data: any, event: any) {
  console.log('Processing payment success')
  
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
    .eq('lemon_squeezy_subscription_id', data.attributes.subscription_id?.toString() || data.id?.toString())

  if (error) {
    console.error('Error processing payment:', error)
  } else {
    console.log('Payment processed successfully')
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