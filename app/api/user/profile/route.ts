// app/api/user/profile/route.ts
import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Use admin client to bypass RLS
    const { data: profile, error } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("clerk_user_id", userId)
      .single()

    if (error) {
      console.error("Database error:", error)
      
      // If profile doesn't exist, create it
      if (error.code === 'PGRST116') { // Row not found
        const user = await currentUser() // Fixed import
        
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const { data: newProfile, error: createError } = await supabaseAdmin
          .from("user_profiles")
          .insert({
            clerk_user_id: userId,
            email: user.emailAddresses[0]?.emailAddress,
            first_name: user.firstName,
            last_name: user.lastName,
            subscription_status: 'basic',
            subscription_plan: 'basic',
            app_preferences: {},
            onboarding_completed: false,
          })
          .select()
          .single()

        if (createError) {
          return NextResponse.json({ error: createError.message }, { status: 500 })
        }

        return NextResponse.json({ profile: newProfile })
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile })
    
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}