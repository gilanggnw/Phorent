import { type NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  // Initialize Supabase client for server-side
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Get the token from the request
  const token = request.cookies.get('sb-access-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  if (token) {
    try {
      // Verify the JWT token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (error || !user) {
        // Token is invalid, but don't block - let the app handle it
        console.log('Invalid or expired token in middleware')
      }
    } catch (error) {
      console.error('Middleware auth error:', error)
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
