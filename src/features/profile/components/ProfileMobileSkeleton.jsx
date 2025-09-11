// src/features/profile/components/ProfileMobileSkeleton.jsx
"use client";
import React from "react";

export default function ProfileMobileSkeleton() {
  return (
    <div
      className="w-full bg-white dark:bg-gray-900 shadow-lg transition-colors duration-300"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Mobile Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-6 rounded-xl overflow-hidden">
        {/* shimmer */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.6s_infinite] [mask-image:linear-gradient(90deg,transparent,black,transparent)]" />

        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-40 rounded bg-white/40" />
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-white/60" />
            <div className="h-9 w-16 rounded-lg bg-white/60" />
          </div>
        </div>

        {/* Avatar + name row */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="relative w-24 h-24 rounded-full bg-white/20 overflow-hidden">
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.6s_infinite] [mask-image:linear-gradient(90deg,transparent,black,transparent)]" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-white/90" />
          </div>

          <div className="flex items-center justify-center gap-2 w-full">
            <div className="h-6 w-44 rounded bg-white/70" />
            <div className="h-6 w-6 rounded bg-white/60" />
          </div>

          <div className="mt-2 h-4 w-32 rounded bg-white/50" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {/* Email */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <div className="h-4 w-4 rounded bg-blue-300/70" />
            </div>
            <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="ml-11 h-4 w-56 rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Dates */}
        {[0, 1].map((i) => (
          <div
            key={i}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900/30">
                <div className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-700" />
              </div>
              <div>
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        ))}

        {/* Change Password CTA */}
        <div className="h-11 w-full rounded-xl bg-blue-600/70" />

        {/* Status badge */}
        <div className="flex justify-center pt-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        {/* Back link */}
        <div className="h-9 w-48 rounded-lg border border-gray-300 dark:border-gray-700" />
      </div>

      {/* shimmer keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
