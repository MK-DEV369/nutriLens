import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Link, NavLink } from 'react-router-dom';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent"
          >
            NutriLens
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-emerald-500 ${
                  isActive ? 'text-emerald-600 font-semibold' : 'text-gray-600'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/analyze"
              className={({ isActive }) =>
                `hover:text-emerald-500 ${
                  isActive ? 'text-emerald-600 font-semibold' : 'text-gray-600'
                }`
              }
            >
              Analyze
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `hover:text-emerald-500 ${
                  isActive ? 'text-emerald-600 font-semibold' : 'text-gray-600'
                }`
              }
            >
              History
            </NavLink>
          </div>
          <div className="flex space-x-4">
            <SignedOut>
              <SignInButton mode="modal" />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-gray-100 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-screen py-6 overflow-hidden">
          <div className="px-4 mb-8">
            <button
              className="self-end text-gray-600 hover:text-gray-900 mb-6"
              onClick={toggleMobileMenu}
            >
              <X className="h-8 w-8" />
            </button>
          </div>

          <nav className="flex flex-col justify-center px-4 pb-4 space-y-6">
            <NavLink
              to="/"
              onClick={toggleMobileMenu}
              className={({ isActive }) =>
                `block text-lg ${
                  isActive ? 'text-emerald-600 font-semibold' : 'text-gray-600'
                } hover:text-emerald-500`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/analyze"
              onClick={toggleMobileMenu}
              className={({ isActive }) =>
                `block text-lg ${
                  isActive ? 'text-emerald-600 font-semibold' : 'text-gray-600'
                } hover:text-emerald-500`
              }
            >
              Analyze
            </NavLink>
            <NavLink
              to="/history"
              onClick={toggleMobileMenu}
              className={({ isActive }) =>
                `block text-lg ${
                  isActive ? 'text-emerald-600 font-semibold' : 'text-gray-600'
                } hover:text-emerald-500`
              }
            >
              History
            </NavLink>
          </nav>

          {/* UserButton at the Center */}
          <div className="mt-auto px-4 pt-4 bg-gray-100 rounded-md">
            <SignedOut>
              <SignInButton mode="modal" />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}