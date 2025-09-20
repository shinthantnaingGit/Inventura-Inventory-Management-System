"use client";

import React, { useState } from "react";
import { BarChart3, ShoppingCart, Package, Trophy } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { useDashboardData } from "../hooks/useDashboardData";
import {
  StatsCard,
  Card,
  FilterHeader,
  RefreshButton,
  QuickDatePresets,
  FilterInputs,
  FilterActions,
  RecentRecords,
  RevenueOverTimeChart,
  RevenueByMonthChart,
  TopProductsChart,
} from "./DashboardComponents";

/* ------------------------------ UI ------------------------------ */
export default function DashBoardSectionMobile() {
  const { t } = useI18n();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    records,
    error,
    isLoading,
    mutate,
    filters,
    totalRevenue,
    totalQuantity,
    uniqueProducts,
    avgCostPerRecord,
    topProducts,
    revenueOverTime,
    revenueByMonth,
    onField,
    onClear,
    setRange,
    updateURL,
    setFilters,
  } = useDashboardData(true); // Mobile version

  /* ------------------------------ render ------------------------- */
  return (
    <section className="px-4 py-4 space-y-5">
      {/* INSIGHTS */}
      <div className="grid gap-3">
        <StatsCard
          title={t("dashboard.stats.totalRevenue", "総売上")}
          value={fmtCurrency(totalRevenue)}
          icon={BarChart3}
          isMobile={true}
        />
        <StatsCard
          title={t("dashboard.stats.totalQuantity", "総数量")}
          value={fmtNumber(totalQuantity)}
          icon={ShoppingCart}
          isMobile={true}
        />
        <StatsCard
          title={t("dashboard.stats.avgCostPerRecord", "1レコード平均コスト")}
          value={fmtCurrency(avgCostPerRecord)}
          icon={Package}
          isMobile={true}
        />
        <StatsCard
          title={t("dashboard.stats.topProduct", "人気商品")}
          value={topProducts[0]?.name ?? "—"}
          icon={Trophy}
          isMobile={true}
        />
      </div>

      {/* CHARTS */}
      <Card
        title={t("dashboard.cards.revenueOverTime", "売上の推移")}
        isMobile={true}
      >
        <RevenueOverTimeChart
          revenueOverTime={revenueOverTime}
          isMobile={true}
        />
      </Card>

      <Card
        title={t("dashboard.cards.revenueByMonth", "月別売上")}
        isMobile={true}
      >
        <RevenueByMonthChart revenueByMonth={revenueByMonth} isMobile={true} />
      </Card>

      <Card
        title={t(
          "dashboard.cards.topProductsByQty",
          "Top Products by Quantity"
        )}
        isMobile={true}
      >
        <TopProductsChart topProducts={topProducts} isMobile={true} />
      </Card>

      {/* FILTERS */}
      <Card
        title={
          <FilterHeader
            isMobile={true}
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
          />
        }
        subtitle={t(
          "dashboard.filters.subtitle",
          "Refine result set, then Apply"
        )}
        rightSlot={<RefreshButton mutate={mutate} isMobile={true} />}
        isMobile={true}
      >
        {filtersOpen && (
          <>
            <QuickDatePresets
              setRange={setRange}
              filters={filters}
              setFilters={setFilters}
              updateURL={updateURL}
              isMobile={true}
            />
            <FilterInputs filters={filters} onField={onField} isMobile={true} />
            <FilterActions mutate={mutate} onClear={onClear} isMobile={true} />
          </>
        )}
      </Card>

      {/* RECENTS */}
      <Card
        title={t("dashboard.recents.title", "最新のレコード")}
        isMobile={true}
      >
        <RecentRecords
          records={records}
          isLoading={isLoading}
          error={error}
          isMobile={true}
        />
        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200 p-3">
            {t(
              "dashboard.recents.error",
              "ダッシュボードの読み込みに失敗しました。"
            )}
          </div>
        )}
      </Card>
    </section>
  );
}

/* ----------------------------- helpers ---------------------------- */

function fmtCurrency(n) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));
}

function fmtNumber(n) {
  return new Intl.NumberFormat().format(Number(n || 0));
}
