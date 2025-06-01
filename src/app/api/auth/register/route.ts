import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Initialize Supabase admin client for database operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey)

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName } = registerSchema.parse(body)

    // Check if user already exists in our database
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create user with Supabase Auth
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          full_name: `${firstName} ${lastName}`,
        }
      }
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Create user in our database
    if (data.user) {
      const { data: user, error: dbError } = await supabaseAdmin
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          firstName,
          lastName,
          password: '', // Empty since using Supabase auth
        })
        .select('id, email, firstName, lastName, createdAt')
        .single()

      if (dbError) {
        console.error('Database user creation error:', dbError)
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        user,
        token: data.session?.access_token,
        supabaseSession: data.session,
        message: 'Registration successful. Please check your email to verify your account.',
      })
    }

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
