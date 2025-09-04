import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";

const InventoryListPagination = ({
  total,
  currentPage,
  lastPage,
  perPage,
  hasPrev,
  hasNext,
  prevLink,
  nextLink,

  handleChangeLimit,
  handlePagination,
}) => {
  const handleChange = (e) => {
    console.log(limitRef.current.value);
    console.log(e.target.value);
  };
  return (
    <div className="flex flex-wrap justify-around items-center gap-4 mt-6">
      {/* Total */}
      <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-1 shadow-sm">
        <span className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Total
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {total ?? <Spiral size="20" speed="0.9" color="gray" />}
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-3">
        <button
          type="button"
          className="active:scale-90 active:opacity-85 duration-200 flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          disabled={!hasPrev}
          onClick={() => handlePagination(prevLink)}
        >
          <ChevronLeft className="size-4" /> Prev
        </button>

        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currentPage ?? <Spiral size="20" speed="0.9" color="gray" />} /{" "}
          {lastPage ?? <Spiral size="20" speed="0.9" color="gray" />}
        </span>

        <button
          type="button"
          className="active:scale-90 active:opacity-85 duration-200 flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 disabled:pointer-events-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          disabled={!hasNext}
          onClick={() => handlePagination(nextLink)}
        >
          Next <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Items per page */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="limit"
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Show
        </label>
        <select
          id="limit"
          // ✅ Use defaultValue so it's uncontrolled (works with ref)
          onChange={(e) => handleChangeLimit(e.target.value)}
          defaultValue={String(perPage ?? "5")}
          className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InventoryListPagination;
