"use client";
import React from "react";

/**
 * ProductDetailSkeleton
 *
 * A shimmering placeholder for the product detail view.
 * It uses `animate-pulse` and dark-mode variants so it looks good
 * in both light and dark themes.
 */
const ProductDetailSkeleton = () => {
  return (
    <section className="space-y-5" aria-busy="true" aria-live="polite">
      {/* Header placeholder */}
      <div className="h-6 w-40 md:w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

      {/* Card placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-10 space-y-6 mx-auto max-w-[100%] sm:max-w-[70%] lg:max-w-[60%]">
        {/* Top row: ID badge, product name, and edit button placeholder */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* ID badge skeleton */}
          <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

          {/* Product name skeleton */}
          <div className="h-7 w-2/3 sm:w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1"></div>

          {/* Edit button skeleton */}
          <div className="h-8 w-20 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>

        {/* Price placeholder */}
        <div className="h-6 w-1/4 sm:w-1/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

        {/* Meta info placeholders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="h-12 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="h-12 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="h-12 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse md:hidden"></div>
        </div>
      </div>

      <p className="sr-only">Loading product details…</p>
    </section>
  );
};

export default ProductDetailSkeleton;
