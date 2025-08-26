import React from "react";
import InventoryTableRow from "./InventoryTableRow";

const InventoryTable = ({ products }) => {
  return (
    <div className="relative  mx-auto overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3 text-center">
              #
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Product name
            </th>
            <th scope="col" className="px-6 py-3 text-end">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Shin's code */}
          {/* {products.length==0 && <tr><td className="text-center p-5" colSpan={4}>There is no product</td></tr>} */}
          {(!products || products.length === 0) && (
            <tr>
              <td colSpan={4} className="p-0">
                <div className="flex flex-col items-center justify-center text-center p-10 sm:p-14 bg-white dark:bg-gray-900">
                  {/* Icon */}
                  <div className="rounded-full p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/30 mb-4">
                    {/* lucide-react icon; adjust if you prefer another */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15V6a2 2 0 0 0-2-2h-5l-2-2H5a2 2 0 0 0-2 2v11" />
                      <rect x="3" y="13" width="18" height="8" rx="2" />
                    </svg>
                  </div>

                  {/* Text */}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                    No products yet
                  </h3>
                  <p className="mt-2 max-w-md text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    Create your first product or import a CSV to get started.
                  </p>

                  {/* Actions */}
                  <div className="mt-6 w-full flex flex-col sm:flex-row gap-3 sm:justify-center">
                    {/* Prefer a callback if you have one, else link to your create page */}
                    {typeof onCreateProduct === "function" ? (
                      <button
                        onClick={onCreateProduct}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                         bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        <span className="inline-block">＋</span>
                        Create Product
                      </button>
                    ) : (
                      <a
                        href="/dashboard/inventory/create"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                         bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        <span className="inline-block">＋</span>
                        Create Product
                      </a>
                    )}

                    {typeof onImportProducts === "function" ? (
                      <button
                        onClick={onImportProducts}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                         bg-gray-100 hover:bg-gray-200 text-gray-800
                         dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 transition-colors"
                      >
                        Import CSV
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => alert("Hook up CSV import handler")}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                         bg-gray-100 hover:bg-gray-200 text-gray-800
                         dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 transition-colors"
                      >
                        Import CSV
                      </button>
                    )}
                  </div>

                  {/* Tips */}
                  <ul className="mt-6 space-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <li>• Add name, price, and SKU when creating products.</li>
                    <li>• You can bulk import via CSV later.</li>
                  </ul>
                </div>
              </td>
            </tr>
          )}

          {products?.map((product) => (
            <InventoryTableRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
