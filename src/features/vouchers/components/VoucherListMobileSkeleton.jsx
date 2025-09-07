"use client";
import React from "react";

/**
 * VoucherListMobileSkeleton
 * - Loading skeleton for mobile voucher list
 * - Pass `rows` to control number of skeleton cards
 */
export default function VoucherListMobileSkeleton({ rows = 5 }) {
  return (
    <ul role="list" className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <li
          key={i}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-4 space-y-3"
        >
          {/* ID + header */}
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />

          {/* Voucher ID */}
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />

          {/* Customer name */}
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />

          {/* Email */}
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />

          {/* Sale date */}
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />

          {/* Totals */}
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}
