"use client";
import React, { useState } from "react";
import { DarkThemeToggle } from "flowbite-react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        {/* Logo/Brand Name is a Link to the homepage */}
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          Shinichi IT Solutions
        </Link>

        {/* Desktop Menu and Theme Toggle */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
          >
            Pricing
          </a>
          <Link
            href="/contact"
            className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Get Started
          </Link>
          <DarkThemeToggle />
        </div>

        {/* Mobile Menu Button and Theme Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <DarkThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className="block text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <a
            href="#"
            className="block text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            className="block text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
          >
            Pricing
          </a>
          <Link
            href="/contact"
            className="block text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
