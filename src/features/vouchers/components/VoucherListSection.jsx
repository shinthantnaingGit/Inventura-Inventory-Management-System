"use client";
import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

// Children
import VoucherActionBar from "./VoucherActionBar";
import VoucherTable from "./VoucherTable";
import VoucherTableSkeleton from "./VoucherTableSkeleton";
import VoucherListMobile from "./VoucherListMobile";
import VoucherListMobileSkeleton from "./VoucherListMobileSkeleton";
import VoucherListPagination from "./VoucherListPagination";
import VoucherListPaginationMobile from "./VoucherListPaginationMobile";
import useVoucher from "../hooks/useVoucher";

const VoucherListSection = () => {
  const {
    Vouchers,
    VouchersError,
    VouchersLoading,
    mutate,
    searchRef,
    handleOnChange,
    handleClearSearch,
    handlePagination,
    handleChangeLimit,
    handleSortBy,
    handleSortDirection,
    handleMinNetTotal,
    handleMaxNetTotal,
    handleStartDate,
    handleEndDate,
    handleResetFilters,
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
    minNetTotal,
    maxNetTotal,
    netTotalBetween,
    startDate,
    endDate,
    dateBetween,
  } = useVoucher();

  // Error State
  if (VouchersError) {
    return (
      <section className="rounded-xl bg-[--color-card] text-[--color-fg] border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Failed to load vouchers
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
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
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full flex flex-col">
      {/* Fixed Header: Search + Filters */}
      <div className="flex-shrink-0 px-4 sm:px-6 lg:px-10 pt-4">
        <VoucherActionBar
          searchRef={searchRef}
          handleOnChange={handleOnChange}
          handleClearSearch={handleClearSearch}
        />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-10">
        {/* Desktop Table */}
        <div className="hidden sm:block">
          {VouchersLoading ? (
            <VoucherTableSkeleton rows={6} />
          ) : (
            <VoucherTable vouchers={Vouchers?.data} />
          )}
        </div>

        {/* Mobile List */}
        <div className="block sm:hidden">
          {VouchersLoading ? (
            <VoucherListMobileSkeleton rows={6} />
          ) : (
            <VoucherListMobile vouchers={Vouchers?.data} />
          )}
        </div>
      </div>

      {/* Fixed Footer: Pagination */}
      <div className="flex-shrink-0 px-4 sm:px-6 lg:px-10 pb-4">
        {/* Pagination Desktop */}
        <div className="hidden md:block">
          <VoucherListPagination
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
            handleMinNetTotal={handleMinNetTotal}
            handleMaxNetTotal={handleMaxNetTotal}
            handleStartDate={handleStartDate}
            handleEndDate={handleEndDate}
            handleResetFilters={handleResetFilters}
            sortBy={sortBy}
            sortDirection={sortDirection}
            minNetTotal={minNetTotal}
            maxNetTotal={maxNetTotal}
            netTotalBetween={netTotalBetween}
            startDate={startDate}
            endDate={endDate}
            dateBetween={dateBetween}
          />
        </div>

        {/* Pagination Mobile */}
        <div className="md:hidden">
          <VoucherListPaginationMobile
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
            handleMinNetTotal={handleMinNetTotal}
            handleMaxNetTotal={handleMaxNetTotal}
            handleStartDate={handleStartDate}
            handleEndDate={handleEndDate}
            handleResetFilters={handleResetFilters}
            sortBy={sortBy}
            sortDirection={sortDirection}
          />
        </div>
      </div>
    </section>
  );
};

export default VoucherListSection;
