import React, { useState } from 'react';
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
            <NavLink to="/" className={({ isActive }) =>
              isActive ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'
            }>
              Home
            </NavLink>
            <NavLink to="/analyze" className={({ isActive }) =>
              isActive ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'
            }>
              Analyze
            </NavLink>
            <NavLink to="/history" className={({ isActive }) =>
              isActive ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'
            }>
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
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col p-6 animate-slide-in">
          <button
            className="self-end text-gray-600 hover:text-gray-900 mb-6"
            onClick={toggleMobileMenu}
          >
            <X className="h-8 w-8" />
          </button>
          <div className="flex flex-col items-center space-y-4">
            <NavLink to="/" onClick={toggleMobileMenu}>
              Home
            </NavLink>
            <NavLink to="/analyze" onClick={toggleMobileMenu}>
              Analyze
            </NavLink>
            <NavLink to="/history" onClick={toggleMobileMenu}>
              History
            </NavLink>
          </div>
          <div className="mt-auto flex justify-center">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
}
