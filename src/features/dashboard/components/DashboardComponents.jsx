import React from "react";
import Link from "next/link";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Trophy,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  LucideCalendarFold,
  CalendarDays,
} from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import { useI18n } from "@/i18n/I18nProvider";

/* ---------------------------- small bits --------------------------- */

export function StatsCard({ title, value, icon: Icon, isMobile = false }) {
  const baseClasses =
    "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm";
  const paddingClasses = isMobile ? "p-4" : "p-5";
  const titleClasses = isMobile ? "text-xs" : "text-sm";
  const valueClasses = isMobile ? "mt-1 text-xl" : "mt-2 text-2xl";
  const iconContainerClasses = isMobile ? "p-2" : "p-3";

  return (
    <div className={`${baseClasses} ${paddingClasses}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`${titleClasses} text-gray-700 dark:text-gray-300`}>
            {title}
          </p>
          <p
            className={`${valueClasses} font-semibold text-gray-900 dark:text-gray-100`}
          >
            {value}
          </p>
        </div>
        <div
          className={`${iconContainerClasses} rounded-xl bg-gray-100 dark:bg-gray-800`}
        >
          <Icon className="size-5 text-gray-700 dark:text-gray-300" />
        </div>
      </div>
    </div>
  );
}

export function Card({
  title,
  subtitle,
  rightSlot,
  children,
  isMobile = false,
}) {
  const baseClasses =
    "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm";
  const paddingClasses = isMobile ? "p-4" : "p-5";
  const marginClasses = isMobile ? "mb-3" : "mb-4";
  const titleClasses = isMobile ? "text-sm" : "text-base";

  return (
    <div className={baseClasses}>
      <div className={paddingClasses}>
        <div
          className={`${marginClasses} flex items-start justify-between gap-3`}
        >
          <div className={isMobile ? "min-w-0" : ""}>
            {title && (
              <h3
                className={`${titleClasses} font-semibold text-gray-900 dark:text-gray-100 ${
                  isMobile ? "truncate" : ""
                }`}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                className={`${
                  isMobile ? "text-xs" : "text-sm"
                } text-gray-700 dark:text-gray-300`}
              >
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

export function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  isMobile = false,
}) {
  const labelClasses = isMobile ? "text-[11px]" : "text-xs";

  return (
    <label className="block">
      <span
        className={`block ${labelClasses} font-medium text-gray-700 dark:text-gray-300 mb-1`}
      >
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

export function PresetBtn({ children, onClick }) {
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

export function Row({ children }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

/* --------------------------- Chart Components ------------------------ */

export function RevenueOverTimeChart({ revenueOverTime, isMobile = false }) {
  const { t } = useI18n();

  const lineData = {
    labels: revenueOverTime.map((p) => p.label),
    datasets: [
      {
        label: t("dashboard.charts.revenue", "Revenue"),
        data: revenueOverTime.map((p) => p.cost),
        borderColor: "rgba(59,130,246,1)", // blue-500
        backgroundColor: "rgba(59,130,246,0.25)", // blue-500/25
        tension: isMobile ? 0.35 : 0.3,
        fill: true,
        pointRadius: isMobile ? 1.8 : 2,
      },
    ],
  };

  const baseOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { boxWidth: isMobile ? 10 : 12 } },
      tooltip: { mode: "index", intersect: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className={isMobile ? "h-52" : "h-64"}>
      <Line data={lineData} options={baseOptions} />
    </div>
  );
}

export function RevenueByMonthChart({ revenueByMonth, isMobile = false }) {
  const { t } = useI18n();

  const monthData = {
    labels: revenueByMonth.map((m) => m.label),
    datasets: [
      {
        label: t("dashboard.charts.revenueByMonthLegend", "Revenue by Month"),
        data: revenueByMonth.map((m) => m.revenue),
        backgroundColor: isMobile
          ? "rgba(16,185,129,0.85)"
          : "rgba(16,185,129,0.8)", // emerald-500
      },
    ],
  };

  const baseOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { boxWidth: isMobile ? 10 : 12 } },
      tooltip: { mode: "index", intersect: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className={isMobile ? "h-52" : "h-64"}>
      <Bar data={monthData} options={baseOptions} />
    </div>
  );
}

export function TopProductsChart({ topProducts, isMobile = false }) {
  const { t } = useI18n();

  // Truncate long product names for mobile
  const truncateLabel = (name, maxLength = 20) => {
    if (!isMobile || name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  const topData = {
    labels: topProducts.map((p) => truncateLabel(p.name)),
    datasets: [
      {
        label: t("dashboard.charts.quantity", "Quantity"),
        data: topProducts.map((p) => p.qty),
        backgroundColor: isMobile
          ? "rgba(245,158,11,0.9)"
          : "rgba(245,158,11,0.85)", // amber-500
      },
    ],
  };

  const baseOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { boxWidth: isMobile ? 10 : 12 } },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          title: function (context) {
            // Show full product name in tooltip
            const index = context[0].dataIndex;
            return topProducts[index]?.name || "";
          },
        },
      },
    },
    maintainAspectRatio: false,
    scales: isMobile
      ? {
          y: {
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              font: {
                size: 11,
              },
              callback: function (value, index) {
                const label = this.getLabelForValue(value);
                return label.length > 15
                  ? label.substring(0, 15) + "..."
                  : label;
              },
            },
          },
        }
      : undefined,
  };

  return (
    <div className={isMobile ? "h-56" : "h-64"}>
      <Bar data={topData} options={{ ...baseOptions, indexAxis: "y" }} />
    </div>
  );
}

/* --------------------------- Filter Components ------------------------ */

export function FilterHeader({
  isMobile = false,
  filtersOpen,
  setFiltersOpen,
}) {
  const { t } = useI18n();

  if (isMobile) {
    return (
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
    );
  }

  return (
    <div className="flex items-center gap-2">
      <SlidersHorizontal className="size-4 text-gray-700 dark:text-gray-300 " />
      <span>{t("dashboard.filters.title", "Filters")}</span>
    </div>
  );
}

export function RefreshButton({ mutate, isMobile = false }) {
  const { t } = useI18n();

  const baseClasses =
    "inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800";

  return (
    <button
      onClick={() => mutate()}
      className={baseClasses}
      title={t("dashboard.filters.refreshNow", "Refresh now")}
    >
      <RefreshCw className="size-4" />
      {t("dashboard.filters.refresh", "Refresh")}
    </button>
  );
}

export function QuickDatePresets({
  setRange,
  filters,
  setFilters,
  updateURL,
  isMobile = false,
}) {
  const { t } = useI18n();

  const containerClasses = isMobile
    ? "mb-3 text-gray-700 dark:text-gray-300 flex flex-wrap items-center gap-2"
    : "mb-4 flex flex-wrap items-center text-gray-700 dark:text-gray-300 gap-2";

  const getPresetText = (key) => {
    if (isMobile) {
      const mobileKeys = {
        last7: "dashboard.filters.last7Short",
        last30: "dashboard.filters.last30Short",
        last90: "dashboard.filters.last90Short",
        clearRange: "dashboard.filters.clearRangeShort",
      };
      return t(mobileKeys[key] || `dashboard.filters.${key}`, key);
    }
    return t(`dashboard.filters.${key}`, key);
  };

  return (
    <div className={containerClasses}>
      <span className="inline-flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
        <CalendarDays className="size-4" />
        {t("dashboard.filters.quickRanges", "Quick ranges:")}
      </span>
      <PresetBtn onClick={() => setRange(7)}>
        {getPresetText("last7")}
      </PresetBtn>
      <PresetBtn onClick={() => setRange(30)}>
        {getPresetText("last30")}
      </PresetBtn>
      <PresetBtn onClick={() => setRange(90)}>
        {getPresetText("last90")}
      </PresetBtn>
      <PresetBtn
        onClick={() => {
          const newFilters = { ...filters, date_from: "", date_to: "" };
          setFilters(newFilters);
          updateURL(newFilters);
        }}
      >
        {getPresetText("clearRange")}
      </PresetBtn>
    </div>
  );
}

export function FilterInputs({ filters, onField, isMobile = false }) {
  const { t } = useI18n();

  const getLabelKey = (key) => {
    if (isMobile) {
      const mobileKeys = {
        voucherId: "dashboard.filters.voucherIdShort",
        productId: "dashboard.filters.productIdShort",
        minQty: "dashboard.filters.minQtyShort",
        maxQty: "dashboard.filters.maxQtyShort",
        minCost: "dashboard.filters.minCostShort",
        maxCost: "dashboard.filters.maxCostShort",
        dateFrom: "dashboard.filters.fromShort",
        dateTo: "dashboard.filters.toShort",
      };
      return mobileKeys[key] || `dashboard.filters.${key}`;
    }
    return `dashboard.filters.${key}`;
  };

  if (isMobile) {
    return (
      <div className="grid gap-3">
        <Row>
          <Input
            label={t(getLabelKey("voucherId"), "Voucher")}
            name="voucher_id"
            value={filters.voucher_id}
            onChange={onField}
            isMobile={true}
          />
          <Input
            label={t(getLabelKey("productId"), "Product")}
            name="product_id"
            value={filters.product_id}
            onChange={onField}
            isMobile={true}
          />
        </Row>
        <Row>
          <Input
            label={t(getLabelKey("minQty"), "Min Qty")}
            name="min_quantity"
            value={filters.min_quantity}
            onChange={onField}
            type="number"
            isMobile={true}
          />
          <Input
            label={t(getLabelKey("maxQty"), "Max Qty")}
            name="max_quantity"
            value={filters.max_quantity}
            onChange={onField}
            type="number"
            isMobile={true}
          />
        </Row>
        <Row>
          <Input
            label={t(getLabelKey("minCost"), "Min Cost")}
            name="min_cost"
            value={filters.min_cost}
            onChange={onField}
            type="number"
            isMobile={true}
          />
          <Input
            label={t(getLabelKey("maxCost"), "Max Cost")}
            name="max_cost"
            value={filters.max_cost}
            onChange={onField}
            type="number"
            isMobile={true}
          />
        </Row>
        <Row>
          <Input
            label={t(getLabelKey("dateFrom"), "From")}
            name="date_from"
            value={filters.date_from}
            onChange={onField}
            type="date"
            isMobile={true}
          />
          <LucideCalendarFold
            size={20}
            className="translate-y-full -translate-x-full"
          />
        </Row>
        <Row>
          <Input
            label={t(getLabelKey("dateTo"), "To")}
            name="date_to"
            value={filters.date_to}
            onChange={onField}
            type="date"
            isMobile={true}
          />
          <LucideCalendarFold
            size={20}
            className="translate-y-full  -translate-x-full"
          />
        </Row>
      </div>
    );
  }

  return (
    <div className="grid gap-3 text-gray-700 dark:text-gray-300 md:grid-cols-4">
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
  );
}

export function FilterActions({ mutate, onClear, isMobile = false }) {
  const { t } = useI18n();

  const containerClasses = isMobile
    ? "mt-4 flex flex-wrap items-center gap-3"
    : "mt-4 flex items-center gap-2";

  const applyClasses = isMobile
    ? "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700 active:scale-95"
    : "inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700 active:scale-95";

  const resetClasses = isMobile
    ? "inline-flex text-gray-700 dark:text-gray-300 items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
    : "inline-flex text-gray-700 dark:text-gray-300 items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800";

  const linkClasses = isMobile
    ? "ml-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
    : "ml-auto inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700";

  return (
    <div className={containerClasses}>
      <button type="button" onClick={() => mutate()} className={applyClasses}>
        {t("dashboard.filters.apply", "Apply")}
      </button>
      <button type="button" onClick={onClear} className={resetClasses}>
        {t("dashboard.filters.reset", "Reset")}
      </button>
      <Link href="/dashboard/inventory" className={linkClasses}>
        {t("nav.inventory", "在庫")} <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

/* --------------------------- Recent Records Component ------------------------ */

export function RecentRecords({ records, isLoading, error, isMobile = false }) {
  const { t } = useI18n();

  const skeletonCount = isMobile ? 6 : 4;
  const recordsToShow = isMobile ? 10 : 12;
  const skeletonWidth = isMobile ? "w-40" : "w-48";
  const skeletonSubWidth = isMobile ? "w-24" : "w-28";
  const recordGap = isMobile ? "gap-3" : "gap-4";
  const recordPadding = isMobile ? "py-3" : "py-3";
  const idTextSize = isMobile ? "text-[11px]" : "text-xs";
  const voucherKey = isMobile
    ? "dashboard.recents.voucherAbbr"
    : "dashboard.recents.voucher";

  if (isLoading) {
    return (
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <li key={i} className={recordPadding}>
            <div
              className={`h-4 ${skeletonWidth} bg-gray-200 dark:bg-gray-700 rounded animate-pulse`}
            />
            <div
              className={`mt-2 h-3 ${skeletonSubWidth} bg-gray-200 dark:bg-gray-700 rounded animate-pulse`}
            />
          </li>
        ))}
      </ul>
    );
  }

  if (records.length) {
    return (
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {records.slice(0, recordsToShow).map((r) => (
          <li
            key={r.id}
            className={`flex items-start justify-between ${recordGap} ${recordPadding}`}
          >
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {r.product?.product_name ??
                  t("dashboard.recents.unknown", "Unknown")}{" "}
                × {r.quantity}
              </p>
              <p
                className={`${
                  isMobile
                    ? "text-xs text-gray-700"
                    : "text-xs text-gray-700 dark:text-gray-300"
                }`}
              >
                {t("dashboard.recents.cost", "Cost")} {fmtCurrency(r.cost)} ·{" "}
                {fmtDate(r.created_at)} · {t(voucherKey, "Voucher")}{" "}
                {isMobile ? "#" : "#"}
                {r.voucher_id}
              </p>
            </div>
            <span
              className={`shrink-0 ${idTextSize} text-gray-700 dark:text-gray-300`}
            >
              {t("dashboard.recents.id", "ID")} {r.id}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-sm text-gray-700 dark:text-gray-300">
      {t("dashboard.recents.empty", "No records match your filters.")}
    </div>
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
