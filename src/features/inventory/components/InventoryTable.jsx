"use client";
import React from "react";
import InventoryTableRow from "./InventoryTableRow";
import { useI18n } from "@/i18n/I18nProvider";

const InventoryTable = ({ products, onCreateProduct, onImportProducts }) => {
  const { t } = useI18n();

  return (
    <div className="relative  mx-auto shadow-md sm:rounded-lg">
      <table className="w-full overflow-x-auto text-sm text-left rtl:text-right text-gray-700 dark:text-gray-300">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3 text-center">
              {t("inventoryTable.headers.index", "#")}
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              {t("inventoryTable.headers.name", "商品名")}
            </th>
            <th scope="col" className="px-6 py-3 text-end">
              {t("inventoryTable.headers.price", "価格")}
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              {t("inventoryTable.headers.action", "操作")}
            </th>
          </tr>
        </thead>
        <tbody>
          {(!products || products.length === 0) && (
            <tr>
              <td colSpan={4} className="p-0">
                <div className="flex flex-col items-center justify-center text-center p-10 sm:p-14 bg-white dark:bg-gray-900">
                  {/* Icon */}
                  <div className="rounded-full p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/30 mb-4">
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
                    {t("inventoryTable.emptyTitle", "商品がありません")}
                  </h3>

                  {/* Actions */}
                  <div className="mt-6 w-full flex flex-col sm:flex-row gap-3 sm:justify-center">
                    {typeof onCreateProduct === "function" ? (
                      <button
                        onClick={onCreateProduct}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                         bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        aria-label={t(
                          "inventoryTable.createCta",
                          "＋ 商品を作成"
                        )}
                        title={t("inventoryTable.createCta", "＋ 商品を作成")}
                      >
                        <span className="inline-block"></span>
                        {t("inventoryTable.createCta", "＋ 商品を作成")}
                      </button>
                    ) : (
                      <a
                        href="/dashboard/inventory/create"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                         bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        aria-label={t(
                          "inventoryTable.createCta",
                          "＋ 商品を作成"
                        )}
                        title={t("inventoryTable.createCta", "＋ 商品を作成")}
                      >
                        <span className="inline-block"></span>
                        {t("inventoryTable.createCta", "＋ 商品を作成")}
                      </a>
                    )}
                  </div>

                  {/* Tips */}
                  <ul className="mt-6 space-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      {t(
                        "inventoryTable.tips.tip1",
                        "・商品の作成時は名前・価格を入力してください。"
                      )}
                    </li>
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
