"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Artwork {
  id: number;
  title: string;
  artist: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  description: string;
  fullDescription: string;
  dimensions: string;
  medium: string;
  created: string;
  tags: string[];
  artistAvatar: string;
  artistBio: string;
  isDigital: boolean;
  downloads?: number;
  views: number;
  likes: number;
}

export default function ArtworkDetail() {
  const params = useParams();
  const artworkId = params.id as string;
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Mock data - in a real app, this would come from an API
  const artwork: Artwork = {
    id: parseInt(artworkId),
    title: "Modern Abstract Digital Art",
    artist: "Jane Doe",
    price: "$299",
    originalPrice: "$399",
    image: "/images/arts/modernabstractdigart.jpg",
    category: "Digital Art",
    description: "A stunning modern abstract piece with vibrant colors and dynamic composition.",
    fullDescription: "This captivating digital artwork represents the intersection of traditional abstract expressionism and contemporary digital techniques. Created using advanced digital painting methods, the piece explores themes of movement, energy, and emotional depth through bold color palettes and dynamic compositional elements. The artwork is available as a high-resolution digital download, perfect for printing on various mediums or digital display. Each purchase includes multiple file formats optimized for different use cases, from web display to large-format printing.",
    dimensions: "3840 x 2160 pixels",
    medium: "Digital Painting",
    created: "2024",
    tags: ["abstract", "modern", "digital", "colorful", "contemporary"],
    artistAvatar: "/images/logos/logo_notext_whitebg.png",
    artistBio: "Jane Doe is a contemporary digital artist specializing in abstract expressionism. With over 10 years of experience in digital art creation, she has sold over 500 pieces worldwide.",
    isDigital: true,
    downloads: 143,
    views: 2847,
    likes: 89
  };

  const images = [
    artwork.image,
    artwork.image, // In a real app, these would be different images
    artwork.image,
  ];

  const relatedArtworks = [
    {
      id: 2,
      title: "Architecture Draft",
      artist: "John Smith",
      price: "$150",
      image: "/images/arts/architecturedraft.jpg",
    },
    {
      id: 3,
      title: "Logo Design",
      artist: "Alex Chen",
      price: "$99",
      image: "/images/arts/logodesign.jpg",
    },
    {
      id: 4,
      title: "Portrait Commission",
      artist: "Maria Garcia",
      price: "$450",
      image: "/images/arts/potraitcommision.jpeg",
    },
  ];

  const handlePurchase = () => {
    // Handle purchase logic
    console.log("Purchase artwork:", artwork.id);
  };

  const handleAddToCart = () => {
    // Handle add to cart logic
    console.log("Add to cart:", artwork.id);
  };

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
              <Link href="/browse" className="text-gray-900 hover:text-gray-600">
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
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-gray-400 hover:text-gray-500">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/browse" className="ml-4 text-gray-400 hover:text-gray-500">
                Browse
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-4 text-gray-500 font-medium">
                {artwork.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={images[selectedImage]}
                alt={artwork.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-green-500" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${artwork.title} view ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Artwork Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{artwork.title}</h1>
              <p className="text-lg text-gray-600">by {artwork.artist}</p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-green-600">{artwork.price}</span>
              {artwork.originalPrice && (
                <span className="text-xl text-gray-400 line-through">{artwork.originalPrice}</span>
              )}
            </div>

            {/* Category and Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full">{artwork.category}</span>
              <span>{artwork.views.toLocaleString()} views</span>
              <span>{artwork.likes} likes</span>
              {artwork.isDigital && artwork.downloads && (
                <span>{artwork.downloads} downloads</span>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 mb-2">{artwork.description}</p>
              {showFullDescription && (
                <p className="text-gray-700">{artwork.fullDescription}</p>
              )}
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                {showFullDescription ? "Show less" : "Read more"}
              </button>
            </div>

            {/* Artwork Details */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Dimensions:</span>
                <span>{artwork.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Medium:</span>
                <span>{artwork.medium}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Created:</span>
                <span>{artwork.created}</span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePurchase}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {artwork.isDigital ? "Buy & Download" : "Purchase Artwork"}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    isLiked
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {isLiked ? "♥ Liked" : "♡ Like"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Artist Info */}
        <div className="bg-gray-50 p-6 rounded-lg mb-12">
          <div className="flex items-start space-x-4">
            <Image
              src={artwork.artistAvatar}
              alt={artwork.artist}
              width={60}
              height={60}
              className="rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                About {artwork.artist}
              </h3>
              <p className="text-gray-700 mb-4">{artwork.artistBio}</p>
              <Link
                href={`/artist/${artwork.artist.toLowerCase().replace(" ", "-")}`}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                View all artworks by {artwork.artist} →
              </Link>
            </div>
          </div>
        </div>

        {/* Related Artworks */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Artworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArtworks.map((relatedArt) => (
              <Link
                key={relatedArt.id}
                href={`/artwork/${relatedArt.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
              >
                <div className="aspect-square bg-gray-200 relative">
                  <Image
                    src={relatedArt.image}
                    alt={relatedArt.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {relatedArt.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">by {relatedArt.artist}</p>
                  <span className="text-green-600 font-bold">{relatedArt.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
