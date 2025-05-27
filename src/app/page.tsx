"use client";

import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const featuredArtworks = [
    {
      id: 1,
      title: "Modern Abstract",
      artist: "Jane Doe",
      price: "$299",
      image: "/api/placeholder/300/300",
      category: "Digital Art",
    },
    {
      id: 2,
      title: "Architecture Draft",
      artist: "John Smith",
      price: "$150",
      image: "/api/placeholder/300/300",
      category: "Drafting",
    },
    {
      id: 3,
      title: "Logo Design",
      artist: "Alex Chen",
      price: "$99",
      image: "/api/placeholder/300/300",
      category: "Design",
    },
    {
      id: 4,
      title: "Portrait Commission",
      artist: "Maria Garcia",
      price: "$450",
      image: "/api/placeholder/300/300",
      category: "Traditional Art",
    },
  ];

  const categories = [
    { name: "Digital Art", count: "2.5k+", color: "bg-purple-500" },
    { name: "Design Services", count: "1.8k+", color: "bg-blue-500" },
    { name: "Drafting Data", count: "950+", color: "bg-green-500" },
    { name: "Traditional Art", count: "3.2k+", color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">PhoRent</h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-900 hover:text-gray-600"
              >
                Browse
              </a>
              <a
                href="#"
                className="text-gray-900 hover:text-gray-600"
              >
                Sell
              </a>
              <a
                href="#"
                className="text-gray-900 hover:text-gray-600"
              >
                About
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-900 hover:text-gray-600">
                Sign In
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The Art{" "}
            <span className="text-green-600">Marketplace</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Buy, sell, and discover unique artwork, design services, and digital
            creations. From drafting data to custom art commissions.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for artwork, designs, or artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button className="absolute right-2 top-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div
                  className={`w-12 h-12 ${category.color} rounded-lg mb-4`}
                ></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600">{category.count} items</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Artworks
            </h2>
            <button className="text-green-600 hover:text-green-700 font-medium">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="aspect-square bg-gray-200 relative">
                  <span className="absolute inset-0 flex items-center justify-center text-gray-500">
                    {artwork.title}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {artwork.title}
                    </h3>
                    <span className="text-green-600 font-bold">
                      {artwork.price}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    by {artwork.artist}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {artwork.category}
                  </p>
                  <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Selling Your Art Today
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of artists and designers already earning on PhoRent.
            List your artwork, set your price, and reach art enthusiasts
            worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-8 py-3 rounded-md text-lg hover:bg-green-700">
              Start Selling
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-md text-lg hover:bg-white hover:text-black">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">PhoRent</h3>
              <p className="text-gray-400">
                The premier marketplace for art, design services, and creative
                work.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white"
                  >
                    Browse Art
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white"
                  >
                    Sell Artwork
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white"
                  >
                    Commission Work
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white"
                  >
                    Safety
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PhoRent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
