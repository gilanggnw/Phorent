import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { getSupabaseUser } from '@/lib/supabase-auth'
import { z } from 'zod'

// Initialize Prisma client
const prisma = new PrismaClient()

const artworkSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  tags: z.array(z.string()).optional(),
  medium: z.string().optional(),
  dimensions: z.string().optional(),
  isDigital: z.boolean().optional(),
  isCommission: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication with Supabase
    const supabaseUser = await getSupabaseUser(request)
    if (!supabaseUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
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

    const uploadedFiles = await Promise.all(uploadPromises)    // Use the first uploaded image as the main imageUrl
    const mainImageUrl = uploadedFiles.length > 0 ? uploadedFiles[0].fileUrl : ''

    // Create artwork in database using Prisma
    const artwork = await prisma.artwork.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        price: validatedData.price,
        tags: validatedData.tags || [],
        medium: validatedData.medium || null,
        dimensions: validatedData.dimensions || null,
        isDigital: validatedData.isDigital || false,
        isCommission: validatedData.isCommission || false,
        userId: supabaseUser.userId,
        imageUrl: mainImageUrl,
        status: 'active',
      }
    })

    // Create files separately
    if (uploadedFiles.length > 0) {
      await prisma.artworkFile.createMany({
        data: uploadedFiles.map(fileData => ({
          artworkId: artwork.id,
          fileName: fileData.fileName,
          fileUrl: fileData.fileUrl,
          fileType: fileData.fileType,
          fileSize: fileData.fileSize,
        }))
      })
    }

    // Fetch the complete artwork with user info
    const completeArtwork = await prisma.artwork.findUnique({
      where: { id: artwork.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        files: true
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
    const userId = searchParams.get('userId') // Add userId filter
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.ArtworkWhereInput = {
      status: 'active'
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Add userId filter for user's own artworks
    if (userId) {
      where.userId = userId
    }

    // Build orderBy clause
    let orderBy: Prisma.ArtworkOrderByWithRelationInput = { createdAt: 'desc' } // default: newest

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
        orderBy = { createdAt: 'desc' }
        break
    }

    // Fetch artworks with relations
    const artworks = await prisma.artwork.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        files: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            fileType: true
          }
        }
      }
    })

    // Get total count for pagination
    const totalCount = await prisma.artwork.count({ where })

    return NextResponse.json({
      success: true,
      artworks,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Get artworks error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    )  } finally {
    await prisma.$disconnect()
  }
}
