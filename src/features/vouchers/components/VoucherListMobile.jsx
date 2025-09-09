"use client";
import React from "react";
import Link from "next/link";
import { Tag, Mail, User, Calendar, Info, Pencil, Trash } from "lucide-react";
import { confirmDialog } from "primereact/confirmdialog";
import { destroyVoucher, voucherApiUrl } from "@/services/voucher";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { useI18n } from "@/i18n/I18nProvider";

export default function VoucherListMobile({ vouchers }) {
  const { mutate } = useSWRConfig();
  const { t } = useI18n();

  const handleDelete = (id, voucherId) => {
    confirmDialog({
      message: t(
        "vouchers.confirm.message",
        `"{voucher.voucher_id}" を削除しますか？`
      ).replace("{voucher_id}", voucherId),
      header: t("vouchers.confirm.header", "削除の確認"),
      acceptLabel: t("vouchers.confirm.accept", "削除する"),
      rejectLabel: t("vouchers.confirm.reject", "キャンセル"),
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const res = await destroyVoucher(id);
          const result = await res.json();
          if (!res.ok) {
            throw new Error(
              result?.message || t("vouchers.toast.fail", "削除に失敗しました")
            );
          }
          toast.success(t("vouchers.toast.deleted", "伝票を削除しました"));
          await mutate(
            (key) => typeof key === "string" && key.startsWith(voucherApiUrl),
            undefined,
            { revalidate: true }
          ); // refresh list
        } catch (err) {
          toast.error(t("vouchers.toast.error", "エラーが発生しました"));
        }
      },
    });
  };

  if (!vouchers || vouchers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {t("vouchers.empty.title", "伝票がありません")}
        </h3>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/vouchers/create"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {t("vouchers.empty.createCta", "＋ 伝票を作成")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul role="list" className="space-y-3">
      {vouchers.map((v) => (
        <li
          key={v.id}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-4"
        >
          {/* Top line: ID + voucher_id */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-200">
              <Tag className="size-3.5" />
              {t("vouchers.mobile.voucherId", "伝票番号")}: {v.voucher_id}
            </span>
          </div>

          {/* Customer info */}
          <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <User className="size-4" />
              {v.customer_name}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              {v.customer_email}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              {v.sale_date}
            </div>
          </div>

          {/* Totals */}
          <div className="mt-2 text-sm">
            <p>
              {t("vouchers.mobile.total", "合計")}:{" "}
              <span className="font-medium">{v.total}</span>
            </p>
            <p>
              {t("vouchers.mobile.tax", "税")}:{" "}
              <span className="font-medium">{v.tax}</span>
            </p>
            <p>
              {t("vouchers.mobile.netTotal", "税込合計")}:{" "}
              <span className="font-medium">{v.net_total}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Link
              href={`/dashboard/vouchers/${v.id}`}
              className="inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Info className="size-4 text-blue-600 dark:text-blue-400" />
              {t("vouchers.actions.view", "表示")}
            </Link>

            <button
              onClick={() => handleDelete(v.id, v.voucher_id)}
              className="inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Trash className="size-4 text-red-600 dark:text-red-400" />
              {t("vouchers.actions.delete", "削除")}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
