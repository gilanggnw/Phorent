"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatPrice } from "@/utils/currency";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";

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
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  files: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
}

export default function ArtworkDetail() {
  const params = useParams();
  const artworkId = params.id as string;
  const { addItem, isInCart } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [addToCartMessage, setAddToCartMessage] = useState("");
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/artworks/${artworkId}`);
        
        if (!response.ok) {
          throw new Error('Artwork not found');
        }
        
        const data = await response.json();
        setArtwork(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artwork');
      } finally {
        setLoading(false);
      }
    };

    if (artworkId) {
      fetchArtwork();
    }  }, [artworkId]);

  const images = artwork ? [
    artwork.files?.[0]?.fileUrl || artwork.imageUrl || "/images/placeholder.jpg",
    // Add more images if available
    ...(artwork.files?.slice(1, 3).map(file => file.fileUrl) || [])
  ] : [];

  const handlePurchase = () => {
    if (!artwork) return;
    console.log("Purchase artwork:", artwork.id);
  };

  const handleAddToCart = () => {
    if (!artwork) return;
    
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
    setAddToCartMessage("✅ Added to cart!");
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setAddToCartMessage("");
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading artwork...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Artwork Not Found</h3>
            <p className="text-gray-600 mb-4">{error || 'The artwork you are looking for does not exist.'}</p>
            <Link
              href="/browse"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Back to Browse
            </Link>
          </div>        </div>
      </div>
    );
  }


  return (    <div className="min-h-screen bg-white">
      <Header />

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
              <p className="text-lg text-gray-600">by {artwork.user?.firstName} {artwork.user?.lastName}</p>
            </div>            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-green-600">{formatPrice(artwork.price)}</span>
            </div>

            {/* Category and Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full">{artwork.category}</span>              <span>0 views</span>
              <span>0 likes</span>
              {artwork.category === 'Digital Art' && (
                <span>0 downloads</span>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 mb-2">{artwork.description}</p>
              {showFullDescription && (
                <p className="text-gray-700">{artwork.description}</p>
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
                <span>Not specified</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Medium:</span>
                <span>{artwork.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Created:</span>
                <span>{new Date(artwork.createdAt).toLocaleDateString()}</span>
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
            </div>            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePurchase}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {artwork.category === 'Digital Art' ? "Buy & Download" : "Purchase Artwork"}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart(artwork.id.toString())}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    isInCart(artwork.id.toString())
                      ? "bg-green-100 text-green-700 cursor-not-allowed"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {isInCart(artwork.id.toString()) ? "In Cart" : "Add to Cart"}
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
              {addToCartMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm font-medium text-center">
                    {addToCartMessage}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Artist Info */}
        <div className="bg-gray-50 p-6 rounded-lg mb-12">
          <div className="flex items-start space-x-4">
            <Image              src={artwork.user?.avatar || "/images/placeholder-avatar.jpg"}
              alt={`${artwork.user?.firstName} ${artwork.user?.lastName}`}
              width={60}
              height={60}
              className="rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                About {artwork.user?.firstName} {artwork.user?.lastName}
              </h3>
              <p className="text-gray-700 mb-4">Artist biography not available.</p>
              <Link
                href={`/artist/${artwork.user?.firstName?.toLowerCase()}-${artwork.user?.lastName?.toLowerCase()}`}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                View all artworks by {artwork.user?.firstName} {artwork.user?.lastName} →
              </Link>
            </div>
          </div>
        </div>

        {/* Related Artworks */}        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Artworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">🎨</p>
              <p className="text-gray-600">Related artworks coming soon!</p>
              <Link
                href="/browse"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Browse all artworks →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
