"use client";
import React from "react";
import Link from "next/link";
import { Info, Pencil, Trash } from "lucide-react";
import { confirmDialog } from "primereact/confirmdialog";
import { destroyVoucher, voucherApiUrl } from "@/services/voucher";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { useI18n } from "@/i18n/I18nProvider";

const VoucherTableRow = ({
voucher,  voucher: { id, voucher_id, customer_name, customer_email, sale_date, total,tax,net_total },
}) => {
  const { mutate } = useSWRConfig();
  const { t } = useI18n();

  const handleDelete = () => {
    confirmDialog({
      message: t(
        "vouchers.confirm.message",
        `"{voucher.voucher_id}" を削除しますか？`
      ).replace("{voucher_id}", voucher_id),
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

  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
      <td className="px-6 py-4 text-center">{id}</td>
      <td className="px-6 py-4 text-center">{voucher_id}</td>
      <td className="px-6 py-4 text-center">{customer_name}</td>
      <td className="px-6 py-4 text-center">{customer_email}</td>
      <td className="px-6 py-4 text-center">{sale_date}</td>
      <td className="px-6 py-4 text-end">{total}</td>
      <td className="px-6 py-4 text-end">{tax}</td>
      <td className="px-6 py-4 text-end">{net_total}</td>
      <td className="px-6 py-4 flex justify-center">
        <div className="flex items-center space-x-3">
          {/* View */}
          <Link
            href={`/dashboard/vouchers/${voucher.id}`}
            aria-label={`${t("vouchers.actions.view", "表示")} ${
              voucher.voucher_id
            }`}
            title={t("vouchers.actions.view", "表示")}
          >
            <Info className="size-6 p-1 border rounded text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-90 duration-200" />
          </Link>

        
          {/* Delete */}
          <button
            onClick={handleDelete}
            title={t("vouchers.actions.delete", "削除")}
            aria-label={`${t("vouchers.actions.delete", "削除")} ${
              voucher.voucher_id
            }`}
          >
            <Trash className="size-6 p-1 border rounded text-red-600 dark:text-red-400 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-90 duration-200" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default VoucherTableRow;
