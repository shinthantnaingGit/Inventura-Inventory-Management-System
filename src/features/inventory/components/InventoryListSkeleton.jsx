// app/(dashboard)/inventory/InventoryListSkeleton.jsx
"use client";
import React from "react";

export default function InventoryListSkeleton({ rows = 6 }) {
  return (
    <section aria-busy="true" aria-live="polite" className="space-y-5">
      {/* Heading placeholder (for "Inventory List") */}
      <div className="h-6 w-32 md:w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-2"></div>

      {/* Wrap toolbar + table in the same container as real UI */}
      <div className="px-0 lg:px-20 space-y-5">
        {/* Toolbar skeleton: search + create button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          {/* Search bar placeholder */}
          <div className="h-10 w-full sm:w-1/3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          {/* Create button placeholder */}
          <div className="h-10 w-full sm:w-40 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>

        {/* Table skeleton */}
        <div className="relative mx-auto overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right">
            {/* Skeleton header row */}
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3 text-center">
                  <div className="h-3 w-4 rounded bg-gray-200 dark:bg-gray-700 mx-auto"></div>
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  <div className="h-3 w-24 sm:w-32 rounded bg-gray-200 dark:bg-gray-700 mx-auto"></div>
                </th>
                <th scope="col" className="px-6 py-3 text-end">
                  <div className="h-3 w-12 sm:w-16 rounded bg-gray-200 dark:bg-gray-700 ml-auto"></div>
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700 mx-auto"></div>
                </th>
              </tr>
            </thead>

            {/* Skeleton body rows */}
            <tbody>
              {Array.from({ length: rows }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 dark:border-gray-700 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800"
                >
                  {/* ID cell */}
                  <td className="px-6 py-4 text-center">
                    <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700 mx-auto animate-pulse"></div>
                  </td>
                  {/* Product name cell */}
                  <td className="px-6 py-4">
                    <div className="h-4 w-full max-w-[240px] sm:max-w-[320px] rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  </td>
                  {/* Price cell */}
                  <td className="px-6 py-4 text-end">
                    <div className="h-4 w-12 sm:w-20 rounded bg-gray-200 dark:bg-gray-700 ml-auto animate-pulse"></div>
                  </td>
                  {/* Action cell */}
                  <td className="px-6 py-4 text-center">
                    <div className="h-6 w-16 sm:w-20 rounded bg-gray-200 dark:bg-gray-700 mx-auto animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screen reader text */}
      <p className="sr-only">Loading inventory…</p>
    </section>
  );
}
