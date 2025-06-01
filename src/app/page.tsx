"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  const featuredArtworks = [
    {
      id: 1,
      title: "Modern Abstract",
      artist: "Jane Doe",
      price: "$299",
      image: "/images/arts/modernabstractdigart.jpg",
      category: "Digital Art",
    },
    {
      id: 2,
      title: "Architecture Draft",
      artist: "John Smith",
      price: "$150",
      image: "/images/arts/architecturedraft.jpg",
      category: "Drafting",
    },
    {
      id: 3,
      title: "Logo Design",
      artist: "Alex Chen",
      price: "$99",
      image: "/images/arts/logodesign.jpg",
      category: "Design",
    },
    {
      id: 4,
      title: "Portrait Commission",
      artist: "Maria Garcia",
      price: "$450",
      image: "/images/arts/potraitcommision.jpeg",
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
      <Header />

      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The Art{" "}
            <span className="text-green-600">Marketplace</span>
          </h1>          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Buy, sell, and discover unique artwork, design services, and digital
            creations. From drafting data to custom art commissions.
          </p>
          
          {/* Browse Now Button */}
          <div className="max-w-2xl mx-auto">
            <Link 
              href="/browse"
              className="inline-block bg-green-600 text-white px-12 py-4 text-lg font-semibold rounded-full hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Browse Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse Categories
          </h2>          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/browse?category=${encodeURIComponent(category.name)}`}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer block"
              >
                <div
                  className={`w-12 h-12 ${category.color} rounded-lg mb-4`}
                ></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600">{category.count} items</p>
              </Link>
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
            <Link href="/browse" className="text-green-600 hover:text-green-700 font-medium">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
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
            <Link href="/sell" className="bg-green-600 text-white px-8 py-3 rounded-md text-lg hover:bg-green-700 text-center">
              Start Selling
            </Link>
            <Link href="/about" className="border border-white text-white px-8 py-3 rounded-md text-lg hover:bg-white hover:text-black text-center">
              Learn More
            </Link>
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
