// Simple test to check environment variables and API connection
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    return NextResponse.json({
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      supabaseUrl: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing',
      serviceKeyPrefix: supabaseServiceKey ? supabaseServiceKey.substring(0, 20) + '...' : 'missing'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Test failed', details: error.message }, { status: 500 })
  }
}
