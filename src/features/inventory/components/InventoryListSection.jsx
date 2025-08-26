"use client";
import React from "react";
import InventoryTable from "./InventoryTable";
import InventoryActionBar from "./InventoryActionBar";
import InventoryListSkeleton from "./InventoryListSkeleton";
import { getProducts } from "@/services/product";
import useAccountStore from "@/store/useAccountStore";
import { AlertTriangle, RotateCcw } from "lucide-react";

const InventoryListSection = () => {
  // SWR hook (get mutate so we can Retry on error)
  const { data: products, error, isLoading, mutate } = getProducts();

  // Debug if needed
  // console.log(useAccountStore.getState());
  // console.log(products?.data);

  // Loading → show skeleton UI
  if (isLoading) {
    return (
      <>
        <InventoryListSkeleton rows={6} />
      </>
    );
  }

  // Error → show compact card + Retry
  if (error) {
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
              {String(error?.message ?? "Unknown error")}
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
        <InventoryActionBar />
        <InventoryTable products={products?.data} />
      </div>
    </section>
  );
};

export default InventoryListSection;
