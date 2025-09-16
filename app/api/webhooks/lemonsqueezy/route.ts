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
  const subscriptionData = event.data

  console.log(`Lemon Squeezy webhook: ${eventType}`)

  try {
    switch (eventType) {
      case 'subscription_created':
        await handleSubscriptionCreated(subscriptionData)
        break
      case 'subscription_updated':
        await handleSubscriptionUpdated(subscriptionData)
        break
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(subscriptionData)
        break
      case 'subscription_resumed':
        await handleSubscriptionResumed(subscriptionData)
        break
      case 'subscription_expired':
        await handleSubscriptionExpired(subscriptionData)
        break
      case 'subscription_payment_success':
        await handlePaymentSuccess(subscriptionData)
        break
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    // Log the event for debugging
    await supabaseAdmin.from('subscription_events').insert({
      event_type: eventType,
      lemon_squeezy_subscription_id: subscriptionData.id,
      event_data: event,
    })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Internal server error', { status: 500 })
  }

  return new Response('OK', { status: 200 })
}

async function handleSubscriptionCreated(data: any) {
  const customData = data.attributes.custom_data
  const clerkUserId = customData?.clerk_user_id

  if (!clerkUserId) {
    console.error('No clerk_user_id in custom_data')
    return
  }

  // Update user profile with subscription info
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'active',
      subscription_plan: data.attributes.product_name || 'Pro',
      lemon_squeezy_customer_id: data.attributes.customer_id,
      lemon_squeezy_subscription_id: data.id,
      subscription_expires_at: data.attributes.renews_at,
      scan_credits: 1000, // Pro plan gets 1000 scans
      updated_at: new Date().toISOString(),
    })
    .eq('clerk_user_id', clerkUserId)

  if (error) {
    console.error('Error updating user profile:', error)
  } else {
    console.log('Subscription created for user:', clerkUserId)
  }
}

async function handleSubscriptionUpdated(data: any) {
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: data.attributes.status === 'active' ? 'active' : 'cancelled',
      subscription_expires_at: data.attributes.renews_at,
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', data.id)

  if (error) {
    console.error('Error updating subscription:', error)
  }
}

async function handleSubscriptionCancelled(data: any) {
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

async function handleSubscriptionResumed(data: any) {
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'active',
      subscription_expires_at: data.attributes.renews_at,
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', data.id)

  if (error) {
    console.error('Error resuming subscription:', error)
  }
}

async function handleSubscriptionExpired(data: any) {
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'expired',
      scan_credits: 10, // Back to free tier
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', data.id)

  if (error) {
    console.error('Error expiring subscription:', error)
  }
}

async function handlePaymentSuccess(data: any) {
  // Refresh scan credits on successful payment
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'active',
      scan_credits: 1000, // Refresh credits
      subscription_expires_at: data.attributes.renews_at,
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', data.id)

  if (error) {
    console.error('Error processing payment success:', error)
  }
}