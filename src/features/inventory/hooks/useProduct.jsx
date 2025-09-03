"use client";
import { getProducts, productApiUrl } from "@/services/product";
import debounce from "lodash/debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const useProduct = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // UI refs (controlled by hook, used by UI)
  const searchRef = useRef(null);
  const limitRef = useRef(null);

  // SWR key
  const [url, setUrl] = useState(productApiUrl);
  const {
    data: products,
    error: productsError,
    isLoading: productsLoading,
    mutate,
  } = getProducts(url);

  // Helper: push merged params to URL (shareable) and SWR key updates automatically via effect
  const updateParams = (patch) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = new URLSearchParams({ ...current, ...patch });
    router.push(`?${merged.toString()}`);
  };

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        const v = value.trim();
        if (v) {
          updateParams({ q: v, page: "1" });
        } else {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("q");
          params.set("page", "1");
          router.push(`?${params.toString()}`);
        }
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams] // router is stable; searchParams change should rebuild
  );

  // Wire input change to debounce
  const handleOnChange = (e) => debouncedSearch(e.target.value);

  // Clear search (back to base or keep other params)
  const handleClearSearch = () => {
    if (searchRef.current) searchRef.current.value = "";
    const current = Object.fromEntries(searchParams.entries());
    const merged = new URLSearchParams(current);
    merged.delete("q");
    merged.set("page", "1");
    router.push(`?${merged.toString()}`);
  };

  // Pagination using API links (prev/next)
  const handlePagination = (absoluteLink) => {
    if (!absoluteLink) return;
    const u = new URL(absoluteLink);
    const pageParams = Object.fromEntries(u.searchParams.entries());
    updateParams(pageParams);
  };

  // Page limit change (preserve other filters, reset page=1)
  const handleChangeLimit = () => {
    const limit = String(limitRef.current?.value || "");
    if (!limit) return;
    updateParams({ limit, page: "1" });
  };

  // Sync: whenever URL params change, rebuild SWR key and hydrate inputs
  useEffect(() => {
    const qs = searchParams.toString();
    setUrl(qs ? `${productApiUrl}?${qs}` : productApiUrl);

    const q = searchParams.get("q");
    if (q && searchRef.current) searchRef.current.value = q;

    // set initial limit select value
    const limit = searchParams.get("limit");
    if (limit && limitRef.current) limitRef.current.value = limit;

    return () => debouncedSearch.cancel();
  }, [searchParams, debouncedSearch]);

  // Convenience values for UI (avoid passing raw searchParams/products around)
  const meta = products?.meta || {};
  const links = products?.links || {};
  const total = meta.total;
  const currentPage = meta.current_page;
  const lastPage = meta.last_page ;
  const perPage =searchParams.get("limit") || products?.meta?.per_page ;

  return {
    // data
    products,
    productsError,
    productsLoading,
    mutate,

    // refs
    searchRef,
    limitRef,

    // handlers
    handleOnChange,
    handleClearSearch,
    handlePagination,
    handleChangeLimit,

    // derived UI values
    total,
    currentPage,
    lastPage,
    perPage,
    hasPrev: Boolean(links.prev),
    hasNext: Boolean(links.next),
    prevLink: links.prev,
    nextLink: links.next,
  };
};
export default useProduct;
