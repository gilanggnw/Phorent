import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { getTokenFromRequest, verifyJWT } from '@/lib/auth'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const artworkSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  tags: z.array(z.string()).optional(),
  medium: z.string().optional(),
  dimensions: z.string().optional(),
  isDigital: z.boolean().default(false),
  isCommission: z.boolean().default(false),
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
    const validatedData = artworkSchema.parse(artworkData)

    // Upload files to Cloudinary
    const uploadPromises = files.map(async (file, index) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const { url, publicId } = await uploadToCloudinary(buffer, 'phorent/artworks')
      return {
        filename: file.name,
        url,
        publicId,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        size: file.size,
        order: index,
      }
    })

    const uploadedFiles = await Promise.all(uploadPromises)

    // Create artwork in database
    const artwork = await prisma.artwork.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        price: validatedData.price,
        tags: validatedData.tags || [],
        medium: validatedData.medium || null,
        dimensions: validatedData.dimensions || null,
        isDigital: validatedData.isDigital,
        isCommission: validatedData.isCommission,
        userId: decoded.userId,
      }
    })

    // Create files separately
    for (const fileData of uploadedFiles) {
      await prisma.artworkFile.create({
        data: {
          ...fileData,
          artworkId: artwork.id,
        }
      })
    }

    // Fetch the complete artwork with relations
    const completeArtwork = await prisma.artwork.findUnique({
      where: { id: artwork.id },
      include: {
        files: {
          orderBy: { order: 'asc' }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          }
        }
      }
    })

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
    const skip = (page - 1) * limit

    const where: Prisma.ArtworkWhereInput = {
      status: 'ACTIVE'
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }

    // Handle sorting
    let orderBy: Prisma.ArtworkOrderByWithRelationInput = { createdAt: 'desc' }
    
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'featured':
      default:
        orderBy = { createdAt: 'desc' } // Default to newest for now
        break
    }

    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        where,
        include: {
          files: {
            orderBy: { order: 'asc' },
            take: 1 // Just get the first image for listing
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            }
          },
          _count: {
            select: {
              favorites: true,
              reviews: true
            }
          }
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.artwork.count({ where })
    ])

    return NextResponse.json({
      artworks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
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
