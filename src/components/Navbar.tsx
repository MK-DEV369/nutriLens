import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

export function Navbar() {
  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.location.href = path;
  };

  const isCurrentPath = (path: string) => window.location.pathname === path;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a 
              href="/"
              onClick={(e) => handleNavigation(e, '/')}
              className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent"
            >
              NutriLens
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              href="/" 
              onClick={(e) => handleNavigation(e, '/')}
              isActive={isCurrentPath('/')}
            >
              Home
            </NavLink>
            <NavLink 
              href="/analyze" 
              onClick={(e) => handleNavigation(e, '/analyze')}
              isActive={isCurrentPath('/analyze')}
            >
              Analyze
            </NavLink>
          </div>
          <div className="flex sticky space-x-4">
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
        <div className="md:hidden fixed inset-0 bg-gray-100 z-50 p-4">
          <div className="flex flex-col items-center space-y-6">
            <NavLink href="/" onClick={(e) => handleNavigation(e, '/')} isActive={isCurrentPath('/')}>
              Home
            </NavLink>
            <NavLink href="/analyze" onClick={(e) => handleNavigation(e, '/analyze')} isActive={isCurrentPath('/')}>
              Analyze
            </NavLink>
          </div>
          <div className="mt-auto flex justify-center">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      )} :
    </nav>
  );
}

function NavLink({ 
  href, 
  children, 
  isActive, 
  onClick 
}: { 
  href: string; 
  children: React.ReactNode; 
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`${
        isActive ? 'text-emerald-600' : 'text-gray-600'
      } hover:text-emerald-500 px-3 py-2 rounded-md text-sm font-medium transition-colors`}
    >
      {children}
    </a>
  );
}