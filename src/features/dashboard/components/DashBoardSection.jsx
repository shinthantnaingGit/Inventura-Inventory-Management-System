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

export default function DashBoardSection() {
  const { t } = useI18n();

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
  } = useDashboardData(false); // Desktop version

  /* ------------------------------ render ------------------------- */

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-4 space-y-6">
      {/* INSIGHTS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title={t("dashboard.stats.totalRevenue", "Total Revenue")}
          value={fmtCurrency(totalRevenue)}
          icon={BarChart3}
        />
        <StatsCard
          title={t("dashboard.stats.totalQuantity", "Total Quantity")}
          value={fmtNumber(totalQuantity)}
          icon={ShoppingCart}
        />
        <StatsCard
          title={t("dashboard.stats.avgCostPerRecord", "Avg Cost / Record")}
          value={fmtCurrency(avgCostPerRecord)}
          icon={Package}
        />
        <StatsCard
          title={t("dashboard.stats.topProduct", "Top Product")}
          value={topProducts[0]?.name ?? "—"}
          icon={Trophy}
        />
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="col-span-2">
          <Card
            title={t("dashboard.charts.revenueOverTime", "Revenue Over Time")}
          >
            <RevenueOverTimeChart revenueOverTime={revenueOverTime} />
          </Card>
        </div>

        <Card title={t("dashboard.charts.revenueByMonth", "Revenue by Month")}>
          <RevenueByMonthChart revenueByMonth={revenueByMonth} />
        </Card>

        <Card
          title={t(
            "dashboard.charts.topProductsByQty",
            "Top Products by Quantity"
          )}
        >
          <TopProductsChart topProducts={topProducts} />
        </Card>
      </div>

      {/* FILTERS */}
      <Card
        title={<FilterHeader />}
        subtitle={t(
          "dashboard.filters.subtitle",
          "Refine result set, then Apply"
        )}
        rightSlot={<RefreshButton mutate={mutate} />}
      >
        <QuickDatePresets
          setRange={setRange}
          filters={filters}
          setFilters={setFilters}
          updateURL={updateURL}
        />
        <FilterInputs filters={filters} onField={onField} />
        <FilterActions mutate={mutate} onClear={onClear} />
      </Card>

      {/* RECENTS */}
      <Card title={t("dashboard.recents.title", "Recent Records")}>
        <RecentRecords records={records} isLoading={isLoading} error={error} />
        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200 p-3">
            {t("dashboard.recents.error", "Failed to load dashboard.")}
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
    currency: "JPY", // adjust if you need
    maximumFractionDigits: 0,
  }).format(Number(n || 0));
}

function fmtNumber(n) {
  return new Intl.NumberFormat().format(Number(n || 0));
}
