import { supabase } from '@/lib/supabase'

export async function getSupabaseUser(request: Request): Promise<{ userId: string; email: string } | null> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return null
    }

    return {
      userId: user.id,
      email: user.email!
    }
  } catch {
    return null
  }
}
