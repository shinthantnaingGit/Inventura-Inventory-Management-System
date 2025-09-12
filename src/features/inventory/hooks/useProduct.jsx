// hooks/useProduct.jsx
"use client";
import { useProducts, productApiUrl } from "@/services/product";
import debounce from "lodash/debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

const useProduct = () => {
  //<-----HOOKS----->
  const router = useRouter();
  const searchParams = useSearchParams();

  //<-----UI REFS----->
  const searchRef = useRef(null);

  //<----UPDATE PARAMS HELPER----->
  const updateParams = (patch) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`?${params.toString()}`);
  };

  //<-----MAIN FETCH WITH SWR----->
  const url = `${productApiUrl}?${searchParams.toString()}`;
  const {
    data: products,
    error: productsError,
    isLoading: productsLoading,
    mutate,
  } = useProducts(url);

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
    const pageParams = Object.fromEntries(u.searchParams.entries());
    updateParams(pageParams);
  };

  //<-----PAGINATION SYSTEM (PER PAGE)----->
  const handleChangeLimit = (nextLimit) => {
    const limit = String(nextLimit ?? "");
    if (!limit) return;
    updateParams({ limit, page: "1" });
  };

  // Sync: whenever URL params change, or mount unmount
  //Hydrating SEARCH INPUT and PER PAGE
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && searchRef.current) searchRef.current.value = q;

    return () => debouncedSearch.cancel();
  }, [searchParams, debouncedSearch]);

  // <-----SORTING SYSTEM-----> (name/price + asc/desc)
  const sortBy = searchParams.get("sort_by") || ""; // ADDED
  const sortDirection = searchParams.get("sort_direction") || ""; // ADDED

  const handleSortBy = (value) => {
    updateParams({ sort_by: value || "", page: "1" });
  };

  const handleSortDirection = (value) => {
    updateParams({ sort_direction: value || "", page: "1" });
  };

  // <-----CONVINIENCE VALUES FOR UI----->
  const meta = products?.meta || {};
  const links = products?.links || {};
  const total = meta.total;
  const currentPage = meta.current_page;
  const lastPage = meta.last_page;
  const perPage = searchParams.get("limit") || products?.meta?.per_page;

  return {
    // data
    products,
    productsError,
    productsLoading,
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

    // derived UI values
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
  };
};

export default useProduct;
