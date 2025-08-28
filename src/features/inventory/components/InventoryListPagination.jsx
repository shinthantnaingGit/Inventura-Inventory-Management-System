import { productApiUrl } from "@/services/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const InventoryListPagination = ({ setUrl, products }) => {
  //WITHOUT LINKS FROM BACKEND
  // const currentPage = parseInt(products?.meta?.current_page);
  // const lastPage = Number(products?.meta?.last_page || 1);
  // const makeUrl = (page) => `${productApiUrl}?limit=5&page=${page}`;
  // const handleNext = () => setUrl(makeUrl(Math.min(lastPage, currentPage + 1)));
  // const handlePrevManual = () => setUrl(makeUrl(Math.max(1, currentPage - 1)));
  const router = useRouter();
  const handleNext = () => {
    console.log(products?.links?.next);
    const url = new URL(products?.links?.next);
    console.log(url);
    setUrl(`${productApiUrl}/${url.search}`);
    router.push(`${url.search}`);
  };

  const handlePrev = () => {
    const url = new URL(products?.links?.prev);
    setUrl(`${productApiUrl}/${url.search}`);
    router.push(`${url.search}`);
  };

  return (
    <div className="flex justify-around items-center gap-4 mt-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-1 shadow-sm">
        <span className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Total
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {Number(products?.meta?.total || 0).toLocaleString()}
        </span>
      </div>
      <div className="flex justify-center items-center  gap-4">
        <button
          type="button"
          className="active:scale-90 active:opacity-85 duration-200 flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          // onClick={handlePrev}
          disabled={!products?.links?.prev}
          onClick={handlePrev}
        >
          <ChevronLeft className="size-4" /> Prev
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {products?.meta?.current_page} / {products?.meta?.last_page}
        </span>
        <button
          type="button"
          className="active:scale-90 active:opacity-85 duration-200 flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 disabled:pointer-events-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          // onClick={handleNext}
          disabled={!products?.links?.next}
          onClick={handleNext}
        >
          Next <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default InventoryListPagination;
