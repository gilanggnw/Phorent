-- Deploy this SQL to your Supabase project
-- You can run this in the SQL Editor in your Supabase dashboard

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    avatar TEXT,
    bio TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Artworks table
CREATE TABLE IF NOT EXISTS artworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "imageUrl" TEXT NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Artwork files table
CREATE TABLE IF NOT EXISTS artwork_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "artworkId" UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    "fileName" VARCHAR(255) NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" VARCHAR(50) NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "buyerId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "sellerId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "commissionAmount" DECIMAL(10,2) NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'pending',
    "stripePaymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    "artworkId" UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "artworkId" UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId", "artworkId")
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "buyerId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "sellerId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "artworkId" UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artworks_user_id ON artworks("userId");
CREATE INDEX IF NOT EXISTS idx_artworks_category ON artworks(category);
CREATE INDEX IF NOT EXISTS idx_artworks_status ON artworks(status);
CREATE INDEX IF NOT EXISTS idx_artworks_created_at ON artworks("createdAt");
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders("buyerId");
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders("sellerId");
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items("orderId");
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites("userId");
CREATE INDEX IF NOT EXISTS idx_reviews_seller_id ON reviews("sellerId");

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you can customize these based on your needs)
-- Users can view their own data
CREATE POLICY users_select_own ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_update_own ON users FOR UPDATE USING (auth.uid() = id);

-- Artworks are publicly viewable, but only owners can modify
CREATE POLICY artworks_select_all ON artworks FOR SELECT TO public USING (true);
CREATE POLICY artworks_insert_own ON artworks FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY artworks_update_own ON artworks FOR UPDATE USING (auth.uid() = "userId");
CREATE POLICY artworks_delete_own ON artworks FOR DELETE USING (auth.uid() = "userId");

-- Artwork files follow artwork permissions
CREATE POLICY artwork_files_select_all ON artwork_files FOR SELECT TO public USING (true);
CREATE POLICY artwork_files_insert_own ON artwork_files FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM artworks 
        WHERE artworks.id = artwork_files."artworkId" 
        AND artworks."userId" = auth.uid()
    )
);

-- Orders can be viewed by buyer or seller
CREATE POLICY orders_select_own ON orders FOR SELECT USING (
    auth.uid() = "buyerId" OR auth.uid() = "sellerId"
);

-- Order items follow order permissions
CREATE POLICY order_items_select_own ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items."orderId" 
        AND (orders."buyerId" = auth.uid() OR orders."sellerId" = auth.uid())
    )
);

-- Favorites can be managed by the user
CREATE POLICY favorites_select_own ON favorites FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY favorites_insert_own ON favorites FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY favorites_delete_own ON favorites FOR DELETE USING (auth.uid() = "userId");

-- Reviews are publicly viewable
CREATE POLICY reviews_select_all ON reviews FOR SELECT TO public USING (true);
CREATE POLICY reviews_insert_own ON reviews FOR INSERT WITH CHECK (auth.uid() = "buyerId");
