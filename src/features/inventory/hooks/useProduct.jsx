"use client";
import { getProducts, productApiUrl } from "@/services/product";
import { debounce } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

const useProduct = () => {
  const searchParams = useSearchParams();
  const searchRef = useRef();
  const router = useRouter();
  const limitRef = useRef();

  // SWR hook (get mutate so we can Retry on error)
  const [url, setUrl] = useState(productApiUrl);
  const {
    data: products,
    error: productsError,
    isLoading: productsLoading,
    mutate,
  } = getProducts(url);

  //  <<<<<<< SEARCH SYSTEM >>>>>>>
  // one debounced function per mount
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        const q = encodeURIComponent(value.trim());
        const params = new URLSearchParams(searchParams.toString());
        // set q (remove if empty)
        if (q) {
          params.set("q", q); // URLSearchParams will encode for you
          params.set("page", "1"); // <-- reset page
        } else {
          params.delete("q");
          params.set("page", "1"); // optional: start from 1 when clearing too
        }

        // 1) update SWR key for SEARCHING
        // setUrl(`${productApiUrl}?${params.toString()}`);
        // 2) update URL bar (shareable)
        router.push(`?${params.toString()}`);
      }, 500),
    [searchParams]
  );

  // hydrate input from URL on mount
  //   useEffect(() => {}, [searchParams]);
  useEffect(() => {
    setUrl(`${productApiUrl}?${searchParams.toString()}`);
    const q = searchParams.get("q");
    if (q && searchRef.current) searchRef.current.value = q;
    return () => debouncedSearch.cancel();
  }, [searchParams, debouncedSearch]);

  const handleOnChange = (e) => debouncedSearch(e.target.value);

  const clearSearch = () => {
    if (!searchRef.current) return;
    searchRef.current.value = "";
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    // setUrl(productApiUrl); // reset SWR key
    router.push("?"); // clear URL params
  };
  //  <<<<<<< SEARCH SYSTEM >>>>>>>

  //  <<<<<<< PAGINATION SYSTEM >>>>>>>
  const handlePagination = (link) => {
    const url = new URL(link);
    // console.log(url.search);
    // setUrl(`${productApiUrl}${url.search}`);
    router.push(`${url.search}`);
  };

  const handleChangeLimit = () => {
    const current = Object.fromEntries(searchParams.entries());
    const params = new URLSearchParams({
      ...current,
      limit: String(limitRef.current.value),
      page: "1",
    });
    const qs = params.toString();
    router.push(`?${qs}`); // URL bar
    // setUrl(`${productApiUrl}?${qs}`); // SWR key
  };
  //  <<<<<<< PAGINATION SYSTEM >>>>>>>

  return {
    searchParams,
    url,
    setUrl,
    mutate,
    products,
    productsError,
    productsLoading,
    searchRef,
    router,
    handleOnChange,
    clearSearch,
    limitRef,
    handleChangeLimit,
    handlePagination,
  };
};

export default useProduct;
