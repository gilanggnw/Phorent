-- Sample data for testing PhoRent application
-- Run this in Supabase SQL Editor after creating the schema

-- Insert sample users (using Supabase Auth UUIDs - you'll need to replace these with actual user IDs from Supabase Auth)
INSERT INTO users (id, email, password, "firstName", "lastName", bio) VALUES
('00000000-0000-0000-0000-000000000001', 'john.artist@example.com', '', 'John', 'Artist', 'Professional digital artist specializing in modern abstract art'),
('00000000-0000-0000-0000-000000000002', 'jane.photographer@example.com', '', 'Jane', 'Photographer', 'Portrait photographer with 10+ years experience'),
('00000000-0000-0000-0000-000000000003', 'mike.designer@example.com', '', 'Mike', 'Designer', 'Logo and brand designer helping startups build their identity'),
('00000000-0000-0000-0000-000000000004', 'sarah.buyer@example.com', '', 'Sarah', 'Wilson', 'Art collector and interior design enthusiast')
ON CONFLICT (id) DO NOTHING;

-- Insert sample artworks
INSERT INTO artworks (id, title, description, price, category, tags, "userId", "imageUrl", status) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    'Modern Abstract Digital Art',
    'A vibrant and contemporary abstract digital artwork featuring bold colors and geometric shapes. Perfect for modern living spaces and offices. High-resolution digital file included.',
    150.00,
    'Digital Art',
    ARRAY['abstract', 'modern', 'digital', 'contemporary', 'geometric'],
    '00000000-0000-0000-0000-000000000001',
    '/images/arts/modernabstractdigart.jpg',
    'active'
),
(
    '10000000-0000-0000-0000-000000000002',
    'Professional Portrait Commission',
    'Custom portrait photography session including 2-hour shoot, professional editing, and delivery of high-resolution images. Perfect for professional headshots or family portraits.',
    300.00,
    'Photography',
    ARRAY['portrait', 'professional', 'headshot', 'photography', 'custom'],
    '00000000-0000-0000-0000-000000000002',
    '/images/arts/potraitcommision.jpeg',
    'active'
),
(
    '10000000-0000-0000-0000-000000000003',
    'Custom Logo Design Package',
    'Complete logo design package including initial concepts, revisions, and final files in multiple formats (PNG, SVG, PDF). Includes brand guideline document.',
    250.00,
    'Design',
    ARRAY['logo', 'branding', 'design', 'business', 'identity'],
    '00000000-0000-0000-0000-000000000003',
    '/images/arts/logodesign.jpg',
    'active'
),
(
    '10000000-0000-0000-0000-000000000004',
    'Architectural Draft & Plans',
    'Detailed architectural drawings and blueprints for residential projects. Includes floor plans, elevations, and technical specifications. CAD files provided.',
    500.00,
    'Architecture',
    ARRAY['architecture', 'drafting', 'blueprint', 'technical', 'CAD'],
    '00000000-0000-0000-0000-000000000001',
    '/images/arts/architecturedraft.jpg',
    'active'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample artwork files
INSERT INTO artwork_files ("artworkId", "fileName", "fileUrl", "fileType", "fileSize") VALUES
('10000000-0000-0000-0000-000000000001', 'abstract_art_4k.png', '/files/abstract_art_4k.png', 'image/png', 2048000),
('10000000-0000-0000-0000-000000000001', 'abstract_art_source.psd', '/files/abstract_art_source.psd', 'application/octet-stream', 15728640),
('10000000-0000-0000-0000-000000000003', 'logo_final.svg', '/files/logo_final.svg', 'image/svg+xml', 25600),
('10000000-0000-0000-0000-000000000003', 'logo_brand_guide.pdf', '/files/logo_brand_guide.pdf', 'application/pdf', 1024000),
('10000000-0000-0000-0000-000000000004', 'house_plans.dwg', '/files/house_plans.dwg', 'application/octet-stream', 5120000)
ON CONFLICT (id) DO NOTHING;

-- Insert sample favorites
INSERT INTO favorites ("userId", "artworkId") VALUES
('00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003')
ON CONFLICT ("userId", "artworkId") DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews ("buyerId", "sellerId", "artworkId", rating, comment) VALUES
(
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    5,
    'Amazing artwork! Exactly what I was looking for. The quality is exceptional and the artist was very professional.'
),
(
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    5,
    'Outstanding logo design. The designer really understood our brand vision and delivered beyond expectations.'
)
ON CONFLICT (id) DO NOTHING;
