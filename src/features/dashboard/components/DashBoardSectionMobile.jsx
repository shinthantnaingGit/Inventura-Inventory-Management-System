"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Trophy,
  ArrowRight,
  RefreshCw,
  CalendarDays,
  SlidersHorizontal,
  ChevronDown,
  Calendar,
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
  Legend
);

/* ----------------------------- data ----------------------------- */
const recordApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/records`;

const fetcher = (url) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${useAccountStore.getState().token}` },
  }).then((r) => r.json());

/* ------------------------------ UI ------------------------------ */
export default function DashBoardSectionMobile() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL params
  const [filters, setFilters] = useState(() => ({
    voucher_id: searchParams.get("voucher_id") || "",
    product_id: searchParams.get("product_id") || "",
    min_quantity: searchParams.get("min_quantity") || "",
    max_quantity: searchParams.get("max_quantity") || "",
    min_cost: searchParams.get("min_cost") || "",
    max_cost: searchParams.get("max_cost") || "",
    date_from: searchParams.get("date_from") || "",
    date_to: searchParams.get("date_to") || "",
  }));

  const [filtersOpen, setFiltersOpen] = useState(false);

  // Build API URL
  const qs = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v) qs.set(k, v);
  });
  const url = qs.toString() ? `${recordApiUrl}?${qs.toString()}` : recordApiUrl;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  const records = data?.data ?? [];

  /* --------------------------- updateURL ------------------------- */
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const newURL = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    router.push(newURL, { scroll: false });
  };

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

    const overTime = [...records]
      .filter((r) => r.created_at)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map((r) => ({
        label: new Date(r.created_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        cost: Number(r.cost || 0),
        date: new Date(r.created_at),
      }));

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
      .map(([key, value]) => ({ label: key, revenue: value }));

    const qtyMap = new Map();
    for (const r of records) {
      const name =
        r.product?.product_name ?? t("dashboard.recents.unknown", "Unknown");
      qtyMap.set(name, (qtyMap.get(name) ?? 0) + Number(r.quantity || 0));
    }
    const top = [...qtyMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
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
  const onField = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const onClear = () => {
    const clearedFilters = {
      voucher_id: "",
      product_id: "",
      min_quantity: "",
      max_quantity: "",
      min_cost: "",
      max_cost: "",
      date_from: "",
      date_to: "",
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  const setRange = (days) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - (days - 1));
    const newFilters = {
      ...filters,
      date_from: toISO(from),
      date_to: toISO(to),
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  /* --------------------------- chart data ------------------------ */
  const baseOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { boxWidth: 10 } },
      tooltip: { mode: "index", intersect: false },
    },
    maintainAspectRatio: false,
  };

  const lineData = {
    labels: revenueOverTime.map((p) => p.label),
    datasets: [
      {
        label: t("dashboard.charts.revenue", "Revenue"),
        data: revenueOverTime.map((p) => p.cost),
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.25)",
        tension: 0.35,
        fill: true,
        pointRadius: 1.8,
      },
    ],
  };

  const monthData = {
    labels: revenueByMonth.map((m) => m.label),
    datasets: [
      {
        label: t("dashboard.charts.revenueByMonthLegend", "Revenue by Month"),
        data: revenueByMonth.map((m) => m.revenue),
        backgroundColor: "rgba(16,185,129,0.85)",
      },
    ],
  };

  const topData = {
    labels: topProducts.map((p) => p.name),
    datasets: [
      {
        label: t("dashboard.charts.quantity", "Quantity"),
        data: topProducts.map((p) => p.qty),
        backgroundColor: "rgba(245,158,11,0.9)",
      },
    ],
  };

  /* ------------------------------ render ------------------------- */
  return (
    <section className="px-4 py-4 space-y-5">
      {/* INSIGHTS */}
      <div className="grid gap-3">
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
      <Card title={t("dashboard.cards.revenueOverTime", "Revenue Over Time")}>
        <div className="h-52">
          <Line data={lineData} options={baseOptions} />
        </div>
      </Card>

      <Card title={t("dashboard.cards.revenueByMonth", "Revenue by Month")}>
        <div className="h-52">
          <Bar data={monthData} options={baseOptions} />
        </div>
      </Card>

      <Card
        title={t(
          "dashboard.cards.topProductsByQty",
          "Top Products by Quantity"
        )}
      >
        <div className="h-56">
          <Bar data={topData} options={{ ...baseOptions, indexAxis: "y" }} />
        </div>
      </Card>

      {/* FILTERS */}
      <Card
        title={
          <button
            type="button"
            onClick={() => setFiltersOpen((s) => !s)}
            className="inline-flex w-full items-center justify-between"
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-gray-700" />
              {t("dashboard.filters.title", "Filters")}
            </span>
            <ChevronDown
              className={`size-4 text-gray-700 transition-transform ${
                filtersOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        }
        subtitle={t(
          "dashboard.filters.subtitle",
          "Refine result set, then Apply"
        )}
        rightSlot={
          <button
            onClick={() => mutate()}
            className="text-gray-700 dark:text-gray-300 inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            title={t("dashboard.filters.refreshNow", "Refresh")}
          >
            <RefreshCw className="size-4" />
            {t("dashboard.filters.refresh", "Refresh")}
          </button>
        }
      >
        {filtersOpen && (
          <>
            {/* Quick Date Presets */}
            <div className="mb-3 text-gray-700 dark:text-gray-300  flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                <CalendarDays className="size-4" />
                {t("dashboard.filters.quickRanges", "Quick ranges:")}
              </span>
              <PresetBtn onClick={() => setRange(7)}>
                {t("dashboard.filters.last7Short", "7d")}
              </PresetBtn>
              <PresetBtn onClick={() => setRange(30)}>
                {t("dashboard.filters.last30Short", "30d")}
              </PresetBtn>
              <PresetBtn onClick={() => setRange(90)}>
                {t("dashboard.filters.last90Short", "90d")}
              </PresetBtn>
              <PresetBtn
                onClick={() =>
                  setFilters((s) => ({ ...s, date_from: "", date_to: "" }))
                }
              >
                {t("dashboard.filters.clearRangeShort", "Clear")}
              </PresetBtn>
            </div>

            {/* Inputs */}
            <div className="grid gap-3">
              <Row>
                <Input
                  label={t("dashboard.filters.voucherIdShort", "Voucher")}
                  name="voucher_id"
                  value={filters.voucher_id}
                  onChange={onField}
                />
                <Input
                  label={t("dashboard.filters.productIdShort", "Product")}
                  name="product_id"
                  value={filters.product_id}
                  onChange={onField}
                />
              </Row>
              <Row>
                <Input
                  label={t("dashboard.filters.minQtyShort", "Min Qty")}
                  name="min_quantity"
                  value={filters.min_quantity}
                  onChange={onField}
                  type="number"
                />
                <Input
                  label={t("dashboard.filters.maxQtyShort", "Max Qty")}
                  name="max_quantity"
                  value={filters.max_quantity}
                  onChange={onField}
                  type="number"
                />
              </Row>
              <Row>
                <Input
                  label={t("dashboard.filters.minCostShort", "Min Cost")}
                  name="min_cost"
                  value={filters.min_cost}
                  onChange={onField}
                  type="number"
                />
                <Input
                  label={t("dashboard.filters.maxCostShort", "Max Cost")}
                  name="max_cost"
                  value={filters.max_cost}
                  onChange={onField}
                  type="number"
                />
              </Row>
              <Row>
                <div className="flex relative w-full ">
                  <Input
                    label={t("dashboard.filters.fromShort", "From")}
                    name="date_from"
                    value={filters.date_from}
                    onChange={onField}
                    type="date"
                  />
                  <Calendar className="size-4 absolute right-0 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>
              </Row>
              <Row>
                <div className="flex relative w-full">
                  <Input
                    label={t("dashboard.filters.toShort", "To")}
                    name="date_to"
                    value={filters.date_to}
                    onChange={onField}
                    type="date"
                  />
                  <Calendar className="size-4 absolute right-0 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>
              </Row>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => mutate()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700 active:scale-95"
              >
                {t("dashboard.filters.apply", "Apply")}
              </button>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex text-gray-700 dark:text-gray-300 items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {t("dashboard.filters.reset", "Reset")}
              </button>
              <Link
                href="/dashboard/inventory"
                className="ml-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
              >
                {t("nav.inventory", "在庫")} <ArrowRight className="size-4" />
              </Link>
            </div>
          </>
        )}
      </Card>

      {/* RECENTS */}
      <Card title={t("dashboard.recents.title", "Recent Records")}>
        {isLoading ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="py-3">
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="mt-2 h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </li>
            ))}
          </ul>
        ) : records.length ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {records.slice(0, 10).map((r) => (
              <li
                key={r.id}
                className="flex items-start justify-between gap-3 py-3"
              >
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {r.product?.product_name ??
                      t("dashboard.recents.unknown", "Unknown")}{" "}
                    × {r.quantity}
                  </p>
                  <p className="text-xs text-gray-700">
                    {fmtCurrency(r.cost)} · {fmtDate(r.created_at)} ·{" "}
                    {t("dashboard.recents.voucherAbbr", "V#")}
                    {r.voucher_id}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-gray-700">
                  {t("dashboard.recents.id", "ID")} {r.id}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-sm text-gray-700 dark:text-gray-300">
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
function Row({ children }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function StatsCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-700 dark:text-gray-300">{title}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {value}
          </p>
        </div>
        <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
          <Icon className="size-5 text-gray-700 dark:text-gray-300" />
        </div>
      </div>
    </div>
  );
}

function Card({ title, subtitle, rightSlot, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-700 dark:text-gray-300">
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
      <span className="block text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-1">
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
    currency: "USD",
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
