"use client";
import React, { useMemo, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Trophy,
  ArrowRight,
  RefreshCw,
  CalendarDays,
  SlidersHorizontal,
} from "lucide-react";
import useAccountStore from "@/store/useAccountStore";
import { useI18n } from "@/i18n/I18nProvider";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/* ----------------------------- data ----------------------------- */

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/records`;

const fetcher = (url) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${useAccountStore.getState().token}` },
  }).then((r) => r.json());

/* ------------------------------ UI ------------------------------ */

export default function DashBoardSection() {
  const { t } = useI18n();

  // filters map 1:1 to backend
  const [filters, setFilters] = useState({
    voucher_id: "",
    product_id: "",
    min_quantity: "",
    max_quantity: "",
    min_cost: "",
    max_cost: "",
    date_from: "",
    date_to: "",
  });

  const qs = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== "" && v != null) qs.set(k, v);
  });
  const url = qs.toString() ? `${BASE}?${qs.toString()}` : BASE;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  const records = data?.data ?? [];

  /* ------------------------- aggregations ------------------------ */

  const {
    totalRevenue,
    totalQuantity,
    uniqueProducts,
    avgCostPerRecord,
    topProducts,
    revenueOverTime,
    revenueByMonth,
  } = useMemo(() => {
    if (!records.length) {
      return {
        totalRevenue: 0,
        totalQuantity: 0,
        uniqueProducts: 0,
        avgCostPerRecord: 0,
        topProducts: [],
        revenueOverTime: [],
        revenueByMonth: [],
      };
    }

    const sumCost = records.reduce((a, r) => a + Number(r.cost || 0), 0);
    const sumQty = records.reduce((a, r) => a + Number(r.quantity || 0), 0);
    const uniq = new Set(records.map((r) => r.product?.id)).size;
    const avg = sumCost / records.length;
    const dtLabel = (iso) =>
      new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        // second: "2-digit",   // uncomment if you want more granularity
      }).format(new Date(iso));

    const overTime = [...records]
      .filter((r) => r.created_at)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map((r) => ({
        label: dtLabel(r.created_at), // <-- date + time
        cost: Number(r.cost || 0),
        date: new Date(r.created_at),
      }));
    // by month
    const monthMap = new Map();
    overTime.forEach(({ date, cost }) => {
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      monthMap.set(key, (monthMap.get(key) ?? 0) + cost);
    });
    const byMonth = [...monthMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => ({
        label: key, // "YYYY-MM"
        revenue: value,
      }));

    // top products by qty
    const qtyMap = new Map();
    for (const r of records) {
      const name =
        r.product?.product_name ?? t("dashboard.recents.unknown", "Unknown");
      qtyMap.set(name, (qtyMap.get(name) ?? 0) + Number(r.quantity || 0));
    }
    const top = [...qtyMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7) // show more bars
      .map(([name, qty]) => ({ name, qty }));

    return {
      totalRevenue: sumCost,
      totalQuantity: sumQty,
      uniqueProducts: uniq,
      avgCostPerRecord: avg,
      topProducts: top,
      revenueOverTime: overTime,
      revenueByMonth: byMonth,
    };
  }, [records, t]);

  /* --------------------------- handlers -------------------------- */

  const onField = (e) =>
    setFilters((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onClear = () =>
    setFilters({
      voucher_id: "",
      product_id: "",
      min_quantity: "",
      max_quantity: "",
      min_cost: "",
      max_cost: "",
      date_from: "",
      date_to: "",
    });

  // quick date range helpers
  const setRange = (days) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - (days - 1));
    setFilters((s) => ({
      ...s,
      date_from: toISO(from),
      date_to: toISO(to),
    }));
  };

  /* --------------------------- chart data ------------------------ */

  const lineData = {
    labels: revenueOverTime.map((p) => p.label),
    datasets: [
      {
        label: t("dashboard.charts.revenue", "Revenue"),
        data: revenueOverTime.map((p) => p.cost),
        borderColor: "rgba(59,130,246,1)", // blue-500
        backgroundColor: "rgba(59,130,246,0.25)", // blue-500/25
        tension: 0.3,
        fill: true,
        pointRadius: 2,
      },
    ],
  };

  const monthData = {
    labels: revenueByMonth.map((m) => m.label),
    datasets: [
      {
        label: t("dashboard.charts.revenueByMonthLegend", "Revenue by Month"),
        data: revenueByMonth.map((m) => m.revenue),
        backgroundColor: "rgba(16,185,129,0.8)", // emerald-500
      },
    ],
  };

  const topData = {
    labels: topProducts.map((p) => p.name),
    datasets: [
      {
        label: t("dashboard.charts.quantity", "Quantity"),
        data: topProducts.map((p) => p.qty),
        backgroundColor: "rgba(245,158,11,0.85)", // amber-500
      },
    ],
  };

  const baseOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { boxWidth: 12 } },
      tooltip: { mode: "index", intersect: false },
    },
    maintainAspectRatio: false,
  };

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
            <div className="h-64">
              <Line data={lineData} options={baseOptions} />
            </div>
          </Card>
        </div>

        <Card title={t("dashboard.charts.revenueByMonth", "Revenue by Month")}>
          <div className="h-64">
            <Bar data={monthData} options={baseOptions} />
          </div>
        </Card>

        <Card
          title={t(
            "dashboard.charts.topProductsByQty",
            "Top Products by Quantity"
          )}
        >
          <div className="h-64">
            <Bar data={topData} options={{ ...baseOptions, indexAxis: "y" }} />
          </div>
        </Card>
      </div>

      {/* FILTERS */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-gray-500" />
            <span>{t("dashboard.filters.title", "Filters")}</span>
          </div>
        }
        subtitle={t(
          "dashboard.filters.subtitle",
          "Refine result set, then Apply"
        )}
        rightSlot={
          <button
            onClick={() => mutate()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            title={t("dashboard.filters.refreshNow", "Refresh now")}
          >
            <RefreshCw className="size-4" />
            {t("dashboard.filters.refresh", "Refresh")}
          </button>
        }
      >
        {/* Quick Date Presets */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <CalendarDays className="size-4" />
            {t("dashboard.filters.quickRanges", "Quick ranges:")}
          </span>
          <PresetBtn onClick={() => setRange(7)}>
            {t("dashboard.filters.last7", "Last 7 days")}
          </PresetBtn>
          <PresetBtn onClick={() => setRange(30)}>
            {t("dashboard.filters.last30", "Last 30 days")}
          </PresetBtn>
          <PresetBtn onClick={() => setRange(90)}>
            {t("dashboard.filters.last90", "Last 90 days")}
          </PresetBtn>
          <PresetBtn
            onClick={() =>
              setFilters((s) => ({ ...s, date_from: "", date_to: "" }))
            }
          >
            {t("dashboard.filters.clearRange", "Clear range")}
          </PresetBtn>
        </div>

        {/* Form grid */}
        <div className="grid gap-3 md:grid-cols-4">
          <Input
            label={t("dashboard.filters.voucherId", "Voucher ID")}
            name="voucher_id"
            value={filters.voucher_id}
            onChange={onField}
          />
          <Input
            label={t("dashboard.filters.productId", "Product ID")}
            name="product_id"
            value={filters.product_id}
            onChange={onField}
          />
          <Input
            label={t("dashboard.filters.minQty", "Min Quantity")}
            name="min_quantity"
            value={filters.min_quantity}
            onChange={onField}
            type="number"
          />
          <Input
            label={t("dashboard.filters.maxQty", "Max Quantity")}
            name="max_quantity"
            value={filters.max_quantity}
            onChange={onField}
            type="number"
          />
          <Input
            label={t("dashboard.filters.minCost", "Min Cost")}
            name="min_cost"
            value={filters.min_cost}
            onChange={onField}
            type="number"
          />
          <Input
            label={t("dashboard.filters.maxCost", "Max Cost")}
            name="max_cost"
            value={filters.max_cost}
            onChange={onField}
            type="number"
          />
          <Input
            label={t("dashboard.filters.dateFrom", "Date From")}
            name="date_from"
            value={filters.date_from}
            onChange={onField}
            type="date"
          />
          <Input
            label={t("dashboard.filters.dateTo", "Date To")}
            name="date_to"
            value={filters.date_to}
            onChange={onField}
            type="date"
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => mutate()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700 active:scale-95"
          >
            {t("dashboard.filters.apply", "Apply")}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {t("dashboard.filters.reset", "Reset")}
          </button>
          <Link
            href="/dashboard/inventory"
            className="ml-auto inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
          >
            {t("nav.inventory", "在庫")} <ArrowRight className="size-4" />
          </Link>
        </div>
      </Card>

      {/* RECENTS */}
      <Card title={t("dashboard.recents.title", "Recent Records")}>
        {isLoading ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="py-3">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="mt-2 h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </li>
            ))}
          </ul>
        ) : records.length ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {records.slice(0, 12).map((r) => (
              <li
                key={r.id}
                className="flex items-start justify-between gap-4 py-3"
              >
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {r.product?.product_name ??
                      t("dashboard.recents.unknown", "Unknown")}{" "}
                    × {r.quantity}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("dashboard.recents.cost", "Cost")} {fmtCurrency(r.cost)}{" "}
                    · {fmtDate(r.created_at)} ·{" "}
                    {t("dashboard.recents.voucher", "Voucher")} #{r.voucher_id}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-gray-500">
                  {t("dashboard.recents.id", "ID")} {r.id}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-sm text-gray-600 dark:text-gray-300">
            {t("dashboard.recents.empty", "No records match your filters.")}
          </div>
        )}
        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200 p-3">
            {t("dashboard.recents.error", "Failed to load dashboard.")}
          </div>
        )}
      </Card>
    </section>
  );
}

/* ---------------------------- small bits --------------------------- */

function StatsCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {value}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
          <Icon className="size-5 text-gray-700 dark:text-gray-200" />
        </div>
      </div>
    </div>
  );
}

function Card({ title, subtitle, rightSlot, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {rightSlot}
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}

function PresetBtn({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      {children}
    </button>
  );
}

/* ----------------------------- helpers ---------------------------- */

function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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
function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "-";
  }
}
