import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyJWT } from '@/lib/auth'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    let userId: string | null = null

    // First try to verify as Supabase token
    try {
      const supabase = await createClient()
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token)
      
      if (!error && supabaseUser) {
        userId = supabaseUser.id
      }
    } catch {
      // If Supabase token verification fails, try JWT
    }

    // If not a Supabase token, try as JWT
    if (!userId) {
      const decoded = verifyJWT(token)
      if (!decoded) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        )
      }
      userId = decoded.userId
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
