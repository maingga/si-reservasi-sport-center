'use client';

import { useState } from 'react';
import { FaHome, FaRocket, FaCommentDots } from 'react-icons/fa'; // Adding some icons

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-black py-6 px-4 shadow-xl transition-all sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-white hover:text-secondary cursor-pointer transition-all duration-300">
          Sport Center
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <ul className="flex space-x-8 text-lg font-semibold text-white">
            <li className="flex items-center space-x-2">
              <FaHome className="h-5 w-5 text-link-hover" />
              <a
                href="#"
                className="hover:text-link-hover border-b-2 border-transparent hover:border-link-hover transition-all duration-300"
              >
                Home
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaRocket className="h-5 w-5 text-link-hover" />
              <a
                href="#features"
                className="hover:text-link-hover border-b-2 border-transparent hover:border-link-hover transition-all duration-300"
              >
                Features
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaCommentDots className="h-5 w-5 text-link-hover" />
              <a
                href="#testimonial"
                className="hover:text-link-hover border-b-2 border-transparent hover:border-link-hover transition-all duration-300"
              >
                Testimonial
              </a>
            </li>
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'} // Accessibility improvement
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round" // Fixed to use camelCase for JSX
              strokeLinejoin="round" // Fixed to use camelCase for JSX
              strokeWidth="2" // Fixed to use camelCase for JSX
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black text-white py-4 px-6">
          <ul className="space-y-4">
            <li className="flex items-center space-x-2">
              <FaHome className="h-5 w-5 text-link-hover" />
              <a
                href="#"
                className="block text-lg font-medium hover:text-link-hover transition-colors duration-300"
              >
                Home
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaRocket className="h-5 w-5 text-link-hover" />
              <a
                href="#features"
                className="block text-lg font-medium hover:text-link-hover transition-colors duration-300"
              >
                Features
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaCommentDots className="h-5 w-5 text-link-hover" />
              <a
                href="#testimonial"
                className="block text-lg font-medium hover:text-link-hover transition-colors duration-300"
              >
                Testimonial
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
