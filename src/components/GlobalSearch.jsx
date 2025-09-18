// src/components/search.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import debounce from "lodash/debounce";
import { Search as SearchIcon, Box, Ticket, Tag, Calendar } from "lucide-react";
import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";
import { useI18n } from "@/i18n/I18nProvider";
import { productApiUrl } from "@/services/product";
import { voucherApiUrl } from "@/services/voucher";
import useAccountStore from "@/store/useAccountStore";

// Auth fetcher (same pattern as your services)
const authFetcher = (url) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
  }).then((r) => r.json());

export default function GlobalSearch() {
  const { t } = useI18n();

  const [query, setQuery] = useState("");
  const [term, setTerm] = useState(""); // debounced value
  const boxRef = useRef(null);
  const [open, setOpen] = useState(false);

  // Debounce typing -> term
  const debounced = useMemo(
    () =>
      debounce((v) => {
        setTerm(v.trim());
      }, 300),
    []
  );

  useEffect(() => {
    debounced(query);
    return () => debounced.cancel();
  }, [query, debounced]);

  // Close on outside/Esc
  useEffect(() => {
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Build URLs (only search when 2+ chars)
  const prodUrl =
    term.length >= 2
      ? `${productApiUrl}?q=${encodeURIComponent(term)}&limit=5`
      : null;
  const vouUrl =
    term.length >= 2
      ? `${voucherApiUrl}?q=${encodeURIComponent(term)}&limit=5`
      : null;

  const {
    data: prodResp,
    isLoading: prodLoading,
    error: prodErr,
  } = useSWR(prodUrl, authFetcher);
  const {
    data: vouResp,
    isLoading: vouLoading,
    error: vouErr,
  } = useSWR(vouUrl, authFetcher);

  const products = prodResp?.data ?? [];
  const vouchers = vouResp?.data ?? [];

  const showResults =
    open &&
    term.length >= 2 &&
    (prodLoading ||
      vouLoading ||
      products.length ||
      vouchers.length ||
      prodErr ||
      vouErr);

  return (
    <div className="relative" ref={boxRef}>
      {/* Input */}
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("searchPlaceholder", "商品・バウチャーを検索…")}
          aria-label={t("searchPlaceholder", "商品・バウチャーを検索…")}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600 dark:text-gray-300" />
      </div>

      {/* Results dropdown */}
      {showResults && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
          {/* Products Section */}
          <SectionHeader
            icon={Box}
            label={t("inventory.manageInventory", "在庫管理")}
            hint={t("inventory.searchProduct", "商品を検査...")}
          />

          <div className="max-h-64 overflow-auto divide-y divide-gray-100 dark:divide-gray-800">
            {prodLoading ? (
              <RowLoading />
            ) : prodErr ? (
              <RowError />
            ) : products.length ? (
              products.map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/inventory/${p.id}`}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setOpen(false)}
                >
                  <Tag className="size-4 text-blue-500" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                      {p.product_name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      ID: {p.id} • ¥{new Intl.NumberFormat().format(p.price)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <RowEmpty
                text={t("inventoryTable.emptyTitle", "商品がありません")}
              />
            )}
          </div>

          {/* Vouchers Section */}
          <SectionHeader
            icon={Ticket}
            label={t("nav.vouchers", "バウチャー")}
            hint={t("dashboard.recents.title", "最新のレコード")}
          />
          <div className="max-h-64 overflow-auto divide-y divide-gray-100 dark:divide-gray-800">
            {vouLoading ? (
              <RowLoading />
            ) : vouErr ? (
              <RowError />
            ) : vouchers.length ? (
              vouchers.map((v) => (
                <Link
                  key={v.id}
                  href={`/dashboard/vouchers/${v.id}`}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setOpen(false)}
                >
                  <Ticket className="size-4 text-indigo-500" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                      {v.voucher_id} — {v.customer_name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Calendar className="size-3.5" />
                      {v.sale_date} • ¥
                      {new Intl.NumberFormat().format(v.net_total)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <RowEmpty
                text={t(
                  "dashboard.recents.empty",
                  "条件に合致するレコードはありません。"
                )}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------- tiny subcomponents (inline for simplicity) -------- */

function SectionHeader({ icon: Icon, label, hint }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50/70 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
      <Icon className="size-4 text-gray-600 dark:text-gray-300" />
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
        {label}
      </span>
      <span className="ml-auto text-[11px] text-gray-600 dark:text-gray-300">
        {hint}
      </span>
    </div>
  );
}

function RowLoading() {
  return (
    <div className="px-3 py-3 grid place-items-center">
      <Spiral size="18" speed="0.9" color="gray" />
    </div>
  );
}

function RowError() {
  return (
    <div className="px-3 py-3 text-sm text-red-500">
      Failed to load. Please retry.
    </div>
  );
}

function RowEmpty({ text }) {
  return (
    <div className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300">
      {text}
    </div>
  );
}
