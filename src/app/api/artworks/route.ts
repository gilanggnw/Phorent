import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { getTokenFromRequest, verifyJWT } from '@/lib/auth'
import { z } from 'zod'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const artworkSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  tags: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyJWT(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const artworkData = JSON.parse(formData.get('artworkData') as string)
    const files = formData.getAll('files') as File[]

    // Validate artwork data
    const validatedData = artworkSchema.parse(artworkData)    // Upload files to Cloudinary
    const uploadPromises = files.map(async (file, index) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const { url } = await uploadToCloudinary(buffer, 'phorent/artworks')
      return {
        fileName: file.name,
        fileUrl: url,
        fileType: file.type.startsWith('image/') ? 'image' : 'video',
        fileSize: file.size,
        order: index,
      }
    })

    const uploadedFiles = await Promise.all(uploadPromises)

    // Use the first uploaded image as the main imageUrl
    const mainImageUrl = uploadedFiles.length > 0 ? uploadedFiles[0].fileUrl : ''

    // Create artwork in database using Supabase
    const { data: artwork, error: artworkError } = await supabase
      .from('artworks')
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        price: validatedData.price,
        tags: validatedData.tags || [],
        userId: decoded.userId,
        imageUrl: mainImageUrl,
        status: 'active',
      })
      .select()
      .single()

    if (artworkError) {
      console.error('Artwork creation error:', artworkError)
      return NextResponse.json(
        { error: 'Failed to create artwork' },
        { status: 500 }
      )
    }    // Create files separately
    if (uploadedFiles.length > 0) {
      await supabase
        .from('artwork_files')
        .insert(
          uploadedFiles.map(fileData => ({
            artworkId: artwork.id,
            fileName: fileData.fileName,
            fileUrl: fileData.fileUrl,
            fileType: fileData.fileType,
            fileSize: fileData.fileSize,
          }))
        )
    }

    // Fetch the complete artwork with user info
    const { data: completeArtwork } = await supabase
      .from('artworks')
      .select(`
        *,
        users:userId (
          id,
          firstName,
          lastName,
          avatar
        )
      `)
      .eq('id', artwork.id)
      .single()

    return NextResponse.json({ 
      success: true, 
      artwork: completeArtwork,
      message: 'Artwork uploaded successfully' 
    })

  } catch (error) {
    console.error('Artwork upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload artwork' },
      { status: 500 }
    )
  }
}

// Get all artworks (for browse page)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'featured'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('artworks')
      .select(`
        *,
        users:userId (
          id,
          firstName,
          lastName,
          avatar
        ),
        artwork_files (
          id,
          fileName,
          fileUrl,
          fileType
        )
      `)
      .eq('status', 'active')

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        query = query.order('price', { ascending: true })
        break
      case 'price-high':
        query = query.order('price', { ascending: false })
        break
      case 'newest':
        query = query.order('createdAt', { ascending: false })
        break
      case 'featured':
      default:
        query = query.order('createdAt', { ascending: false })
        break
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: artworks, error } = await query

    if (error) {
      console.error('Get artworks error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch artworks' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('artworks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    if (category && category !== 'all') {
      countQuery = countQuery.eq('category', category)
    }

    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { count: total } = await countQuery

    return NextResponse.json({
      artworks,
      pagination: {
        page,
        limit,
        total: total || 0,
        pages: Math.ceil((total || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Get artworks error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    )
  }
}
