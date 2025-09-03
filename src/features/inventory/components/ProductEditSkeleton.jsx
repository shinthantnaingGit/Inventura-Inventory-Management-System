"use client";
import React from "react";

const Line = ({ className = "" }) => (
  <div className={`rounded bg-gray-200 dark:bg-gray-700 ${className}`} />
);

/**
 * ProductEditSkeleton
 * - Mirrors the ProductEditForm layout (mobile + desktop)
 * - No logic changes, purely visual
 */
export default function ProductEditSkeleton() {
  return (
    <div className="mx-auto max-w-[80%] sm:max-w-[60%] lg:max-w-[40%] h-[80vh] sm:p-5">
      <div className="animate-pulse">
        {/* Back button (mobile) */}
        <div className="mb-5 sm:hidden inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-2">
          <Line className="h-4 w-4 rounded" />
          <Line className="h-3 w-32" />
        </div>

        {/* Title */}
        <Line className="h-6 w-40 mb-5" />

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-6 space-y-5">
          {/* Product field */}
          <div>
            <Line className="h-4 w-28 mb-2" />
            <Line className="h-10 w-full" />
            <Line className="h-3 w-40 mt-2 opacity-0" />
          </div>

          {/* Price field */}
          <div>
            <Line className="h-4 w-16 mb-2" />
            <Line className="h-10 w-full" />
          </div>

          {/* Confirm checkbox */}
          <div className="flex items-center gap-2">
            <Line className="h-4 w-4 rounded" />
            <Line className="h-3 w-56" />
          </div>

          {/* Go back checkbox */}
          <div className="flex items-center gap-2">
            <Line className="h-4 w-4 rounded" />
            <Line className="h-3 w-72" />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Line className="h-9 w-full sm:w-28" />
            <Line className="h-9 w-full sm:w-40" />
          </div>
        </div>

        {/* Back button (desktop) */}
        <div className="mt-5 hidden sm:inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-2">
          <Line className="h-4 w-4 rounded" />
          <Line className="h-3 w-36" />
        </div>
      </div>
    </div>
  );
}
