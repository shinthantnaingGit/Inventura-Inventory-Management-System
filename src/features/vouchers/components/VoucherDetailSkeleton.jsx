// src/features/vouchers/components/VoucherDetailSkeleton.jsx
"use client";

import React from "react";

export default function VoucherDetailSkeleton() {
  return (
    <section className="mx-auto max-w-full sm:max-w-[70%] lg:max-w-[60%] px-4 sm:px-5 pb-24 sm:pb-6" aria-busy="true">
      {/* Back (mobile) */}
      <div className="print:hidden mb-4 sm:hidden">
        <div className="h-9 w-44 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800" />
      </div>

      {/* Header row */}
      <div className="print:hidden mb-4 flex items-center justify-between">
        <div className="h-7 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-9 w-28 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900" />
      </div>

      {/* Card */}
      <div className="relative rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-10 shadow-sm overflow-hidden">
        {/* shimmer sweep */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-200/60 dark:via-gray-700/40 to-transparent animate-[shimmer_1.6s_infinite] [mask-image:linear-gradient(90deg,transparent,black,transparent)]" />

        {/* Top row: badge + title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="h-6 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-64 sm:w-80 rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Customer info */}
        <div className="mt-4 space-y-2">
          <div className="h-4 w-56 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-64 rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Lines table */}
        <div className="mt-5">
          <div className="h-6 w-full max-w-[720px] rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" />
          <div className="mt-2 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-full rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
              />
            ))}
          </div>
        </div>

        {/* Totals grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="h-12 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" />
          <div className="h-12 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" />
          <div className="h-12 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" />
        </div>

        {/* Meta grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="h-20 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" />
          <div className="h-20 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" />
          <div className="h-20 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" />
        </div>

        {/* Back (desktop) */}
        <div className="mt-5 hidden sm:block">
          <div className="h-9 w-48 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>

      {/* shimmer keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}
