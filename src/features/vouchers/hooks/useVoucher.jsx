// hooks/useVoucher.jsx
"use client";
import { fetchVouchers, voucherApiUrl } from "@/services/voucher";
import debounce from "lodash/debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useCallback } from "react";
import useSWR from "swr";

const useVoucher = () => {
  //<-----HOOKS----->
  const router = useRouter();
  const searchParams = useSearchParams();

  //<-----UI REFS----->
  const searchRef = useRef(null);

  //<----UPDATE PARAMS HELPER----->
  const updateParams = useCallback(
    (patch) => {
      const base =
        typeof window !== "undefined"
          ? window.location.search
          : searchParams.toString();
      const params = new URLSearchParams(base);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === "" || value == null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  //<-----MAIN FETCH WITH SWR----->
  const url = `${voucherApiUrl}?${searchParams.toString()}`;
  const {
    data: Vouchers,
    error: VouchersError,
    isLoading: VouchersLoading,
    mutate,
  } = useSWR(url,fetchVouchers)

  //<-----SEARCH SYSTEM----->
  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        const v = value.trim();
        updateParams({ q: v, page: "1" });
      }, 500),
    [updateParams]
  );

  // Search input change to debounce
  const handleOnChange = (e) => debouncedSearch(e.target.value);

  // Clear search (back to base or keep other params)
  const handleClearSearch = () => {
    if (searchRef.current) searchRef.current.value = "";
    updateParams({ q: "", page: "1" });
  };

  //<-----PAGINATION SYSTEM (NEXT/PREV)----->
  // Pagination using API links (prev/next)
  const handlePagination = (absoluteLink) => {
    if (!absoluteLink) return;
    const u = new URL(absoluteLink);
    const page = u.searchParams.get("page") || "1";
    updateParams({ page });
  };

  //<-----PAGINATION SYSTEM (PER PAGE)----->
  const handleChangeLimit = (nextLimit) => {
    const limit = String(nextLimit ?? "");
    if (!limit) return;
    updateParams({ limit, page: "1" });
  };

  // <-----SORTING SYSTEM-----> (name/price + asc/desc)
  const sortBy = searchParams.get("sort_by") || ""; // ADDED
  const sortDirection = searchParams.get("sort_direction") || ""; // ADDED

  const handleSortBy = (value) => {
    updateParams({ sort_by: value || "", page: "1" });
  };

  const handleSortDirection = (value) => {
    updateParams({ sort_direction: value || "", page: "1" });
  };

  //<-----FILTER SYSTEM----->
  const minNetTotal = searchParams.get("min_net_total") || "";
  const maxNetTotal = searchParams.get("max_net_total") || "";
  const netTotalBetween = searchParams.get("net_total_between") || "";
  const startDate = searchParams.get("start_date") || "";
  const endDate = searchParams.get("end_date") || "";
  const dateBetween = searchParams.get("date_between") || "";

  const handleMinNetTotal = (value) => {
    updateParams({ min_net_total: value, page: "1" });
  };

  const handleMaxNetTotal = (value) => {
    updateParams({ max_net_total: value, page: "1" });
  };

  const handleNetTotalBetween = (min, max) => {
    updateParams({ net_total_between: `${min},${max}`, page: "1" });
  };

  const handleStartDate = (value) => {
    updateParams({ start_date: value, page: "1" });
  };

  const handleEndDate = (value) => {
    updateParams({ end_date: value, page: "1" });
  };

  const handleDateBetween = (start, end) => {
    updateParams({ date_between: `${start},${end}`, page: "1" });
  };

  // single-call reset to avoid stale snapshot issues
  const handleResetFilters = () => {
    updateParams({
      min_net_total: "",
      max_net_total: "",
      net_total_between: "",
      start_date: "",
      end_date: "",
      date_between: "",
      page: "1",
    });
  };

  // SYNC: whenever URL params change, or mount unmount
  //<-----HYDRATING SEARCH INPUT and PER PAGE----->
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && searchRef.current) searchRef.current.value = q;

    return () => debouncedSearch.cancel();
  }, [searchParams, debouncedSearch]);

  // <-----CONVINIENCE VALUES FOR UI----->
  const meta = Vouchers?.meta || {};
  const links = Vouchers?.links || {};
  const total = meta.total;
  const currentPage = meta.current_page;
  const lastPage = meta.last_page;
  const perPage = searchParams.get("limit") || Vouchers?.meta?.per_page;

  return {
    // data
    Vouchers,
    VouchersError,
    VouchersLoading,
    mutate,

    // refs
    searchRef,

    // handlers
    handleOnChange,
    handleClearSearch,
    handlePagination,
    handleChangeLimit,
    handleSortBy,
    handleSortDirection,
    handleMinNetTotal,
    handleMaxNetTotal,
    handleNetTotalBetween,
    handleStartDate,
    handleEndDate,
    handleDateBetween,
    handleMinNetTotal,
    handleMaxNetTotal,
    handleStartDate,
    handleEndDate,
    handleResetFilters,

    // derived values
    total,
    currentPage,
    lastPage,
    perPage,
    hasPrev: Boolean(links.prev),
    hasNext: Boolean(links.next),
    prevLink: links.prev,
    nextLink: links.next,
    sortBy,
    sortDirection,
    minNetTotal,
    maxNetTotal,
    netTotalBetween,
    startDate,
    endDate,
    dateBetween,
  };
};

export default useVoucher;
