import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test users with fixed UUIDs for testing
  // These can match test accounts or be used for demo purposes
  const user1 = await prisma.user.upsert({
    where: { email: 'jane.doe@example.com' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440001', // Fixed UUID
      email: 'jane.doe@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'john.smith@example.com' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440002', // Fixed UUID
      email: 'john.smith@example.com',
      firstName: 'John',
      lastName: 'Smith',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'alex.chen@example.com' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440003', // Fixed UUID
      email: 'alex.chen@example.com',
      firstName: 'Alex',
      lastName: 'Chen',
    },
  });// Create test artworks
  const artwork1 = await prisma.artwork.create({
    data: {
      title: 'Modern Abstract Digital Art',
      description: 'A stunning modern abstract piece with vibrant colors and dynamic composition. Perfect for contemporary spaces.',
      category: 'Digital Art',
      price: 4500000, // Rp 4,500,000
      tags: ["abstract", "modern", "digital", "vibrant"],
      medium: 'Digital',
      dimensions: '3840x2160px',
      isDigital: true,
      isCommission: false,
      status: 'active',
      imageUrl: '/images/arts/modernabstractdigart.jpg',
      userId: user1.id,
    },
  });  const artwork2 = await prisma.artwork.create({
    data: {
      title: 'Professional Architecture Draft',
      description: 'Professional architectural drafting with precise measurements and detailed specifications for residential projects.',
      category: 'Drafting',
      price: 2250000, // Rp 2,250,000
      tags: ["architecture", "technical", "residential", "blueprint"],
      medium: 'Technical Drawing',
      dimensions: 'A1',
      isDigital: false,
      isCommission: true,
      status: 'active',
      imageUrl: '/images/arts/architecturedraft.jpg',
      userId: user2.id,
    },
  });  const artwork3 = await prisma.artwork.create({
    data: {
      title: 'Creative Logo Design Package',
      description: 'Complete logo design service for businesses and personal brands. Includes multiple concepts and revisions.',
      category: 'Design',
      price: 1500000, // Rp 1,500,000
      tags: ["logo", "branding", "business", "identity"],
      medium: 'Vector Graphics',
      dimensions: 'Scalable',
      isDigital: true,
      isCommission: true,
      status: 'active',
      imageUrl: '/images/arts/logodesign.jpg',
      userId: user3.id,
    },
  });  const artwork4 = await prisma.artwork.create({
    data: {
      title: 'Custom Portrait Commission',
      description: 'Beautiful custom portrait commission using traditional painting techniques. Hand-painted with attention to detail.',
      category: 'Traditional Art',
      price: 6750000, // Rp 6,750,000
      tags: ["portrait", "traditional", "custom", "painting"],
      medium: 'Oil on Canvas',
      dimensions: '16x20 inches',
      isDigital: false,
      isCommission: true,
      status: 'active',
      imageUrl: '/images/arts/potraitcommision.jpeg',
      userId: user1.id,
    },
  });
  // Create artwork files (sample images)
  await prisma.artworkFile.create({
    data: {
      artworkId: artwork1.id,
      fileName: 'modern-abstract.jpg',
      fileUrl: '/images/arts/modernabstractdigart.jpg',
      fileType: 'image/jpeg',
      fileSize: 1024000,
    },
  });

  await prisma.artworkFile.create({
    data: {
      artworkId: artwork2.id,
      fileName: 'architecture-draft.jpg',
      fileUrl: '/images/arts/architecturedraft.jpg',
      fileType: 'image/jpeg',
      fileSize: 2048000,
    },
  });

  await prisma.artworkFile.create({
    data: {
      artworkId: artwork3.id,
      fileName: 'logo-design.jpg',
      fileUrl: '/images/arts/logodesign.jpg',
      fileType: 'image/jpeg',
      fileSize: 512000,
    },
  });

  await prisma.artworkFile.create({
    data: {
      artworkId: artwork4.id,
      fileName: 'portrait-commission.jpg',
      fileUrl: '/images/arts/potraitcommision.jpeg',
      fileType: 'image/jpeg',
      fileSize: 1536000,
    },
  });

  console.log('Seed data created successfully!');
  console.log(`Created ${await prisma.user.count()} users`);
  console.log(`Created ${await prisma.artwork.count()} artworks`);
  console.log(`Created ${await prisma.artworkFile.count()} artwork files`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
