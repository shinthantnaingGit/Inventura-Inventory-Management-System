"use client";
import React from "react";
import { useI18n } from "@/i18n/I18nProvider";

const VoucherTableSkeleton = ({ rows = 5 }) => {
  const { t } = useI18n();

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full min-w-[800px] text-sm text-left rtl:text-right text-gray-700 dark:text-gray-300">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3 text-center">
              <div className="h-3 w-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              <div className="h-3 w-14 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-end">
              <div className="h-3 w-10 bg-gray-300 dark:bg-gray-600 rounded animate-pulse ml-auto"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-end">
              <div className="h-3 w-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse ml-auto"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-end">
              <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse ml-auto"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              <div className="h-3 w-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, index) => (
            <VoucherSkeletonRow key={index} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const VoucherSkeletonRow = ({ index }) => {
  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
      {/* ID column */}
      <td className="px-6 py-4 text-center">
        <div className="h-4 w-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
      </td>

      {/* Voucher ID column */}
      <td className="px-6 py-4 grow text-center">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
      </td>

      {/* Customer Name column */}
      <td className="px-6 py-4 text-center">
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
      </td>

      {/* Customer Email column */}
      <td className="px-6 py-4 text-center">
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
      </td>

      {/* Sale Date column */}
      <td className="px-6 py-4 text-center">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
      </td>

      {/* Total column */}
      <td className="px-6 py-4 text-end">
        <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse ml-auto"></div>
      </td>

      {/* Tax column */}
      <td className="px-6 py-4 text-end">
        <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse ml-auto"></div>
      </td>

      {/* Net Total column */}
      <td className="px-6 py-4 text-end">
        <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse ml-auto"></div>
      </td>

      {/* Action buttons column */}
      <td className="px-6 py-4 flex justify-center">
        <div className="flex items-center space-x-3">
          {/* View button skeleton */}
          <div className="size-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          
          {/* Delete button skeleton */}
          <div className="size-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
      </td>
    </tr>
  );
};

export default VoucherTableSkeleton;