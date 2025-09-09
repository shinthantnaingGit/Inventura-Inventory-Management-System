"use client";
import React from "react";
import VoucherTableRow from "./VoucherTableRow";
import { useI18n } from "@/i18n/I18nProvider";

const VoucherTable = ({ vouchers }) => {
  const { t } = useI18n();

  return (
    <div className="relative mx-auto overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3 text-center">
              {t("vouchers.table.id", "ID")}
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              {t("vouchers.table.voucherId", "伝票番号")}
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              {t("vouchers.table.customerName", "顧客名")}
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              {t("vouchers.table.customerEmail", "メール")}
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              {t("vouchers.table.saleDate", "販売日")}
            </th>
            <th scope="col" className="px-6 py-3 text-end">
              {t("vouchers.table.total", "合計")}
            </th>
            <th scope="col" className="px-6 py-3 text-end">
              {t("vouchers.table.tax", "税額")}
            </th>
            <th scope="col" className="px-6 py-3 text-end">
              {t("vouchers.table.netTotal", "総合計")}
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              {t("vouchers.table.action", "操作")}
            </th>
          </tr>
        </thead>
        <tbody>
          {(!vouchers || vouchers.length === 0) && (
            <tr>
              <td colSpan={9} className="p-0">
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
                    {t("vouchers.empty.title", "伝票がありません")}
                  </h3>

                  {/* Actions */}
                  <div className="mt-6 w-full flex flex-col sm:flex-row gap-3 sm:justify-center">
                    <a
                      href="/dashboard/vouchers/create"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                        bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      ＋ {t("vouchers.empty.createCta", "伝票を作成")}
                    </a>
                  </div>
                </div>
              </td>
            </tr>
          )}

          {vouchers?.map((voucher) => (
            <VoucherTableRow key={voucher.id} voucher={voucher} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherTable;
