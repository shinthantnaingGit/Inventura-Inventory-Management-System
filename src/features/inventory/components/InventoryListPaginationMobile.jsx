"use client";
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * InventoryListPaginationMobile — Top bar = Total + Per-page + Icon-only Prev/Next
 * - Stays above fixed bottom nav via inline style bottom calc()
 * - Logic/props unchanged
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
  handleSortBy,
  handleSortDirection,
  sortBy,
  sortDirection,
}) {
  const { t } = useI18n();
  const strOrEmpty = (v) => v ?? "";

  return (
    <div className="md:hidden fixed left-0 right-0 bottom-18 z-40 backdrop-blur bg-white/85 dark:bg-gray-950/80 border-t border-gray-200/70 dark:border-gray-800/70 px-3 pt-2 pb-3  shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.25)]">
      {/* Row A: Total + Per-page + Icon-only Prev/Next */}
      <div className="flex items-center justify-between gap-3">
        {/* Items per page */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="limit"
            className="text-sm text-gray-600 dark:text-gray-300"
          >
            {t("inventoryPagination.show", "表示")}
          </label>
          <select
            id="limit"
            onChange={(e) => handleChangeLimit(e.target.value)}
            defaultValue={String(perPage ?? "5")}
            className="text-gray-600 dark:text-gray-300  rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {t("inventoryPagination.perPage", "{n}件/ページ").replace(
                  "{n}",
                  String(n)
                )}
              </option>
            ))}
          </select>
        </div>
        {/* Sorting */}
        <div className="flex items-center gap-2">
          {" "}
          <label className="text-sm text-gray-600 dark:text-gray-300">
            {" "}
            {t("inventoryPagination.sortBy", "並び替え")} {/* ADDED */}
          </label>{" "}
          <select
            value={strOrEmpty(sortBy)}
            onChange={(e) => handleSortBy(e.target.value)}
            className="rounded-md border text-gray-600 dark:text-gray-300  border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {t("inventoryPagination.sortOptionNone", "デフォルト")}
            </option>
            <option value="name">
              {t("inventoryPagination.sortOptionName", "名前")}
            </option>
            <option value="price">
              {t("inventoryPagination.sortOptionPrice", "価格")}
            </option>
          </select>
        </div>{" "}
      </div>

      {/* Divider */}
      <div className="mt-2 h-px bg-gray-200/70 dark:bg-gray-800/70" />

      {/* Row B: Sorting */}
      <div className="mt-2 flex items-center justify-between gap-3">
        {/* Total pill */}
        <div className="inline-flex items-center gap-1 rounded-md border border-gray-200/70 dark:border-gray-800/70 bg-white/90 dark:bg-gray-900/70 px-5 py-1 ">
          <span className="text-[11px] text-gray-600 dark:text-gray-300">
            {t("inventoryPaginationMobile.total", "合計")}
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {total ?? <Spiral size="18" speed="0.9" color="gray" />}
          </span>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center items-center gap-3">
          <button
            type="button"
            className="active:scale-90 active:opacity-85 duration-200 flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            disabled={!hasPrev}
            onClick={() => handlePagination(prevLink)}
            aria-label={t("inventoryPagination.prev", "前へ")}
            title={t("inventoryPagination.prev", "前へ")}
          >
            <ChevronLeft className="size-4 " />
          </button>

          <span className="text-[11px] text-gray-600 dark:text-gray-300">
            {currentPage ?? <Spiral size="20" speed="0.9" color="gray" />} /{" "}
            {lastPage ?? <Spiral size="20" speed="0.9" color="gray" />}
          </span>

          <button
            type="button"
            className="active:scale-90 active:opacity-85 duration-200 flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 disabled:pointer-events-none text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            disabled={!hasNext}
            onClick={() => handlePagination(nextLink)}
            aria-label={t("inventoryPagination.next", "次へ")}
            title={t("inventoryPagination.next", "次へ")}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Direction segmented */}
        <div className="inline-flex overflow-hidden rounded-lg border border-gray-300/70 dark:border-gray-700/70">
          <button
            type="button"
            onClick={() => handleSortDirection("asc")}
            className={[
              "px-3 py-2 text-xs font-medium transition-colors",
              sortDirection === "asc"
                ? "bg-blue-600 text-white"
                : "bg-white/90 dark:bg-gray-900/70 text-gray-800 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/70",
            ].join(" ")}
            aria-pressed={sortDirection === "asc"}
          >
            {t("inventoryPaginationMobile.dirAsc", "昇順")}
          </button>
          <button
            type="button"
            onClick={() => handleSortDirection("desc")}
            className={[
              "px-3 py-2 text-xs font-medium transition-colors border-l border-gray-300/70 dark:border-gray-700/70",
              sortDirection === "desc"
                ? "bg-blue-600 text-white"
                : "bg-white/90 dark:bg-gray-900/70 text-gray-800 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/70",
            ].join(" ")}
            aria-pressed={sortDirection === "desc"}
          >
            {t("inventoryPaginationMobile.dirDesc", "降順")}
          </button>
        </div>
      </div>
    </div>
  );
}
