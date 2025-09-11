// src/features/profile/components/ProfileDesktopSkeleton.jsx
"use client";
import React from "react";

export default function ProfileDesktopSkeleton() {
  return (
    <div
      className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 sm:px-12 py-6 sm:py-8 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.6s_infinite] [mask-image:linear-gradient(90deg,transparent,black,transparent)]" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 w-56 rounded bg-white/30" />
            <div className="mt-2 h-4 w-72 rounded bg-white/20" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-44 rounded-xl bg-white/70" />
            <div className="h-9 w-24 rounded-xl bg-white/70" />
            <div className="h-9 w-10 rounded-xl bg-white/70" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Left: Avatar & name */}
          <div className="lg:col-span-1">
            <div className="text-center relative">
              <div className="relative inline-block mb-6">
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gray-200 dark:bg-gray-700 shadow-2xl overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.6s_infinite] [mask-image:linear-gradient(90deg,transparent,black,transparent)]" />
                </div>
                <div className="absolute bottom-2 right-2 h-11 w-11 rounded-full bg-blue-600/70" />
              </div>

              <div className="mb-6 flex flex-col items-center">
                <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                <div className="flex w-full sm:w-80 items-center justify-center gap-2">
                  <div className="h-8 w-56 sm:w-72 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="mt-4">
                  <div className="inline-flex items-center px-14 py-3 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    <div className="h-4 w-36 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Email card */}
            <div className="relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <div className="h-6 w-6 rounded bg-blue-300/70" />
                </div>
                <div className="flex-1">
                  <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                  <div className="h-5 w-64 sm:w-96 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>

            {/* Timeline cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="p-3 sm:p-4 rounded-xl bg-gray-100 dark:bg-gray-900/30">
                      <div className="h-6 w-6 rounded bg-gray-300 dark:bg-gray-700" />
                    </div>
                    <div className="flex-1">
                      <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                      <div className="h-5 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Change password button */}
            <div className="h-12 w-full rounded-2xl bg-blue-600/70" />
          </div>
        </div>
      </div>

    </div>
  );
}
