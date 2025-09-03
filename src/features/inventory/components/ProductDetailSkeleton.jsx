"use client";
import React from "react";

const Bar = ({ className = "" }) => (
  <div className={`rounded bg-gray-200 dark:bg-gray-700 ${className}`} />
);

export default function ProductDetailSkeleton() {
  return (
    <section className="h-[80vh] mx-auto max-w-[80%] sm:max-w-[60%] sm:p-5">
      <div className="animate-pulse">
        {/* Back button (mobile) */}
        <div className="mb-5 sm:hidden inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-2">
          <Bar className="h-4 w-4" />
          <Bar className="h-3 w-36" />
        </div>

        {/* Title */}
        <Bar className="h-6 w-44 mb-5" />

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-6 space-y-5">
          {/* Top row: ID pill, name, edit button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* ID pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/60 dark:bg-blue-900/30 border border-blue-200/70 dark:border-blue-800/60">
              <Bar className="h-4 w-4 rounded-full" />
              <Bar className="h-3 w-24" />
            </div>

            {/* Name line */}
            <Bar className="h-6 w-2/3 sm:w-1/2 flex-1" />

            {/* Edit button placeholder */}
            <div className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-amber-400/30 dark:bg-amber-500/20">
              <Bar className="h-4 w-4" />
              <Bar className="h-3 w-10" />
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <Bar className="h-5 w-5 rounded" />
            <Bar className="h-5 w-24" />
          </div>

          {/* Meta cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <Bar className="h-5 w-5 rounded" />
              <div className="flex-1 space-y-2">
                <Bar className="h-3 w-20" />
                <Bar className="h-4 w-36" />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <Bar className="h-5 w-5 rounded" />
              <div className="flex-1 space-y-2">
                <Bar className="h-3 w-24" />
                <Bar className="h-4 w-32" />
              </div>
            </div>

            {/* Price duplicate card on md:hidden in real UI — keep placeholder visible only on small screens */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 md:hidden">
              <Bar className="h-5 w-5 rounded" />
              <div className="flex-1 space-y-2">
                <Bar className="h-3 w-16" />
                <Bar className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Back button (desktop) */}
        <div className="mt-5 hidden sm:inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-2">
          <Bar className="h-4 w-4" />
          <Bar className="h-3 w-40" />
        </div>
      </div>
    </section>
  );
}
