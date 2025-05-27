"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Artwork {
  id: number;
  title: string;
  artist: string;
  price: string;
  image: string;
  category: string;
  description: string;
}

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);

  // Extended artwork data
  const allArtworks: Artwork[] = [
    {
      id: 1,
      title: "Modern Abstract",
      artist: "Jane Doe",
      price: "$299",
      image: "/images/arts/modernabstractdigart.jpg",
      category: "Digital Art",
      description: "A stunning modern abstract piece with vibrant colors and dynamic composition."
    },
    {
      id: 2,
      title: "Architecture Draft",
      artist: "John Smith",
      price: "$150",
      image: "/images/arts/architecturedraft.jpg",
      category: "Drafting",
      description: "Professional architectural drafting with precise measurements and detailed specifications."
    },
    {
      id: 3,
      title: "Logo Design",
      artist: "Alex Chen",
      price: "$99",
      image: "/images/arts/logodesign.jpg",
      category: "Design",
      description: "Creative logo design service for businesses and personal brands."
    },
    {
      id: 4,
      title: "Portrait Commission",
      artist: "Maria Garcia",
      price: "$450",
      image: "/images/arts/potraitcommision.jpeg",
      category: "Traditional Art",
      description: "Custom portrait commission using traditional painting techniques."
    },
    // Add more sample artworks
    {
      id: 5,
      title: "Digital Illustration",
      artist: "Sarah Wilson",
      price: "$199",
      image: "/images/arts/modernabstractdigart.jpg",
      category: "Digital Art",
      description: "Beautiful digital illustration with contemporary style."
    },
    {
      id: 6,
      title: "Brand Identity Package",
      artist: "Mike Johnson",
      price: "$799",
      image: "/images/arts/logodesign.jpg",
      category: "Design",
      description: "Complete brand identity package including logo, business cards, and style guide."
    },
  ];

  const categories = ["All", "Digital Art", "Design", "Drafting", "Traditional Art"];
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
  ];

  useEffect(() => {
    let filtered = allArtworks;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artwork.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artwork.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((artwork) => artwork.category === selectedCategory);
    }

    // Sort artworks
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseInt(a.price.slice(1)) - parseInt(b.price.slice(1)));
        break;
      case "price-high":
        filtered.sort((a, b) => parseInt(b.price.slice(1)) - parseInt(a.price.slice(1)));
        break;
      case "newest":
        filtered.reverse();
        break;
      default:
        // Keep featured order
        break;
    }

    setFilteredArtworks(filtered);
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <Image
                  src="/images/logos/logo_notext_whitebg.png"
                  alt="PhoRent Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <h1 className="text-2xl font-bold text-black">PhoRent</h1>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/browse" className="text-green-600 font-medium">
                Browse
              </Link>
              <Link href="/sell" className="text-gray-900 hover:text-gray-600">
                Sell
              </Link>
              <Link href="/about" className="text-gray-900 hover:text-gray-600">
                About
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/signin" className="text-gray-900 hover:text-gray-600">
                Sign In
              </Link>
              <Link href="/signup" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search for artwork, artists, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredArtworks.length} result{filteredArtworks.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Artwork Grid */}
        {filteredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
              >
                <div className="aspect-square bg-gray-200 relative">
                  <Image
                    src={artwork.image}
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
                      {artwork.price}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    by {artwork.artist}
                  </p>
                  <p className="text-gray-500 text-xs mb-2">
                    {artwork.category}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {artwork.description}
                  </p>
                  <Link
                    href={`/artwork/${artwork.id}`}
                    className="block w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors text-center"
                  >
                    View Details
                  </Link>
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
