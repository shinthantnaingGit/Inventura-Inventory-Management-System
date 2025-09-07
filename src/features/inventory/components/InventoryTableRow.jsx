"use client";
import React from "react";
import { Pencil, Trash, Info } from "lucide-react";
import Link from "next/link";
import { confirmDialog } from "primereact/confirmdialog";
import { destroyProduct, productApiUrl } from "@/services/product";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { useI18n } from "@/i18n/I18nProvider";

const InventoryTableRow = ({ product: { id, product_name, price } }) => {
  const { mutate } = useSWRConfig();
  const { t } = useI18n();

  const handleDelete = () => {
    confirmDialog({
      message: t(
        "inventoryRow.confirm.message",
        '"{name}" を削除しますか？'
      ).replace("{name}", product_name),
      header: t("inventoryRow.confirm.header", "削除の確認"),
      acceptLabel: t("inventoryRow.confirm.accept", "削除する"),
      rejectLabel: t("inventoryRow.confirm.reject", "キャンセル"),
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const res = await destroyProduct(id);
          const result = await res.json();
          if (!res.ok) {
            throw new Error(t("inventoryRow.toast.fail", "削除に失敗しました"));
          }
          toast.success(t("inventoryRow.toast.deleted", "削除しました"));
          // FIX: revalidate any SWR cache keys that start with productApiUrl
          await mutate(
            (key) => typeof key === "string" && key.startsWith(productApiUrl),
            undefined,
            { revalidate: true }
          ); // FIX
        } catch (err) {
          toast.error(t("inventoryRow.toast.error", "エラーが発生しました"));
        }
      },
    });
  };

  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
      >
        {id}
      </th>

      <td className="px-6 py-4 text-center">{product_name}</td>

      <td className="px-6 py-4 text-end">{price}</td>

      {/* Action icons: view, edit, delete */}
      <td className="px-6 py-4 flex justify-center ">
        <div className="flex items-center space-x-4">
          {/* View product detail */}
          <Link
            href={`/dashboard/inventory/${id}`}
            aria-label={t(
              "inventoryRow.aria.view",
              "{name} の詳細を表示"
            ).replace("{name}", product_name)}
            title={t("inventoryRow.viewTitle", "詳細を表示")}
          >
            <Info className="size-8 active:scale-90 border active:opacity-90 duration-200 dark:border-gray-700 p-1 border-gray-300 rounded dark:hover:bg-gray-700  hover:bg-gray-200 text-blue-600 dark:text-blue-400 hover:underline" />
          </Link>

          {/* Edit product */}
          <Link
            href={`/dashboard/inventory/${id}/edit`}
            aria-label={t("inventoryRow.aria.edit", "{name} を編集").replace(
              "{name}",
              product_name
            )}
            title={t("inventoryRow.editTitle", "編集")}
          >
            <Pencil className="size-8 active:scale-90 border active:opacity-90 duration-200 dark:border-gray-700 p-1 border-gray-300 rounded dark:hover:bg-gray-700 hover:bg-gray-200 text-bl text-green-600 dark:text-green-400 hover:underline" />
          </Link>

          {/* Delete product */}
          <button
            onClick={handleDelete}
            title={t("inventoryRow.deleteTitle", "削除")}
            aria-label={t("inventoryRow.deleteTitle", "削除")}
          >
            <Trash className="size-8 active:scale-90 border active:opacity-90 duration-200 dark:border-gray-700 p-1 border-gray-300 rounded dark:hover:bg-gray-700 hover:bg-gray-200 text-bl text-red-600 dark:text-red-400 hover:underline" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default InventoryTableRow;
