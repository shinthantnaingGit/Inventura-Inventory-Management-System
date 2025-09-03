// src/features/inventory/components/InventoryTableSkeleton.jsx
"use client";
import React from "react";

export default function InventoryTableSkeleton({ rows = 6 }) {
  return (
    <div className="relative mx-auto overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right">
        {/* Header mirrors responsive columns */}
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            {/* ID — hidden on small screens */}
            <th scope="col" className="px-4 sm:px-6 py-3 text-center hidden sm:table-cell">
              <div className="h-3 w-4 rounded bg-gray-200 dark:bg-gray-700 mx-auto" />
            </th>
            {/* Product — always visible */}
            <th scope="col" className="px-4 sm:px-6 py-3 text-left">
              <div className="h-3 w-24 sm:w-32 rounded bg-gray-200 dark:bg-gray-700" />
            </th>
            {/* Price — hidden on small screens */}
            <th scope="col" className="px-4 sm:px-6 py-3 text-right hidden sm:table-cell">
              <div className="h-3 w-12 sm:w-16 rounded bg-gray-200 dark:bg-gray-700 ml-auto" />
            </th>
            {/* Actions — always visible */}
            <th scope="col" className="px-4 sm:px-6 py-3 text-center w-1">
              <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700 mx-auto" />
            </th>
          </tr>
        </thead>

        {/* Body skeleton rows */}
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr
              key={i}
              className="border-b border-gray-200 dark:border-gray-700 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800"
            >
              {/* ID — sm+ */}
              <td className="px-4 sm:px-6 py-4 text-center hidden sm:table-cell">
                <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700 mx-auto animate-pulse" />
              </td>

              {/* Product — always, with tiny secondary line for mobile price placeholder */}
              <td className="px-4 sm:px-6 py-4">
                <div className="space-y-1">
                  <div className="h-4 w-40 sm:w-64 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  {/* Mobile: show an extra small bar as “price under name” placeholder */}
                  <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse sm:hidden" />
                </div>
              </td>

              {/* Price — sm+ */}
              <td className="px-4 sm:px-6 py-4 text-right hidden sm:table-cell">
                <div className="h-4 w-12 sm:w-20 rounded bg-gray-200 dark:bg-gray-700 ml-auto animate-pulse" />
              </td>

              {/* Actions — mobile kebab chip + desktop 3 buttons */}
              <td className="px-4 sm:px-6 py-4">
                {/* Desktop (md+): three pill buttons */}
                <div className="hidden md:flex justify-center items-center gap-3">
                  <div className="h-7 w-7 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-7 w-7 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-7 w-7 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 animate-pulse" />
                </div>

                {/* Mobile (<md): single kebab button */}
                <div className="md:hidden flex justify-center">
                  <div className="h-7 w-10 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 animate-pulse" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
