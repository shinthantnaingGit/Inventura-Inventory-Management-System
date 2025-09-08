"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";
import { useI18n } from "@/i18n/I18nProvider";

export default function VoucherListPagination({
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

  // Close on outside click / Esc
  useEffect(() => {
    const onClick = (e) => {
      const outFilter = filterRef.current && !filterRef.current.contains(e.target);
      const outSort = sortRef.current && !sortRef.current.contains(e.target);
      if (outFilter) setOpenFilter(false);
      if (outSort) setOpenSort(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenFilter(false);
        setOpenSort(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Helpers to coerce values safely (avoid controlled/uncontrolled warnings)
  const numToInput = (v) => (v ?? v === 0 ? String(v) : "");
  const strOrEmpty = (v) => (v ?? "");

  return (
    <div className="hidden md:flex flex-wrap items-center gap-4 mt-6 relative">
      {/* Total */}
      <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1 shadow-sm bg-white dark:bg-gray-900">
        <span className="text-[11px] text-gray-500 dark:text-gray-400">
          {t("voucherPagination.total", "合計")}
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {total ?? <Spiral size="20" speed="0.9" color="gray" />}
        </span>
      </div>

      {/* Filter trigger + popup */}
      <div className="relative" ref={filterRef}>
        <button
          type="button"
          onClick={() => {
            setOpenFilter((s) => !s);
            setOpenSort(false);
          }}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          aria-haspopup="dialog"
          aria-expanded={openFilter}
        >
          <SlidersHorizontal className="size-4" />
          {t("vouchers.actionBar.filterBtn", "フィルター")}
        </button>

        {openFilter && (
          <div
            role="dialog"
            className="absolute bottom-0 z-40 mt-2 w-[320px] rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t("vouchers.filters.heading", "フィルター条件")}
              </h4>
              <button
                onClick={() => setOpenFilter(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={t("vouchers.filters.title", "フィルター")}
                title={t("vouchers.filters.title", "フィルター")}
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Fields (controlled) */}
            <div className="space-y-3">
              <label className="block">
                <span className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {t("vouchers.filters.minNet", "最小税込合計")}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={numToInput(minNetTotal)}
                  onChange={(e) => {
                    const v = e.target.value;
                    handleMinNetTotal(v === "" ? "" : Number(v));
                  }}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-2 text-sm"
                  placeholder={t("vouchers.filters.minNet", "最小税込合計")}
                />
              </label>

              <label className="block">
                <span className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {t("vouchers.filters.maxNet", "最大税込合計")}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={numToInput(maxNetTotal)}
                  onChange={(e) => {
                    const v = e.target.value;
                    handleMaxNetTotal(v === "" ? "" : Number(v));
                  }}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-2 text-sm"
                  placeholder={t("vouchers.filters.maxNet", "最大税込合計")}
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {t("dashboard.filters.dateFrom", "開始日")}
                  </span>
                  <input
                    type="date"
                    value={strOrEmpty(startDate)}
                    onChange={(e) => handleStartDate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {t("dashboard.filters.dateTo", "終了日")}
                  </span>
                  <input
                    type="date"
                    value={strOrEmpty(endDate)}
                    onChange={(e) => handleEndDate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-2 text-sm"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleResetFilters();
                    setOpenFilter(false);
                  }}
                  className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {t("dashboard.filters.reset", "リセット")}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenFilter(false)}
                  className="rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700"
                >
                  {t("dashboard.filters.apply", "適用")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sort trigger + popup */}
      <div className="relative" ref={sortRef}>
        <button
          type="button"
          onClick={() => {
            setOpenSort((s) => !s);
            setOpenFilter(false);
          }}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          aria-haspopup="dialog"
          aria-expanded={openSort}
        >
          <ArrowUpDown className="size-4" />
          {t("vouchers.sort.title", "並び替え")}
        </button>

        {openSort && (
          <div
            role="dialog"
            className="absolute bottom-0 -translate-y-10 z-40 mt-2 w-[260px] rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t("vouchers.sort.title", "並び替え")}
              </h4>
              <button
                onClick={() => setOpenSort(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={t("vouchers.sort.title", "並び替え")}
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm text-gray-700 dark:text-gray-300">
                {t("vouchers.sort.by", "項目")}
              </label>
              <select
                value={strOrEmpty(sortBy)}
                onChange={(e) => handleSortBy(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-2 text-sm"
              >
                <option value="">{t("vouchers.sort.default", "デフォルト")}</option>
                <option value="total">{t("vouchers.sort.total", "合計")}</option>
                <option value="net_total">{t("vouchers.sort.netTotal", "税込合計")}</option>
                <option value="sale_date">{t("vouchers.sort.saleDate", "販売日")}</option>
                <option value="customer_name">{t("vouchers.sort.customer", "顧客名")}</option>
              </select>

              <label className="block text-sm text-gray-700 dark:text-gray-300">
                {t("vouchers.sort.direction", "順序")}
              </label>
              <select
                value={strOrEmpty(sortDirection) || "asc"}
                onChange={(e) => handleSortDirection(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-2 text-sm"
              >
                <option value="asc">{t("vouchers.sort.asc", "昇順")}</option>
                <option value="desc">{t("vouchers.sort.desc", "降順")}</option>
              </select>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleSortBy("");
                    handleSortDirection("asc");
                    setOpenSort(false);
                  }}
                  className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {t("dashboard.filters.reset", "リセット")}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenSort(false)}
                  className="rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700"
                >
                  {t("dashboard.filters.apply", "適用")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Pager */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="active:scale-95 duration-200 inline-flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          disabled={!hasPrev}
          onClick={() => handlePagination(prevLink)}
          aria-label={t("voucherPagination.prev", "前へ")}
          title={t("voucherPagination.prev", "前へ")}
        >
          <ChevronLeft className="size-4" />
          {t("voucherPagination.prev", "前へ")}
        </button>

        <span className="text-sm text-gray-700 dark:text-gray-300">
          {currentPage ?? <Spiral size="18" speed="0.9" color="gray" />} /{" "}
          {lastPage ?? <Spiral size="18" speed="0.9" color="gray" />}
        </span>

        <button
          type="button"
          className="active:scale-95 duration-200 inline-flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          disabled={!hasNext}
          onClick={() => handlePagination(nextLink)}
          aria-label={t("voucherPagination.next", "次へ")}
          title={t("voucherPagination.next", "次へ")}
        >
          {t("voucherPagination.next", "次へ")}
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Per page */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          {t("voucherPagination.show", "表示")}
        </label>
        <select
          value={String(perPage ?? "5")}
          onChange={(e) => handleChangeLimit(Number(e.target.value))}
          className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {t("voucherPagination.perPage", "{n}件/ページ").replace("{n}", String(n))}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
