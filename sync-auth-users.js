/**
 * Sync Supabase Auth Users to Custom Users Table
 * This script fetches all users from Supabase Auth and creates them in your custom users table
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('- SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function syncAuthUsersToDatabase() {
  console.log('🔄 Starting Supabase Auth users sync...')

  try {
    // Get all users from Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message)
      return
    }

    const authUsers = authData.users
    console.log(`📊 Found ${authUsers.length} users in Supabase Auth`)

    // Get existing users from your database
    const { data: existingUsers, error: dbError } = await supabase
      .from('users')
      .select('id, email')

    if (dbError) {
      console.error('❌ Error fetching database users:', dbError.message)
      return
    }

    console.log(`📊 Found ${existingUsers?.length || 0} users in custom users table`)

    // Create Set of existing user IDs for quick lookup
    const existingUserIds = new Set(existingUsers?.map(u => u.id) || [])

    let syncedCount = 0
    let skippedCount = 0

    // Process each auth user
    for (const authUser of authUsers) {
      try {
        // Skip if user already exists in database
        if (existingUserIds.has(authUser.id)) {
          console.log(`⏭️  Skipping ${authUser.email} - already exists in database`)
          skippedCount++
          continue
        }

        // Extract user data from auth user
        const firstName = authUser.user_metadata?.firstName || 
                         authUser.user_metadata?.full_name?.split(' ')[0] || 
                         'User'
        
        const lastName = authUser.user_metadata?.lastName || 
                        authUser.user_metadata?.full_name?.split(' ')[1] || 
                        ''

        // Create user in your database
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email!,
            firstName,
            lastName,
            password: '', // Empty since using Supabase auth
            avatar: authUser.user_metadata?.avatar_url || null,
            bio: authUser.user_metadata?.bio || null,
            createdAt: authUser.created_at,
            updatedAt: new Date().toISOString(),
          })

        if (insertError) {
          console.error(`❌ Error creating user ${authUser.email}:`, insertError.message)
        } else {
          console.log(`✅ Synced user: ${authUser.email} (${firstName} ${lastName})`)
          syncedCount++
        }

      } catch (error) {
        console.error(`❌ Error processing user ${authUser.email}:`, error)
      }
    }

    console.log('\n📈 Sync Summary:')
    console.log(`✅ Successfully synced: ${syncedCount} users`)
    console.log(`⏭️  Skipped (already exist): ${skippedCount} users`)
    console.log(`📊 Total processed: ${authUsers.length} users`)

    // Verify the sync
    const { data: finalUsers, error: finalError } = await supabase
      .from('users')
      .select('id, email, firstName, lastName')

    if (!finalError) {
      console.log(`\n🎉 Final count: ${finalUsers?.length || 0} users in custom users table`)
      
      if (finalUsers && finalUsers.length > 0) {
        console.log('\n📋 All users in database:')
        finalUsers.forEach(user => {
          console.log(`  - ${user.email} (${user.firstName} ${user.lastName})`)
        })
      }
    }

  } catch (error) {
    console.error('❌ Sync failed:', error)
  }
}

// Run the sync
if (require.main === module) {
  syncAuthUsersToDatabase()
    .then(() => {
      console.log('\n🏁 Sync completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Sync failed:', error)
      process.exit(1)
    })
}

export { syncAuthUsersToDatabase }
