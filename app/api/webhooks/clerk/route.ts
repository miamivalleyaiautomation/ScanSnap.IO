import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await request.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400,
    })
  }

  const eventType = evt.type
  console.log(`Clerk webhook with ID: ${evt.data.id} and type of ${eventType}`)

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    try {
      // Create user profile in Supabase
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          clerk_user_id: id,
          email: email_addresses[0]?.email_address,
          first_name,
          last_name,
          profile_image_url: image_url,
          subscription_status: 'basic', // Start with basic plan
          subscription_plan: 'basic',
          app_preferences: {},
          onboarding_completed: false,
        })

      if (error) {
        console.error('Error creating user profile:', error)
        return new Response('Error creating user profile', { status: 500 })
      }

      console.log('User profile created successfully for:', email_addresses[0]?.email_address)
    } catch (error) {
      console.error('Error in user.created webhook:', error)
      return new Response('Internal server error', { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    try {
      // Update user profile in Supabase
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .update({
          email: email_addresses[0]?.email_address,
          first_name,
          last_name,
          profile_image_url: image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_user_id', id)

      if (error) {
        console.error('Error updating user profile:', error)
        return new Response('Error updating user profile', { status: 500 })
      }

      console.log('User profile updated successfully for:', email_addresses[0]?.email_address)
    } catch (error) {
      console.error('Error in user.updated webhook:', error)
      return new Response('Internal server error', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      // Delete user profile from Supabase (CASCADE will handle related data)
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .delete()
        .eq('clerk_user_id', id)

      if (error) {
        console.error('Error deleting user profile:', error)
        return new Response('Error deleting user profile', { status: 500 })
      }

      console.log('User profile deleted successfully for ID:', id)
    } catch (error) {
      console.error('Error in user.deleted webhook:', error)
      return new Response('Internal server error', { status: 500 })
    }
  }

  return new Response('', { status: 200 })
}