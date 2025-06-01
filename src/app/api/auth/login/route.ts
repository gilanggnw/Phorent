import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, signJWT } from '@/lib/auth'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  useSupabase: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, useSupabase } = loginSchema.parse(body)

    // If using Supabase authentication
    if (useSupabase) {
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

      // Try to find or create user in your database
      let user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user && data.user) {
        // Create user in your database if it doesn't exist
        user = await prisma.user.create({
          data: {
            id: data.user.id,
            email: data.user.email!,
            firstName: data.user.user_metadata?.firstName || '',
            lastName: data.user.user_metadata?.lastName || '',
            password: '', // Empty since using Supabase auth
            avatar: data.user.user_metadata?.avatar_url,
            bio: data.user.user_metadata?.bio,
          }
        })
      }

      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, ...userWithoutPassword } = user
        return NextResponse.json({
          user: userWithoutPassword,
          token: data.session?.access_token,
          supabaseSession: data.session,
        })
      }
    }

    // Fallback to existing authentication system
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = signJWT({ userId: user.id, email: user.email })
    
    // Return user data without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
