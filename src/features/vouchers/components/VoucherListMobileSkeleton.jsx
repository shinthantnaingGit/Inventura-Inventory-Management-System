// src/features/vouchers/components/VoucherListMobileSkeleton.jsx
"use client";
import React from "react";

export default function VoucherListMobileSkeleton({ count = 4 }) {
  return (
    <ul role="list" className="space-y-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-4 overflow-hidden"
        >
          {/* shimmer sweep */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-200/60 dark:via-gray-700/40 to-transparent animate-[shimmer_1.6s_infinite] [mask-image:linear-gradient(90deg,transparent,black,transparent)]" />

          {/* tag pill */}
          <div className="h-6 w-40 rounded-full bg-gray-200/80 dark:bg-gray-700/60" />

          {/* customer info */}
          <div className="mt-3 space-y-2">
            <div className="h-4 w-56 rounded bg-gray-200/80 dark:bg-gray-700/60" />
            <div className="h-4 w-64 rounded bg-gray-200/80 dark:bg-gray-700/60" />
            <div className="h-4 w-40 rounded bg-gray-200/80 dark:bg-gray-700/60" />
          </div>

          {/* totals */}
          <div className="mt-3 space-y-2">
            <div className="h-4 w-36 rounded bg-gray-200/80 dark:bg-gray-700/60" />
            <div className="h-4 w-28 rounded bg-gray-200/80 dark:bg-gray-700/60" />
            <div className="h-4 w-40 rounded bg-gray-200/80 dark:bg-gray-700/60" />
          </div>

          {/* actions */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-9 w-24 rounded-lg bg-gray-200/80 dark:bg-gray-700/60" />
            <div className="h-9 w-24 rounded-lg bg-gray-200/80 dark:bg-gray-700/60" />
          </div>
        </li>
      ))}

      {/* shimmer keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </ul>
  );
}
