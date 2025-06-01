import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get artwork with user info
    const { data: artwork, error } = await supabase
      .from('artworks')
      .select(`
        *,
        users:userId (
          id,
          firstName,
          lastName,
          avatar,
          bio
        )
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (error || !artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      )
    }

    // Get artwork files
    const { data: files } = await supabase
      .from('artwork_files')
      .select('*')
      .eq('artworkId', id)
      .order('createdAt', { ascending: true })

    // Get reviews with user info
    const { data: reviews } = await supabase
      .from('reviews')
      .select(`
        *,
        users:buyerId (
          firstName,
          lastName,
          avatar
        )
      `)
      .eq('artworkId', id)
      .order('createdAt', { ascending: false })

    // Get counts
    const { count: favoritesCount } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('artworkId', id)

    // Calculate average rating
    const averageRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

    return NextResponse.json({
      ...artwork,
      artwork_files: files || [],
      reviews: reviews || [],
      _count: {
        favorites: favoritesCount || 0,
        reviews: reviews?.length || 0
      },
      averageRating: Math.round(averageRating * 10) / 10
    })

  } catch (error) {
    console.error('Get artwork error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artwork' },
      { status: 500 }
    )
  }
}
