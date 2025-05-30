const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create test users first
  const user1 = await prisma.user.create({
    data: {
      email: 'jane.doe@example.com',
      password: 'hashedpassword123', // In real app, this would be properly hashed
      firstName: 'Jane',
      lastName: 'Doe',
      isVerified: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'john.smith@example.com',
      password: 'hashedpassword123',
      firstName: 'John',
      lastName: 'Smith',
      isVerified: true,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'alex.chen@example.com',
      password: 'hashedpassword123',
      firstName: 'Alex',
      lastName: 'Chen',
      isVerified: true,
    },
  });

  // Create test artworks
  const artwork1 = await prisma.artwork.create({
    data: {
      title: 'Modern Abstract Digital Art',
      description: 'A stunning modern abstract piece with vibrant colors and dynamic composition. Perfect for contemporary spaces.',
      category: 'Digital Art',
      price: 299,
      tags: JSON.stringify(['abstract', 'modern', 'digital', 'vibrant']),
      medium: 'Digital',
      dimensions: '3840x2160px',
      isDigital: true,
      isCommission: false,
      status: 'ACTIVE',
      userId: user1.id,
    },
  });

  const artwork2 = await prisma.artwork.create({
    data: {
      title: 'Professional Architecture Draft',
      description: 'Professional architectural drafting with precise measurements and detailed specifications for residential projects.',
      category: 'Drafting',
      price: 150,
      tags: JSON.stringify(['architecture', 'technical', 'residential', 'blueprint']),
      medium: 'Technical Drawing',
      dimensions: 'A1',
      isDigital: false,
      isCommission: true,
      status: 'ACTIVE',
      userId: user2.id,
    },
  });

  const artwork3 = await prisma.artwork.create({
    data: {
      title: 'Creative Logo Design Package',
      description: 'Complete logo design service for businesses and personal brands. Includes multiple concepts and revisions.',
      category: 'Design',
      price: 99,
      tags: JSON.stringify(['logo', 'branding', 'business', 'identity']),
      medium: 'Vector Graphics',
      dimensions: 'Scalable',
      isDigital: true,
      isCommission: true,
      status: 'ACTIVE',
      userId: user3.id,
    },
  });

  const artwork4 = await prisma.artwork.create({
    data: {
      title: 'Custom Portrait Commission',
      description: 'Beautiful custom portrait commission using traditional painting techniques. Hand-painted with attention to detail.',
      category: 'Traditional Art',
      price: 450,
      tags: JSON.stringify(['portrait', 'traditional', 'custom', 'painting']),
      medium: 'Oil on Canvas',
      dimensions: '16x20 inches',
      isDigital: false,
      isCommission: true,
      status: 'ACTIVE',
      userId: user1.id,
    },
  });

  // Create artwork files (sample images)
  await prisma.artworkFile.create({
    data: {
      artworkId: artwork1.id,
      filename: 'modern-abstract.jpg',
      url: '/images/arts/modernabstractdigart.jpg',
      type: 'image/jpeg',
      size: 1024000,
      order: 1,
    },
  });

  await prisma.artworkFile.create({
    data: {
      artworkId: artwork2.id,
      filename: 'architecture-draft.jpg',
      url: '/images/arts/architecturedraft.jpg',
      type: 'image/jpeg',
      size: 2048000,
      order: 1,
    },
  });

  await prisma.artworkFile.create({
    data: {
      artworkId: artwork3.id,
      filename: 'logo-design.jpg',
      url: '/images/arts/logodesign.jpg',
      type: 'image/jpeg',
      size: 512000,
      order: 1,
    },
  });

  await prisma.artworkFile.create({
    data: {
      artworkId: artwork4.id,
      filename: 'portrait-commission.jpg',
      url: '/images/arts/potraitcommision.jpeg',
      type: 'image/jpeg',
      size: 1536000,
      order: 1,
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
