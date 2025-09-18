import { useMemo, useState } from "react";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
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
const recordApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/records`;

const fetcher = (url) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${useAccountStore.getState().token}` },
  }).then((r) => r.json());

/* ----------------------------- helpers ---------------------------- */
function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function useDashboardData(isMobile = false) {
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

  // Build URL from current filters
  const qs = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== "" && v != null) qs.set(k, v);
  });
  const url = qs.toString() ? `${recordApiUrl}?${qs.toString()}` : recordApiUrl;

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

    // Different label formatting for mobile vs desktop
    const dtLabel = (iso) => {
      if (isMobile) {
        // Mobile: only date, no time
        return new Intl.DateTimeFormat(undefined, {
          month: "short",
          day: "numeric",
        }).format(new Date(iso));
      } else {
        // Desktop: date + time
        return new Intl.DateTimeFormat(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          // second: "2-digit",   // uncomment if you want more granularity
        }).format(new Date(iso));
      }
    };

    const overTime = [...records]
      .filter((r) => r.created_at)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map((r) => ({
        label: dtLabel(r.created_at), // <-- date only for mobile, date + time for desktop
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
  }, [records, t, isMobile]);

  /* --------------------------- handlers -------------------------- */
  // Helper function to update URL
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== "" && value != null) {
        params.set(key, value);
      }
    });
    const newURL = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    router.push(newURL, { scroll: false });
  };

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

  // quick date range helpers
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

  return {
    // Data
    records,
    error,
    isLoading,
    mutate,
    filters,

    // Aggregated data
    totalRevenue,
    totalQuantity,
    uniqueProducts,
    avgCostPerRecord,
    topProducts,
    revenueOverTime,
    revenueByMonth,

    // Handlers
    onField,
    onClear,
    setRange,
    updateURL,
    setFilters,
  };
}
