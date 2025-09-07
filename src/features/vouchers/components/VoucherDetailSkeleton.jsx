"use client";

import React from "react";

const VoucherDetailSkeleton = () => {
  return (
    <section className="mx-auto max-w-full sm:max-w-[70%] lg:max-w-[60%] px-4 sm:px-5 pb-24 sm:pb-6 animate-pulse">
      {/* Back button skeleton */}
      <div className="mb-4 sm:hidden h-9 w-32 rounded-lg bg-gray-200 dark:bg-gray-700" />

      {/* Title */}
      <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-10 shadow-sm space-y-4">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-6 flex-1 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-24 rounded-lg bg-amber-200 dark:bg-amber-700" />
        </div>

        {/* Totals row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Meta + Customer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back (desktop) */}
      <div className="mt-5 hidden sm:block h-9 w-40 rounded-lg bg-gray-200 dark:bg-gray-700" />
    </section>
  );
};

export default VoucherDetailSkeleton;
