import { productApiUrl } from "@/services/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";

const InventoryListPagination = ({ setUrl, products }) => {
  const router = useRouter();
  console.log(products);
  const pageRef = useRef();
  const handleNext = () => {
    const url = new URL(products?.links?.next);
    console.log(url.search);
    setUrl(`${productApiUrl}/${url.search}`);
    router.push(`${url.search}`);
  };

  const handlePrev = () => {
    const url = new URL(products?.links?.prev);
    setUrl(`${productApiUrl}/${url.search}`);
    router.push(`${url.search}`);
  };

  const handleChangeLimit = () => {
    const limit = pageRef.current.value;
    // always reset to page=1 when changing limit
    const url = `${productApiUrl}?limit=${limit}&page=1`;
    setUrl(url);
    router.push(`?limit=${limit}&page=1`);
  };

  return (
    <div className="flex flex-wrap justify-around items-center gap-4 mt-6">
      {/* Total */}
      <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-1 shadow-sm">
        <span className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Total
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {products?.meta?.total ?? (
            <Spiral size="20" speed="0.9" color="gray" />
          )}
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-3">
        <button
          type="button"
          className="active:scale-90 active:opacity-85 duration-200 flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          disabled={!products?.links?.prev}
          onClick={handlePrev}
        >
          <ChevronLeft className="size-4" /> Prev
        </button>

        <span className="text-sm text-gray-600 dark:text-gray-400">
          {products?.meta?.current_page ?? (
            <Spiral size="20" speed="0.9" color="gray" />
          )}{" "}
          /{" "}
          {products?.meta?.last_page ?? (
            <Spiral size="20" speed="0.9" color="gray" />
          )}
        </span>

        <button
          type="button"
          className="active:scale-90 active:opacity-85 duration-200 flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 disabled:pointer-events-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          disabled={!products?.links?.next}
          onClick={handleNext}
        >
          Next <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Dedicated select box: items per page */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="limit"
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Show
        </label>
        <select
          ref={pageRef}
          id="limit"
          onChange={handleChangeLimit}
          value={products?.meta?.per_page || 5}
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
