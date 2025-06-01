// Seeding script to create test users and sample data for PhoRent
// This script creates real Supabase Auth users and populates sample artworks

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from development file
config({ path: '.env.development.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

interface TestUser {
  email: string
  password: string
  firstName: string
  lastName: string
  bio: string
}

const testUsers: TestUser[] = [
  {
    email: 'john.artist@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Artist',
    bio: 'Professional digital artist specializing in modern abstract art',
  },
  {
    email: 'jane.photographer@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Photographer',
    bio: 'Portrait photographer with 10+ years experience',
  },
  {
    email: 'mike.designer@example.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Designer',
    bio: 'Logo and brand designer helping startups build their identity',
  },
  {
    email: 'sarah.buyer@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Wilson',
    bio: 'Art collector and interior design enthusiast',
  },
]

async function createTestUsers() {
  console.log('🚀 Creating test users in Supabase Auth...')
  const createdUsers: { id: string; email: string; firstName: string; lastName: string }[] = []

  for (const testUser of testUsers) {
    try {
      // First try to get existing user by email
      const { data: existingAuthUsers } = await supabase.auth.admin.listUsers()
      const existingUser = existingAuthUsers.users.find(user => user.email === testUser.email)

      let userId: string
      
      if (existingUser) {
        console.log(`✅ Found existing Supabase user: ${testUser.email} (${existingUser.id})`)
        userId = existingUser.id
      } else {
        // Create user in Supabase Auth
        const { data, error } = await supabase.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            full_name: `${testUser.firstName} ${testUser.lastName}`,
          },
        })

        if (error) {
          console.error(`❌ Error creating user ${testUser.email}:`, error.message)
          continue
        }

        if (!data.user) {
          console.error(`❌ No user data returned for ${testUser.email}`)
          continue
        }

        console.log(`✅ Created Supabase user: ${testUser.email} (${data.user.id})`)
        userId = data.user.id
      }        // Create or update user in Supabase database
        const { error: dbError } = await supabase
          .from('users')
          .upsert({
            id: userId,
            email: testUser.email,
            password: '', // Empty since using Supabase auth
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            bio: testUser.bio,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })

      if (dbError) {
        console.error(`❌ Error creating user in database ${testUser.email}:`, dbError.message)
        continue
      }

      createdUsers.push({
        id: userId,
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
      })

      console.log(`✅ Created/updated app user: ${testUser.email}`)
    } catch (error) {
      console.error(`❌ Error processing user ${testUser.email}:`, error)
    }
  }

  return createdUsers
}

async function createSampleArtworks(users: { id: string; email: string; firstName: string; lastName: string }[]) {
  console.log('🎨 Creating sample artworks...')
  const artworks = [
    {
      title: 'Modern Abstract Digital Art',
      description: 'A vibrant and contemporary abstract digital artwork featuring bold colors and geometric shapes. Perfect for modern living spaces and offices. High-resolution digital file included.',
      price: 150.00,
      category: 'Digital Art',
      tags: ['abstract', 'modern', 'digital', 'contemporary', 'geometric'],
      userId: users[0]?.id, // John Artist
      imageUrl: '/images/arts/modernabstractdigart.jpg',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: 'Professional Portrait Commission',
      description: 'Custom portrait photography session including 2-hour shoot, professional editing, and delivery of high-resolution images. Perfect for professional headshots or family portraits.',
      price: 300.00,
      category: 'Photography',
      tags: ['portrait', 'professional', 'headshot', 'photography', 'custom'],
      userId: users[1]?.id, // Jane Photographer
      imageUrl: '/images/arts/potraitcommision.jpeg',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: 'Custom Logo Design Package',
      description: 'Complete logo design package including initial concepts, revisions, and final files in multiple formats (PNG, SVG, PDF). Includes brand guideline document.',
      price: 250.00,
      category: 'Design',
      tags: ['logo', 'branding', 'design', 'business', 'identity'],
      userId: users[2]?.id, // Mike Designer
      imageUrl: '/images/arts/logodesign.jpg',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: 'Architectural Draft & Plans',
      description: 'Detailed architectural drawings and blueprints for residential projects. Includes floor plans, elevations, and technical specifications. CAD files provided.',
      price: 500.00,
      category: 'Architecture',
      tags: ['architecture', 'drafting', 'blueprint', 'technical', 'CAD'],
      userId: users[0]?.id, // John Artist
      imageUrl: '/images/arts/architecturedraft.jpg',
            status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  for (const artwork of artworks) {
    if (!artwork.userId) continue

    try {
      // Create artwork directly in Supabase (keeping imageUrl as it's required)
      const { data: createdArtwork, error: artworkError } = await supabase
        .from('artworks')
        .insert(artwork)
        .select()
        .single()
      
      if (artworkError) {
        console.error(`❌ Error creating artwork ${artwork.title}:`, artworkError.message)
        continue
      }
      
      // Create associated artwork file
      const { error: fileError } = await supabase
        .from('artwork_files')
        .insert({
          artworkId: createdArtwork.id,
          fileName: artwork.imageUrl.split('/').pop() || 'image.jpg',
          fileUrl: artwork.imageUrl,
          fileType: 'image',
          fileSize: 1024000, // 1MB placeholder
          createdAt: new Date().toISOString(),
        })
      
      if (fileError) {
        console.error(`❌ Error creating artwork file for ${artwork.title}:`, fileError.message)
      }
      
      console.log(`✅ Created artwork: ${artwork.title} (${createdArtwork.id})`)
    } catch (error) {
      console.error(`❌ Error creating artwork ${artwork.title}:`, error)
    }
  }
}

async function createSampleData() {
  try {
    console.log('🌱 Starting PhoRent database seeding...\n')

    // Create test users
    const users = await createTestUsers()
    
    if (users.length === 0) {
      console.log('❌ No users created. Exiting...')
      return
    }

    console.log(`\n📊 Created ${users.length} users successfully`)

    // Create sample artworks
    await createSampleArtworks(users)

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📋 Test User Credentials:')
    console.log('Email: john.artist@example.com | Password: password123')
    console.log('Email: jane.photographer@example.com | Password: password123')
    console.log('Email: mike.designer@example.com | Password: password123')
    console.log('Email: sarah.buyer@example.com | Password: password123')
    console.log('\n🚀 You can now test the application with these credentials!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
  }
}

// Run the seeding
createSampleData()
