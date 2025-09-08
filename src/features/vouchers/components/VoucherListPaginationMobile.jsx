"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Filter,
  X,
} from "lucide-react";
import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";
import { useI18n } from "@/i18n/I18nProvider";

export default function VoucherListPaginationMobile({
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
  handleMinNetTotal,
  handleMaxNetTotal,
  handleStartDate,
  handleEndDate,
  handleResetFilters,
  sortBy,
  sortDirection,
  minNetTotal,
  maxNetTotal,
  startDate,
  endDate,
}) {
  const { t } = useI18n();

  const [openFilter, setOpenFilter] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  // Close on outside / Esc
  useEffect(() => {
    const onDown = (e) => {
      if (
        openFilter &&
        filterRef.current &&
        !filterRef.current.contains(e.target)
      )
        setOpenFilter(false);
      if (openSort && sortRef.current && !sortRef.current.contains(e.target))
        setOpenSort(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenFilter(false);
        setOpenSort(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openFilter, openSort]);

  return (
    <div
      className="md:hidden fixed left-0 right-0 z-40 px-3 pt-2 pb-3 border-t border-gray-200/70 dark:border-gray-800/70 backdrop-blur bg-white/85 dark:bg-gray-950/80 shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.25)]"
      style={{ bottom: "72px" }} // keep above your fixed bottom navbar
    >
      {/* Top row: Total + Per page + Prev/Next */}
      <div className="flex items-center justify-between gap-3">
        {/* Total */}
        <div className="inline-flex items-center gap-1 rounded-md border border-gray-200/70 dark:border-gray-800/70 bg-white/90 dark:bg-gray-900/70 px-3 py-1">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            {t("pagination.total", "合計")}
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {total ?? <Spiral size="18" speed="0.9" color="gray" />}
          </span>
        </div>

        {/* Per-page */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="voucher-limit-mobile"
            className="text-xs text-gray-600 dark:text-gray-400"
          >
            {t("pagination.show", "表示")}
          </label>
          <select
            id="voucher-limit-mobile"
            onChange={(e) => handleChangeLimit?.(e.target.value)}
            defaultValue={String(perPage ?? "5")}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[5, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {t("pagination.perPage", "{n}件/ページ").replace(
                  "{n}",
                  String(n)
                )}
              </option>
            ))}
          </select>
        </div>

        {/* Prev / Next (icon only) */}
        <div className="flex items-center">
          <button
            type="button"
            className="h-9 w-9 grid place-items-center rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            disabled={!hasPrev}
            onClick={() => handlePagination?.(prevLink)}
            aria-label={t("pagination.prev", "前へ")}
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="min-w-[70px] text-center text-xs text-gray-700 dark:text-gray-300">
            {currentPage ?? <Spiral size="16" speed="0.9" color="gray" />} /{" "}
            {lastPage ?? <Spiral size="16" speed="0.9" color="gray" />}
          </span>
          <button
            type="button"
            className="h-9 w-9 grid place-items-center rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            disabled={!hasNext}
            onClick={() => handlePagination?.(nextLink)}
            aria-label={t("pagination.next", "次へ")}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-2 h-px bg-gray-200/70 dark:bg-gray-800/70" />

      {/* Buttons: Filter / Sort */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setOpenFilter((s) => !s);
            setOpenSort(false);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          aria-expanded={openFilter}
          aria-controls="voucher-filter-panel-mobile"
          title={t("vouchers.filters.title", "フィルター")}
        >
          <Filter className="size-4" />
          {t("vouchers.filters.title", "フィルター")}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpenSort((s) => !s);
            setOpenFilter(false);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          aria-expanded={openSort}
          aria-controls="voucher-sort-panel-mobile"
          title={t("vouchers.sort.title", "並び替え")}
        >
          <SlidersHorizontal className="size-4" />
          {t("vouchers.sort.title", "並び替え")}
        </button>
      </div>

      {/* Filter popup */}
      {openFilter && (
        <div
          id="voucher-filter-panel-mobile"
          ref={filterRef}
          className="mt-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {t("vouchers.filters.heading", "フィルター条件")}
            </h4>
            <button
              className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setOpenFilter(false)}
              aria-label={t("vouchers.filters.title", "フィルター")}
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Net total (min/max) */}
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                {t("vouchers.filters.minNet", "最小税込合計")}
              </span>
              <input
                type="number"
                defaultValue={minNetTotal}
                placeholder="0"
                onChange={(e) => handleMinNetTotal?.(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="block">
              <span className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                {t("vouchers.filters.maxNet", "最大税込合計")}
              </span>
              <input
                type="number"
                defaultValue={maxNetTotal}
                placeholder="100000"
                onChange={(e) => handleMaxNetTotal?.(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          {/* Date range */}
          <div className="mt-2 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                {t("dashboard.filters.dateFrom", "開始日")}
              </span>
              <input
                type="date"
                defaultValue={startDate}
                onChange={(e) => handleStartDate?.(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="block">
              <span className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                {t("dashboard.filters.dateTo", "終了日")}
              </span>
              <input
                type="date"
                defaultValue={endDate}
                onChange={(e) => handleEndDate?.(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
            {t(
              "vouchers.filters.dateBetweenHint",
              "開始日と終了日を指定すると範囲で絞り込めます（date_between も使用可）。"
            )}
          </p>

          {/* Actions */}
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                handleResetFilters();
                setOpenFilter(false);
              }}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {t("dashboard.filters.reset", "リセット")}
            </button>
            <button
              type="button"
              onClick={() => setOpenFilter(false)}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
            >
              {t("dashboard.filters.apply", "適用")}
            </button>
          </div>
        </div>
      )}

      {/* Sort popup */}
      {openSort && (
        <div
          id="voucher-sort-panel-mobile"
          ref={sortRef}
          className="mt-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {t("vouchers.sort.title", "並び替え")}
            </h4>
            <button
              className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setOpenSort(false)}
              aria-label={t("vouchers.sort.title", "並び替え")}
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                {t("vouchers.sort.by", "項目")}
              </span>
              <select
                value={sortBy ?? ""}
                onChange={(e) => handleSortBy?.(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {t("vouchers.sort.default", "デフォルト")}
                </option>
                <option value="total">
                  {t("vouchers.sort.total", "合計")}
                </option>
                <option value="net_total">
                  {t("vouchers.sort.netTotal", "税込合計")}
                </option>
                <option value="sale_date">
                  {t("vouchers.sort.saleDate", "販売日")}
                </option>
                <option value="customer_name">
                  {t("vouchers.sort.customer", "顧客名")}
                </option>
              </select>
            </label>

            <label className="block">
              <span className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                {t("vouchers.sort.direction", "順序")}
              </span>
              <select
                value={sortDirection ?? "desc"}
                onChange={(e) => handleSortDirection?.(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">{t("vouchers.sort.asc", "昇順")}</option>
                <option value="desc">{t("vouchers.sort.desc", "降順")}</option>
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
