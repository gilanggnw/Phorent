import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Registration API called')
    
    // Check for required environment variables
    const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
    
    console.log('🔧 Environment check:', {
      hasJwtSecret: !!jwtSecret,
      hasDatabaseUrl: !!databaseUrl,
      jwtSecretLength: jwtSecret?.length || 0,
      nodeEnv: process.env.NODE_ENV
    })
    
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET or SUPABASE_JWT_SECRET environment variable is missing')
      return NextResponse.json(
        { error: 'Server configuration error - JWT secret missing' },
        { status: 500 }
      )
    }

    if (!databaseUrl) {
      console.error('❌ DATABASE_URL or POSTGRES_PRISMA_URL environment variable is missing')
      return NextResponse.json(
        { error: 'Server configuration error - Database URL missing' },
        { status: 500 }
      )
    }    const body = await request.json()
    const { email, password, firstName, lastName } = registerSchema.parse(body)

    console.log('📥 Registration data received for email:', email)

    // Check if user already exists in our database
    console.log('🔍 Checking if user exists...')
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('❌ User already exists with email:', email)
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user in our database
    console.log('👤 Creating new user...')
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true      }
    })

    console.log('✅ User created successfully with ID:', user.id)

    // Generate JWT token
    console.log('🔑 Generating JWT token...')
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    )

    console.log('🎉 Registration completed successfully for:', email)
    return NextResponse.json({
      user,
      token,
      message: 'Registration successful',
    })
  } catch (error) {
    console.error('❌ Registration error occurred:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    
    // Check for specific error types
    if (error instanceof z.ZodError) {
      console.error('🔍 Validation error:', error.errors)
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    // Check for Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; message?: string }
      console.error('🗄️ Database error:', prismaError)
      
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        )
      }
      if (prismaError.code === 'P1001') {
        return NextResponse.json(
          { error: 'Database connection failed' },
          { status: 500 }
        )
      }
      
      // Handle other Prisma errors
      return NextResponse.json(
        { error: `Database error: ${prismaError.code}`, details: prismaError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
