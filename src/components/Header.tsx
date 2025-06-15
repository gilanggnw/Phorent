"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const pathname = usePathname();
  const { user, signOut, isLoading } = useAuth();
  const { itemCount } = useCart();

  const isActivePage = (path: string) => {
    return pathname === path;
  };

  return (
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
            <Link
              href="/browse"
              className={isActivePage("/browse") 
                ? "text-green-600 font-medium" 
                : "text-gray-900 hover:text-gray-600"
              }
            >
              Browse
            </Link>
            <Link
              href="/sell"
              className={isActivePage("/sell") 
                ? "text-green-600 font-medium" 
                : "text-gray-900 hover:text-gray-600"
              }
            >
              Sell
            </Link>            <Link
              href="/about"
              className={isActivePage("/about") 
                ? "text-green-600 font-medium" 
                : "text-gray-900 hover:text-gray-600"
              }
            >
              About
            </Link>
            <Link
              href="/contact"
              className={isActivePage("/contact") 
                ? "text-green-600 font-medium" 
                : "text-gray-900 hover:text-gray-600"
              }
            >
              Contact
            </Link>
          </div>          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H4m3 8v7a1 1 0 001 1h8a1 1 0 001-1v-7M9 20h6" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {isLoading ? (
              <div className="flex items-center space-x-4">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-2 hover:text-green-600 transition-colors">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                  )}
                  <span className="text-gray-900 hidden md:block">
                    {user.firstName} {user.lastName}
                  </span>
                </Link>
                <button
                  onClick={signOut}
                  className="text-gray-900 hover:text-gray-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/signin" 
                  className="text-gray-900 hover:text-gray-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
