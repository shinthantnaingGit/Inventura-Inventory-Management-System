"use client";
import React from "react";

/**
 * InventoryListMobileSkeleton
 * - Card-style loading skeleton for mobile list (NOT a table)
 * - Use alongside InventoryListMobile (e.g., render when productsLoading)
 *
 * Props:
 *   - rows?: number (default 6)
 */
export default function InventoryListMobileSkeleton({ rows = 6 }) {
  return (
    <ul
      role="list"
      className="space-y-3"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading products"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <li
          key={i}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-4"
        >
          <div className="animate-pulse space-y-3">
            {/* Badge row */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-24 rounded-full bg-blue-100 dark:bg-blue-900/40" />
            </div>

            {/* Title */}
            <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

            {/* Price line */}
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />

            {/* Actions (3 buttons) */}
            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="h-8 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800" />
              <div className="h-8 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800" />
              <div className="h-8 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
