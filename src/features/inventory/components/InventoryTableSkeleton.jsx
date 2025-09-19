"use client";
import React from "react";
import { useI18n } from "@/i18n/I18nProvider";

const InventorySkeleton = ({ rows = 5 }) => {
  const { t } = useI18n();

  return (
    <div className="relative mx-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left overflow-x-auto  rtl:text-right text-gray-700 dark:text-gray-300">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3 text-center">
              <div className="h-3 w-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-end">
              <div className="h-3 w-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse ml-auto"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              <div className="h-3 w-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, index) => (
            <SkeletonRow key={index} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SkeletonRow = ({ index }) => {
  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
      {/* Index column */}
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
      >
        <div className="h-4 w-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
      </th>

      {/* Product name column */}
      <td className="px-6 py-4 text-center">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-32 mx-auto"></div>
      </td>

      {/* Price column */}
      <td className="px-6 py-4 text-end">
        <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse ml-auto"></div>
      </td>

      {/* Action buttons column */}
      <td className="px-6 py-4 flex justify-center">
        <div className="flex items-center space-x-4">
          {/* View button skeleton */}
          <div className="size-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          
          {/* Edit button skeleton */}
          <div className="size-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          
          {/* Delete button skeleton */}
          <div className="size-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
      </td>
    </tr>
  );
};

export default InventorySkeleton;