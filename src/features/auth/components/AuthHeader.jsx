// components/AuthHeader.jsx
import React from 'react';
import Link from 'next/link';
import { DarkThemeToggle } from 'flowbite-react';

const AuthHeader = () => {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
      <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
        Shin Bakery
      </Link>
      <DarkThemeToggle />
    </div>
  );
};

export default AuthHeader;