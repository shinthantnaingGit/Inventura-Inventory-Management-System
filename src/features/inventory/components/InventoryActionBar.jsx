"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

const InventoryActionBar = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mb-5">
      {/* Search Product Input */}
      <div className="relative w-full sm:w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search product..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Create Product Button */}
      <Link
        href={"/dashboard/inventory/create"}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                         bg-green-500 text-white hover:bg-green-600 
                         dark:bg-green-600 dark:hover:bg-green-700 
                         transition-colors w-full sm:w-auto shadow-xl"
      >
        <Plus className="w-5 h-5" />
        <span>Create Product</span>
      </Link>
    </div>
  );
};

export default InventoryActionBar;
