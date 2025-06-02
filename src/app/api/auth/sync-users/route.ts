import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'sync-all') {
      // Sync all Supabase Auth users to database
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
      
      if (authError) {
        return NextResponse.json(
          { error: 'Failed to fetch auth users' },
          { status: 500 }
        )
      }

      // Get existing users
      const { data: existingUsers } = await supabaseAdmin
        .from('users')
        .select('id')

      const existingIds = new Set(existingUsers?.map(u => u.id) || [])
      
      let synced = 0
      let skipped = 0

      for (const authUser of authUsers.users) {
        if (existingIds.has(authUser.id)) {
          skipped++
          continue
        }

        const firstName = authUser.user_metadata?.firstName || 
                         authUser.user_metadata?.full_name?.split(' ')[0] || 
                         'User'
        
        const lastName = authUser.user_metadata?.lastName || 
                        authUser.user_metadata?.full_name?.split(' ')[1] || 
                        ''

        const { error } = await supabaseAdmin
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email!,
            firstName,
            lastName,
            password: '',
            avatar: authUser.user_metadata?.avatar_url || null,
            bio: authUser.user_metadata?.bio || null,
            createdAt: authUser.created_at,
            updatedAt: new Date().toISOString(),
          })

        if (!error) {
          synced++
        }
      }

      return NextResponse.json({
        message: 'Sync completed',
        synced,
        skipped,
        total: authUsers.users.length
      })
    }

    // Sync single user by ID
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Get user from Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (authError || !authUser.user) {
      return NextResponse.json(
        { error: 'User not found in auth' },
        { status: 404 }
      )
    }

    const user = authUser.user

    // Check if user already exists in database
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existingUser) {
      return NextResponse.json({
        message: 'User already exists in database',
        user: existingUser
      })
    }

    // Create user in database
    const firstName = user.user_metadata?.firstName || 
                     user.user_metadata?.full_name?.split(' ')[0] || 
                     'User'
    
    const lastName = user.user_metadata?.lastName || 
                    user.user_metadata?.full_name?.split(' ')[1] || 
                    ''

    const { data: newUser, error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        id: user.id,
        email: user.email!,
        firstName,
        lastName,
        password: '',
        avatar: user.user_metadata?.avatar_url || null,
        bio: user.user_metadata?.bio || null,
        createdAt: user.created_at,
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json(
        { error: 'Failed to create user in database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'User synced successfully',
      user: newUser
    })

  } catch (error) {
    console.error('Sync users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
