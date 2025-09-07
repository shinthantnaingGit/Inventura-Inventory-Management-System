"use client";
import React from "react";
import { Search, X } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * VoucherActionBar
 * - Search + Clear button (desktop and mobile friendly)
 */
export default function VoucherActionBar({
  searchRef,
  handleOnChange,
  handleClearSearch,
}) {
  const { t } = useI18n();

  return (
    <div className="mb-4 flex items-center gap-2">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <input
          ref={searchRef}
          type="text"
          placeholder={t(
            "vouchers.actionBar.searchPlaceholder",
            "顧客名や請求番号で検索…"
          )}
          onChange={handleOnChange}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 pl-9 pr-10 py-2 text-sm
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={t(
            "voucherActionBar.searchAria",
            "バウチャーを検索"
          )}
        />
        {/* Clear button */}
        <button
          type="button"
          onClick={handleClearSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label={t(
            "voucher.actionBar.clear",
            "検索をクリア"
          )}
          title={t(
            "vouchers.actionBar.clear",
            "検索をクリア"
          )}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
