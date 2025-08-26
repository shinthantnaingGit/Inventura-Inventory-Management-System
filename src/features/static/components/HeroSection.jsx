// components/HeroSection.jsx
import Link from 'next/link';
import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 text-center py-20 md:py-32">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
          Effortless Invoicing from Shinichi IT Solutions
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Create, send, and track professional invoices with ease. Focus on what you do best, we'll handle the rest.
        </p>
        <Link href={"/login"} className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg py-3 px-8 rounded-lg transition-colors">
          Start Your Free Trial
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;