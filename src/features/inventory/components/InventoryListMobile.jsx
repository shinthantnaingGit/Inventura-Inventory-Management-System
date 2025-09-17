"use client";
import React from "react";
import Link from "next/link";
import { Tag, Info, Pencil, Trash, BadgeJapaneseYen } from "lucide-react";
import { destroyProduct, productApiUrl } from "@/services/product";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { useI18n } from "@/i18n/I18nProvider";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import ConfirmationDialog from "@/components/ConfirmationDialog";

/**
 * InventoryListMobile
 * - Card list (NOT a table)
 * - Intended for mobile only (use `md:hidden` on the wrapper where you render it)
 *
 * Props:
 *   - products: array of { id, product_name, price }
 */
export default function InventoryListMobile({ products }) {
  const { mutate } = useSWRConfig();
  const { t } = useI18n();
  const { isOpen, dialogConfig, showDialog, hideDialog, handleConfirm } =
    useConfirmationDialog();

  const handleDelete = (id, name) => {
    showDialog({
      title: t("inventoryMobile.confirm.header", "削除の確認"),
      description: t(
        "inventoryMobile.confirm.message",
        '"{name}" を削除しますか？'
      ).replace("{name}", name),
      confirmText: t("inventoryMobile.confirm.accept", "削除する"),
      cancelText: t("inventoryMobile.confirm.reject", "キャンセル"),
      onConfirm: async () => {
        try {
          const res = await destroyProduct(id);
          const result = await res.json();
          if (!res.ok)
            throw new Error(
              t("inventoryMobile.toast.fail", "削除に失敗しました")
            );
          toast.success(t("inventoryMobile.toast.deleted", "削除しました"));
          mutate(
            (key) => typeof key === "string" && key.startsWith(productApiUrl)
          );
        } catch (err) {
          toast.error(t("inventoryMobile.toast.error", "エラーが発生しました"));
        }
      },
    });
  };

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {t("inventoryMobile.emptyTitle", "商品がありません")}
        </h3>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/inventory/create"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            aria-label={t("inventoryMobile.createCta", "＋ 商品を作成")}
            title={t("inventoryMobile.createCta", "＋ 商品を作成")}
          >
            {t("inventoryMobile.createCta", "＋ 商品を作成")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ul role="list" className="space-y-3">
        {products.map((p) => (
          <li
            key={p.id}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-4"
          >
            {/* Top line: ID badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-200">
                  <Tag className="size-3.5" />
                  {t("inventoryMobile.idBadge", "ID")}: {p.id}
                </span>
              </div>
            </div>

            {/* Name */}
            <h4 className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">
              {p.product_name}
            </h4>

            {/* Price */}
            <div className="mt-1 flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
              <BadgeJapaneseYen className="size-4" />
              <span>{p.price}</span>
            </div>

            {/* Actions */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Link
                href={`/dashboard/inventory/${p.id}`}
                className="inline-flex text-gray-600 dark:text-gray-300  items-center justify-center gap-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={`${t("inventoryMobile.view", "表示")} ${
                  p.product_name
                }`}
                title={t("inventoryMobile.view", "表示")}
              >
                <Info className="size-4 text-blue-600 dark:text-blue-400" />
                <span>{t("inventoryMobile.view", "表示")}</span>
              </Link>

              <Link
                href={`/dashboard/inventory/${p.id}/edit`}
                className="text-gray-600 dark:text-gray-300 inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={`${t("inventoryMobile.edit", "編集")} ${
                  p.product_name
                }`}
                title={t("inventoryMobile.edit", "編集")}
              >
                <Pencil className="size-4 text-green-600 dark:text-green-400" />
                <span>{t("inventoryMobile.edit", "編集")}</span>
              </Link>

              <button
                onClick={() => handleDelete(p.id, p.product_name)}
                className="text-gray-600 dark:text-gray-300 inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={`${t("inventoryMobile.delete", "削除")} ${
                  p.product_name
                }`}
                title={t("inventoryMobile.delete", "削除")}
              >
                <Trash className="size-4 text-red-600 dark:text-red-400" />
                <span>{t("inventoryMobile.delete", "削除")}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmationDialog
        isOpen={isOpen}
        onClose={hideDialog}
        onConfirm={handleConfirm}
        title={dialogConfig.title}
        description={dialogConfig.description}
        confirmText={dialogConfig.confirmText}
        cancelText={dialogConfig.cancelText}
        variant="destructive"
      />
    </>
  );
}
