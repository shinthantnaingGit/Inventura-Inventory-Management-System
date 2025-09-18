"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";
import { useI18n } from "@/i18n/I18nProvider";

// ADDED: imports for URL param handling
import { useRouter, useSearchParams } from "next/navigation"; // ADDED

const InventoryListPagination = ({
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
}) => {
  const { t } = useI18n();
  const strOrEmpty = (v) => v ?? "";
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mt-6">
      {/* Total */}
      <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-1 shadow-sm">
        <span className="text-[11px] uppercase tracking-wide text-gray-700 dark:text-gray-300">
          {t("inventoryPagination.total", "合計")}
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {total ?? <Spiral size="20" speed="0.9" color="gray" />}
        </span>
      </div>
      {/* Sorting */}
      <div className="flex items-center gap-2">
        {" "}
        <label className="text-sm text-gray-700 dark:text-gray-300">
          {" "}
          {t("inventoryPagination.sortBy", "並び替え")} {/* ADDED */}
        </label>{" "}
        <select
          value={strOrEmpty(sortBy)}
          onChange={(e) => handleSortBy(e.target.value)}
          className="rounded-md border text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            {t("inventoryPagination.sortOptionNone", "デフォルト")}
          </option>
          {/* <option value="name">
            {t("inventoryPagination.sortOptionName", "名前")}
          </option> */}
          <option value="price">
            {t("inventoryPagination.sortOptionPrice", "価格")}
          </option>
        </select>
        <label className="text-sm text-gray-700 dark:text-gray-300">
          {" "}
          {t("inventoryPagination.sortDirection", "順序")} {/* ADDED */}
        </label>{" "}
        <select
          value={strOrEmpty(sortDirection) || "asc"}
          onChange={(e) => handleSortDirection(e.target.value)}
          className="rounded-md border text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="asc">{t("inventoryPagination.dirAsc", "昇順")}</option>
          <option value="desc">
            {t("inventoryPagination.dirDesc", "降順")}
          </option>
        </select>
      </div>{" "}
      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-3">
        <button
          type="button"
          className="active:scale-90 active:opacity-85 duration-200 flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          disabled={!hasPrev}
          onClick={() => handlePagination(prevLink)}
          aria-label={t("inventoryPagination.prev", "前へ")}
          title={t("inventoryPagination.prev", "前へ")}
        >
          <ChevronLeft className="size-4" />
          {t("inventoryPagination.prev", "前へ")}
        </button>

        <span className="text-sm text-gray-700 dark:text-gray-300">
          {currentPage ?? <Spiral size="20" speed="0.9" color="gray" />} /{" "}
          {lastPage ?? <Spiral size="20" speed="0.9" color="gray" />}
        </span>

        <button
          type="button"
          className="active:scale-90 active:opacity-85 duration-200 flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 disabled:pointer-events-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          disabled={!hasNext}
          onClick={() => handlePagination(nextLink)}
          aria-label={t("inventoryPagination.next", "次へ")}
          title={t("inventoryPagination.next", "次へ")}
        >
          {t("inventoryPagination.next", "次へ")}
          <ChevronRight className="size-4" />
        </button>
      </div>
      {/* Items per page */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="limit"
          className="text-sm text-gray-700 dark:text-gray-300"
        >
          {t("inventoryPagination.show", "表示")}
        </label>
        <select
          id="limit"
          onChange={(e) => handleChangeLimit(e.target.value)}
          defaultValue={String(perPage ?? "5")}
          className="rounded-md border text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </div>
  );
};

export default InventoryListPagination;
