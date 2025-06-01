import { createClient } from '@supabase/supabase-js'

// Admin client with service role key for server-side operations
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Helper function to create or update a user in Supabase Auth
export const createSupabaseUser = async (email: string, password: string, userData: {
  firstName: string
  lastName: string
  id?: string
}) => {
  const supabase = createAdminClient()

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for admin created users
      user_metadata: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        full_name: `${userData.firstName} ${userData.lastName}`,
      },
    })

    if (error) {
      console.error('Error creating Supabase user:', error.message)
      return { error: error.message }
    }

    return { user: data.user }
  } catch (error) {
    console.error('Unexpected error creating Supabase user:', error)
    return { error: 'An unexpected error occurred' }
  }
}

// Helper function to delete a user from Supabase Auth
export const deleteSupabaseUser = async (userId: string) => {
  const supabase = createAdminClient()

  try {
    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) {
      console.error('Error deleting Supabase user:', error.message)
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error deleting Supabase user:', error)
    return { error: 'An unexpected error occurred' }
  }
}

// Helper function to update user metadata in Supabase Auth
export const updateSupabaseUserMetadata = async (userId: string, metadata: Record<string, unknown>) => {
  const supabase = createAdminClient()

  try {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: metadata,
    })

    if (error) {
      console.error('Error updating Supabase user metadata:', error.message)
      return { error: error.message }
    }

    return { user: data.user }
  } catch (error) {
    console.error('Unexpected error updating Supabase user metadata:', error)
    return { error: 'An unexpected error occurred' }
  }
}
