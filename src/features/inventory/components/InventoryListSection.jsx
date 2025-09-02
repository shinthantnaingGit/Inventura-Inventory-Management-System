"use client";
import React, { useEffect, useState } from "react";
import InventoryTable from "./InventoryTable";
import InventoryActionBar from "./InventoryActionBar";
import { AlertTriangle, RotateCcw } from "lucide-react";
import InventoryTableSkeleton from "./InventoryTableSkeleton";
import InventoryListPagination from "./InventoryListPagination";
import useProduct from "../hooks/useProduct";

const InventoryListSection = () => {
  const {
    setUrl,
    products,
    productsError,
    mutate,
    productsLoading,
    handlePagination,
    limitRef,
    handleChangeLimit,
    searchParams,
    searchRef,
    handleOnChange,
    clearSearch,
  } = useProduct();
  // Error → show compact card + Retry
  if (productsError) {
    return (
      <section className="rounded-xl bg-[--color-card] text-[--color-fg] border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="size-5 text-red-500 mt-0.5"
            aria-hidden="true"
          />
          <div className="flex-1">
            <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
              Failed to load products
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Please check your connection and try again.
            </p>

            <div className="mt-4">
              <button
                onClick={() => mutate()}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 active:scale-[.99] transition"
              >
                <RotateCcw className="size-4" />
                Retry
              </button>
            </div>

            {/* Optional: surface the actual message for debugging */}
            <pre className="mt-4 max-h-28 overflow-auto text-xs text-red-400/90">
              {String(productsError?.message ?? "Unknown error")}
            </pre>
          </div>
        </div>
      </section>
    );
  }

  // Success → your normal UI
  return (
    <section>
      <div className="px-4 sm:px-6 lg:px-10 py-4 space-y-6">
        <InventoryActionBar
          searchRef={searchRef}
          setUrl={setUrl}
          handleOnChange={handleOnChange}
          clearSearch={clearSearch}
        />
        {productsLoading ? (
          <InventoryTableSkeleton rows={6} />
        ) : (
          <InventoryTable products={products?.data} />
        )}
      </div>
      {/* Pagination controls */}
      <InventoryListPagination
        setUrl={setUrl}
        products={products}
        handlePagination={handlePagination}
        limitRef={limitRef}
        handleChangeLimit={handleChangeLimit}
        searchParams={searchParams}
      />
    </section>
  );
};

export default InventoryListSection;
