"use client";
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";

/**
 * InventoryListPaginationMobile
 * - Compact controls for phones (NOT desktop)
 * - Keep desktop pagination unchanged; render this in `md:hidden`
 *
 * Props (same names as your desktop component so you can pass-through):
 *   total, currentPage, lastPage, perPage,
 *   hasPrev, hasNext, prevLink, nextLink,
 *   limitRef, handleChangeLimit, handlePagination
 *
 * Optional props:
 *   sticky?: boolean  // if true, sticks to bottom on mobile
 */
export default function InventoryListPaginationMobile({
  total,
  currentPage,
  lastPage,
  perPage,
  hasPrev,
  hasNext,
  prevLink,
  nextLink,
  handleChangeLimit,
  handlePagination,
  sticky = false,
}) {
  return (
    <div
      className={[
        "md:hidden",
        "mt-4",
        "flex flex-col gap-3",
        sticky
          ? "fixed left-0 right-0 bottom-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-t border-gray-200 dark:border-gray-800 px-4 py-3"
          : "",
      ].join(" ")}
    >
      {/* Top row: total + per-page selector */}
      <div className="flex items-center justify-between gap-3">
        {/* Total (compact pill) */}
        <div className="inline-flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2.5 py-1 shadow-sm">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            Total
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {total ?? <Spiral size="18" speed="0.9" color="gray" />}
          </span>
        </div>

        {/* Per-page select (compact width) */}
        <div className="flex items-center gap-2">
          <label htmlFor="limit-mobile" className="sr-only">
            Items per page
          </label>
          <div className="relative">
            <select
              id="limit-mobile"
              onChange={(e) => handleChangeLimit(e.target.value)}
              defaultValue={String(perPage ?? "5")}
              // important: avoid value=null warning
              className="appearance-none rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 pr-7 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[112px]"
              aria-label="Items per page"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
            {/* chevron for select */}
            <MoreHorizontal className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Bottom row: Prev / indicator / Next */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          className="h-10 w-10 inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          disabled={!hasPrev}
          onClick={() => handlePagination(prevLink)}
        >
          <ChevronLeft className="size-5" />
        </button>

        <span className="min-w-[72px] text-center text-sm text-gray-700 dark:text-gray-300">
          {currentPage ?? <Spiral size="18" speed="0.9" color="gray" />} /{" "}
          {lastPage ?? <Spiral size="18" speed="0.9" color="gray" />}
        </span>

        <button
          type="button"
          aria-label="Next page"
          className="h-10 w-10 inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          disabled={!hasNext}
          onClick={() => handlePagination(nextLink)}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
