import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Since we're using JWT tokens, logout is handled client-side
    // by removing the token from localStorage/cookies
    // This endpoint just confirms the logout action
    
    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
