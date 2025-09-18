"use client";
import React from "react";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * VoucherTableSkeleton
 * - Loading skeleton for desktop/table voucher list
 * - Pass `rows` to control number of skeleton rows
 * - Matches VoucherTable structure exactly with proper i18n
 */
export default function VoucherTableSkeleton({ rows = 6 }) {
  const { t } = useI18n();

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full min-w-[800px] text-sm text-left rtl:text-right text-gray-700 dark:text-gray-300">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
          <tr>
            {/* ID */}
            <th scope="col" className="px-4 py-2 text-center">
              <div className="h-3 w-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </th>
            {/* Voucher ID */}
            <th scope="col" className="px-4 py-2 text-center">
              <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </th>
            {/* Customer Name */}
            <th scope="col" className="px-4 py-2 text-center">
              <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </th>
            {/* Customer Email */}
            <th scope="col" className="px-4 py-2 text-center">
              <div className="h-3 w-10 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </th>
            {/* Sale Date */}
            <th scope="col" className="px-4 py-2 text-center">
              <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </th>
            {/* Total */}
            <th scope="col" className="px-4 py-2 text-end">
              <div className="h-3 w-8 bg-gray-300 dark:bg-gray-600 rounded ml-auto animate-pulse" />
            </th>
            {/* Tax */}
            <th scope="col" className="px-4 py-2 text-end">
              <div className="h-3 w-6 bg-gray-300 dark:bg-gray-600 rounded ml-auto animate-pulse" />
            </th>
            {/* Net Total */}
            <th scope="col" className="px-4 py-2 text-end">
              <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded ml-auto animate-pulse" />
            </th>
            {/* Actions */}
            <th scope="col" className="px-4 py-2 text-center">
              <div className="h-3 w-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr
              key={i}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
            >
              {/* ID */}
              <td className="px-4 py-2 text-center">
                <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </td>
              {/* Voucher ID */}
              <td className="px-4 py-2 text-center">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </td>
              {/* Customer Name */}
              <td className="px-4 py-2 text-center">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </td>
              {/* Customer Email */}
              <td className="px-4 py-2 text-center">
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </td>
              {/* Sale Date */}
              <td className="px-4 py-2 text-center">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </td>
              {/* Total */}
              <td className="px-4 py-2 text-end">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded ml-auto animate-pulse" />
              </td>
              {/* Tax */}
              <td className="px-4 py-2 text-end">
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded ml-auto animate-pulse" />
              </td>
              {/* Net Total */}
              <td className="px-4 py-2 text-end">
                <div className="h-4 w-18 bg-gray-200 dark:bg-gray-700 rounded ml-auto animate-pulse" />
              </td>
              {/* Actions */}
              <td className=" py-4 flex justify-start">
                <div className="flex items-center space-x-3">
                  <div className="size-8 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-700 animate-pulse" />
                  <div className="size-8 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-700 animate-pulse" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
