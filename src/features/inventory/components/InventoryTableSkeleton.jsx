// app/(dashboard)/inventory/InventoryListSkeleton.jsx
"use client";
import React from "react";

export default function InventoryTableSkeleton({ rows = 6 }) {
  return (
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
  );
}
