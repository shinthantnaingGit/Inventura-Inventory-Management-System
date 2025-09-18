"use client";
import React from "react";

/**
 * VoucherTableSkeleton
 * - Loading skeleton for desktop/table voucher list
 * - Pass `rows` to control number of skeleton rows
 */
export default function VoucherTableSkeleton({ rows = 6 }) {
  return (
    <div className="relative mx-auto overflow-x-auto shadow-md sm:rounded-lg animate-pulse">
      <table className="w-full text-sm text-left rtl:text-right text-gray-600 dark:text-gray-300">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3 text-center">#</th>
            <th scope="col" className="px-6 py-3 text-center">伝票番号</th>
            <th scope="col" className="px-6 py-3 text-center">顧客名</th>
            <th scope="col" className="px-6 py-3 text-center">メール</th>
            <th scope="col" className="px-6 py-3 text-center">日付</th>
            <th scope="col" className="px-6 py-3 text-center">合計</th>
            <th scope="col" className="px-6 py-3 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr
              key={i}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
            >
              <td className="px-6 py-4 text-center">
                <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded" />
              </td>
              <td className="px-6 py-4 text-center">
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
              </td>
              <td className="px-6 py-4 text-center">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </td>
              <td className="px-6 py-4 text-center">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </td>
              <td className="px-6 py-4 text-center">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </td>
              <td className="px-6 py-4 text-center">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-2">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
