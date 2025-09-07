"use client";
import React from "react";
import InventoryTable from "./InventoryTable";
import InventoryActionBar from "./InventoryActionBar";
import { AlertTriangle, RotateCcw } from "lucide-react";
import InventoryTableSkeleton from "./InventoryTableSkeleton";
import InventoryListPagination from "./InventoryListPagination";
import useProduct from "../hooks/useProduct";
import InventoryListMobile from "./InventoryListMobile";
import InventoryListMobileSkeleton from "./InventoryListMobileSkeleton";
import InventoryListPaginationMobile from "./InventoryListPaginationMobile";
import { useI18n } from "@/i18n/I18nProvider";

const InventoryListSection = () => {
  const { t } = useI18n();

  const {
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
    // pagination
    total,
    currentPage,
    lastPage,
    perPage,
    hasPrev,
    hasNext,
    prevLink,
    nextLink,
    sortBy,
    sortDirection,
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
              {t(
                "inventoryListSection.errorTitle",
                "商品の読み込みに失敗しました"
              )}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t(
                "inventoryListSection.errorBody",
                "接続を確認して、もう一度お試しください。"
              )}
            </p>

            <div className="mt-4">
              <button
                onClick={() => mutate()}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 active:scale-[.99] transition"
              >
                <RotateCcw className="size-4" />
                {t("inventoryListSection.retry", "再試行")}
              </button>
            </div>


          </div>
        </div>
      </section>
    );
  }

  // Success → your normal UI
  return (
    <section>
      <div className=" px-4 sm:px-6 lg:px-10 pt-4">
        <InventoryActionBar
          searchRef={searchRef}
          handleOnChange={handleOnChange}
          handleClearSearch={handleClearSearch}
        />
        <div className="hidden sm:block">
          {productsLoading ? (
            <InventoryTableSkeleton rows={6} />
          ) : (
            <InventoryTable products={products?.data} />
          )}
        </div>

        <div className="block sm:hidden">
          {productsLoading ? (
            <InventoryListMobileSkeleton rows={6} />
          ) : (
            <InventoryListMobile products={products?.data} />
          )}
        </div>

        {/* Pagination controls */}
        <div className="hidden md:block">
          <InventoryListPagination
            total={total}
            currentPage={currentPage}
            lastPage={lastPage}
            perPage={perPage}
            hasPrev={hasPrev}
            hasNext={hasNext}
            prevLink={prevLink}
            nextLink={nextLink}
            handleChangeLimit={handleChangeLimit}
            handlePagination={handlePagination}
            handleSortBy={handleSortBy}
            handleSortDirection={handleSortDirection}
            sortBy={sortBy}
            sortDirection={sortDirection}
          />
        </div>

        {/* Mobile pagination */}
        <div className="md:hidden">
          <InventoryListPaginationMobile
            total={total}
            currentPage={currentPage}
            lastPage={lastPage}
            perPage={perPage}
            hasPrev={hasPrev}
            hasNext={hasNext}
            prevLink={prevLink}
            nextLink={nextLink}
            handleChangeLimit={handleChangeLimit}
            handlePagination={handlePagination}
            handleSortBy={handleSortBy}
            handleSortDirection={handleSortDirection}
            sortBy={sortBy}
            sortDirection={sortDirection}
          />
        </div>
      </div>
    </section>
  );
};

export default InventoryListSection;
