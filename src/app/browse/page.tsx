"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { formatPrice } from "@/utils/currency";
import { useCart } from "@/contexts/CartContext";

interface Artwork {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  tags: string[];
  imageUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;  };
  files: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ArtworkResponse {
  artworks: Artwork[];
  pagination: PaginationInfo;
}

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0  });
  
  const { addItem, isInCart } = useCart();
  
  const handleAddToCart = (artwork: Artwork, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to artwork detail page
    e.stopPropagation();
    
    const cartItem = {
      id: artwork.id,
      title: artwork.title,
      price: artwork.price,
      imageUrl: artwork.files?.[0]?.fileUrl || artwork.imageUrl || "/images/placeholder.jpg",
      artist: {
        firstName: artwork.user?.firstName || 'Unknown',
        lastName: artwork.user?.lastName || 'Artist'
      },
      isDigital: artwork.category === 'Digital Art'
    };

    addItem(cartItem);
  };

  const categories = ["All", "Digital Art", "Design", "Drafting", "Traditional Art"];
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
  ];
  // Fetch artworks from API
  const fetchArtworks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      if (selectedCategory !== "All") {
        params.append('category', selectedCategory);
      }

      if (sortBy !== "featured") {
        params.append('sortBy', sortBy);
      }

      const response = await fetch(`/api/artworks?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch artworks');
      }

      const data: ArtworkResponse = await response.json();
      setArtworks(data.artworks);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load artworks');
      console.error('Error fetching artworks:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, sortBy, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Artworks</h1>
          <p className="text-gray-600">Discover amazing artwork, designs, and creative services from talented artists worldwide.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>              <input
                type="text"
                id="search"
                placeholder="Search for artwork, artists, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>        {/* Results Count */}
        <div className="mb-6">
          {loading ? (
            <p className="text-gray-600">Loading artworks...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : (
            <p className="text-gray-600">
              Showing {artworks.length} of {pagination.total} result{pagination.total !== 1 ? 's' : ''}
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </p>
          )}
        </div>

        {/* Artwork Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h3>
            <p className="text-gray-600">Fetching artworks for you...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Artworks</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchArtworks}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        ) : artworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
              >                <div className="aspect-square bg-gray-200 relative">
                  <Image
                    src={artwork.files?.[0]?.fileUrl || artwork.imageUrl || "/images/placeholder.jpg"}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {artwork.title}
                    </h3>
                    <span className="text-green-600 font-bold text-lg">
                      {formatPrice(artwork.price)}
                    </span>
                  </div>                  <p className="text-gray-600 text-sm mb-1">
                    by {artwork.user?.firstName || 'Unknown'} {artwork.user?.lastName || 'Artist'}
                  </p>
                  <p className="text-gray-500 text-xs mb-2">
                    {artwork.category}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {artwork.description}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/artwork/${artwork.id}`}
                      className="block w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={(e) => handleAddToCart(artwork, e)}
                      className={`flex-1 px-4 py-2 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
                        isInCart(artwork.id)
                          ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                      disabled={isInCart(artwork.id)}
                    >
                      {isInCart(artwork.id) ? (
                        <>✔ Added to Cart</>
                      ) : (
                        <>🛒 Add to Cart</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No artworks found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSortBy("featured");
              }}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
