import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { supabaseUserId, email, firstName, lastName } = await request.json()

    // Check if user already exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { id: supabaseUserId }
    })

    if (existingUser) {
      return NextResponse.json({ user: existingUser })
    }

    // Create new user in our database
    const user = await prisma.user.create({
      data: {
        id: supabaseUserId, // Use Supabase user ID as primary key
        email,
        firstName,
        lastName,
        password: '', // Not needed since Supabase handles auth
      }
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('User sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    )
  }
}
