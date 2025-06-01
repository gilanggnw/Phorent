import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Initialize Supabase admin client for database operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey)

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Use Supabase authentication
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Get user data from our users table
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, firstName, lastName, avatar, bio, createdAt, updatedAt')
      .eq('email', email)
      .single()

    if (userError || !user) {
      console.error('User lookup error:', userError)
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user,
      token: data.session?.access_token,
      supabaseSession: data.session,
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
