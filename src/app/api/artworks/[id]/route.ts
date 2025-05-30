import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const artwork = await prisma.artwork.findUnique({
      where: { 
        id: id,
        status: 'ACTIVE'
      },
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
            bio: true,
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            favorites: true,
            reviews: true
          }
        }
      }
    })

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const averageRating = artwork.reviews.length > 0
      ? artwork.reviews.reduce((sum, review) => sum + review.rating, 0) / artwork.reviews.length
      : 0

    return NextResponse.json({
      ...artwork,
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
