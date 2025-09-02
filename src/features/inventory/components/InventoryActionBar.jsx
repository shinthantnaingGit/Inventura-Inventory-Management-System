"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Search, Plus, X } from "lucide-react";
import Link from "next/link";
import { productApiUrl } from "@/services/product";
import { debounce } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";

const InventoryActionBar = ({ setUrl }) => {
  const searchParams = useSearchParams();
  const searchRef = useRef();
  const router = useRouter();

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
        setUrl(`${productApiUrl}?${params.toString()}`);
        // 2) update URL bar (shareable)
        router.push(`?${params.toString()}`);
      }, 500),
    [searchParams, setUrl]
  );

  // hydrate input from URL on mount
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && searchRef.current) searchRef.current.value = q;
    return () => debouncedSearch.cancel();
  }, [debouncedSearch, searchParams]);

  const handleOnChange = (e) => debouncedSearch(e.target.value);

  const clearSearch = () => {
    if (!searchRef.current) return;
    searchRef.current.value = "";
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    setUrl(productApiUrl); // reset SWR key
    router.push("?"); // clear URL params
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mb-5">
      {/* Search Product Input */}
      <div className="relative w-full sm:w-1/3 ">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5" />
        <input
          ref={searchRef}
          onChange={handleOnChange}
          type="text"
          placeholder="Search product..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {/* Clear (X) button */}
        {searchRef.current?.value && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Create Product Button */}
      <Link
        href={"/dashboard/inventory/create"}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                         bg-green-500 text-white hover:bg-green-600 
                         dark:bg-green-600 dark:hover:bg-green-700 
                         transition-colors w-full sm:w-auto shadow-xl"
      >
        <Plus className="w-5 h-5" />
        <span>Create Product</span>
      </Link>
    </div>
  );
};

export default InventoryActionBar;
