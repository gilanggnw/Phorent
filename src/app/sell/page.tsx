"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ArtworkForm {
  title: string;
  description: string;
  category: string;
  price: string;
  tags: string;
  medium: string;
  dimensions: string;
  isDigital: boolean;
  isCommission: boolean;
  files: File[];
}

export default function Sell() {
  const [formData, setFormData] = useState<ArtworkForm>({
    title: "",
    description: "",
    category: "",
    price: "",
    tags: "",
    medium: "",
    dimensions: "",
    isDigital: false,
    isCommission: false,
    files: [],
  });

  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const categories = [
    "Digital Art",
    "Traditional Art",
    "Photography",
    "Design",
    "Illustration",
    "Drafting",
    "3D Art",
    "Animation",
    "Other"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFormData({
        ...formData,
        files: [...formData.files, ...newFiles].slice(0, 5) // Max 5 files
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData({
        ...formData,
        files: [...formData.files, ...newFiles].slice(0, 5) // Max 5 files
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = formData.files.filter((_, i) => i !== index);
    setFormData({ ...formData, files: newFiles });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare form data for submission
      const submitFormData = new FormData();
      
      // Add artwork data as JSON
      const artworkData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        medium: formData.medium,
        dimensions: formData.dimensions,
        isDigital: formData.isDigital,
        isCommission: formData.isCommission,
      };
      
      submitFormData.append('artworkData', JSON.stringify(artworkData));
      
      // Add files
      formData.files.forEach((file) => {
        submitFormData.append('files', file);
      });

      // Get token from localStorage (you'll need to implement auth context)
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/artworks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitFormData,
      });

      const result = await response.json();

      if (response.ok) {
        // Success - redirect to artwork page or show success message
        alert('Artwork uploaded successfully!');
        // You could redirect to the artwork page or reset the form
        window.location.href = `/artwork/${result.artwork.id}`;
      } else {
        alert(result.error || 'Failed to upload artwork');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload artwork. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              <Link href="/sell" className="text-green-600 font-medium">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sell Your Artwork</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your creativity with the world. Upload your artwork and start earning from your passion.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-200 text-gray-400"
                }`}>
                  {step}
                </div>
                <span className={`ml-2 ${
                  currentStep >= step ? "text-green-600" : "text-gray-400"
                }`}>
                  {step === 1 && "Upload"}
                  {step === 2 && "Details"}
                  {step === 3 && "Pricing"}
                </span>
                {step < 3 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    currentStep > step ? "bg-green-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: File Upload */}
          {currentStep === 1 && (
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Artwork</h2>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-green-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="text-6xl text-gray-400">🎨</div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Drag and drop your files here
                    </h3>
                    <p className="text-gray-600 mb-4">
                      or click to select files from your computer
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 cursor-pointer"
                    >
                      Choose Files
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Supported formats: JPG, PNG, GIF, MP4, MOV (Max 5 files, 50MB each)
                  </p>
                </div>
              </div>

              {/* File Preview */}
              {formData.files.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Files</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.files.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">                          {file.type.startsWith("image/") ? (
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              📹
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <p className="mt-2 text-sm text-gray-600 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Artwork Details */}
          {currentStep === 2 && (
            <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Artwork Details</h2>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Enter artwork title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Describe your artwork, inspiration, and techniques used"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="medium" className="block text-sm font-medium text-gray-700 mb-2">
                    Medium
                  </label>                  <input
                    type="text"
                    id="medium"
                    name="medium"
                    value={formData.medium}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="e.g., Oil on canvas, Digital, Watercolor"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="e.g., 24x36 inches, 1920x1080 pixels"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Separate tags with commas (e.g., abstract, modern, colorful)"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="isDigital"
                    name="isDigital"
                    type="checkbox"
                    checked={formData.isDigital}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDigital" className="ml-2 block text-sm text-gray-900">
                    This is a digital artwork (downloadable file)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="isCommission"
                    name="isCommission"
                    type="checkbox"
                    checked={formData.isCommission}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isCommission" className="ml-2 block text-sm text-gray-900">
                    Available for commission work
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Set Your Price</h2>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="1"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  PhoRent takes a 5% commission on each sale. You&apos;ll receive {formData.price ? `$${(parseFloat(formData.price) * 0.95).toFixed(2)}` : "$0.00"}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Pricing Guidelines</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Consider the time, effort, and materials invested</li>
                  <li>• Research similar artworks on our platform</li>
                  <li>• Digital downloads typically range from $10-$200</li>
                  <li>• Physical artworks vary widely based on size and medium</li>
                  <li>• You can always adjust pricing later</li>
                </ul>
              </div>

              {/* Summary */}
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Listing Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Title:</span>
                    <span className="font-medium">{formData.title || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium">{formData.category || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium">${formData.price || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Files uploaded:</span>
                    <span className="font-medium">{formData.files.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && formData.files.length === 0) ||
                  (currentStep === 2 && (!formData.title || !formData.description || !formData.category))
                }
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !formData.price}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Publishing..." : "Publish Artwork"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
