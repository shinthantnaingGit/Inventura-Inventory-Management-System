"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchProducts, productApiUrl} from "@/services/product";
import {
  AlertTriangle,
  RotateCcw,
  Tag,
  DollarSign,
  Calendar,
  Clock,
  Pencil,
  ArrowLeft,
  BadgeJapaneseYenIcon,
} from "lucide-react";
import ProductDetailSkeleton from "./ProductDetailSkeleton";
import { useI18n } from "@/i18n/I18nProvider";
import useSWR from "swr";

const ProductDetailSection = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: product, error, isLoading, mutate } = useSWR(`${productApiUrl}/${id}`, fetchProducts);
  const { t } = useI18n();

  if (isLoading) return <ProductDetailSkeleton />;

  if (error) {
    return (
      <section className="mx-auto max-w-full sm:max-w-[70%] lg:max-w-[60%] px-4 sm:px-5 pb-24 sm:pb-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="size-5 text-red-500 mt-0.5"
              aria-hidden="true"
            />
            <div className="flex-1">
              <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
                {t("productDetail.errorTitle", "商品の読み込みに失敗しました")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {error?.message ||
                  t(
                    "productDetail.errorBody",
                    "接続を確認して、もう一度お試しください。"
                  )}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => mutate && mutate()}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 active:scale-[.99] transition"
                >
                  <RotateCcw className="size-4" />
                  {t("productDetail.retry", "再試行")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const createdAt = product?.data?.created_at
    ? new Date(product.data.created_at).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";
  const updatedAt = product?.data?.updated_at
    ? new Date(product.data.updated_at).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";
  const productName = product?.data?.product_name || "";
  const price = product?.data?.price;

  return (
    <section className="mx-auto max-w-full sm:max-w-[70%] lg:max-w-[60%] px-4 sm:px-5 pb-24 sm:pb-6">
      {/* Back (mobile) */}
      <button
        type="button"
        onClick={() => router.push("/dashboard/inventory")}
        className="mb-4 sm:hidden inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium 
                   text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 
                   transition active:scale-95"
      >
        <ArrowLeft className="size-4" />
        <span>{t("productDetail.backToInventory", "在庫に戻る")}</span>
      </button>

      <h3 className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-4">
        {t("productDetail.title", "商品詳細")}
      </h3>

      <div className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-10 shadow-sm">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
            <Tag className="w-4 h-4" />
            {t("productDetail.idBadge", "ID")}: {product?.data?.id ?? id}
          </span>

          <h4 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex-1">
            {productName}
          </h4>

          <Link
            href={`/dashboard/inventory/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-amber-500 text-white hover:bg-amber-600 active:scale-[.98] transition"
          >
            <Pencil className="w-4 h-4" />
            {t("productDetail.edit", "編集")}
          </Link>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2 text-xl font-bold text-green-600 dark:text-green-400">
          <BadgeJapaneseYenIcon className="w-5 h-5" />
          <span>{price}</span>
        </div>

        {/* Meta grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {t("productDetail.createdAt", "作成日時")}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {createdAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {t("productDetail.updatedAt", "更新日時")}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {updatedAt}
              </p>
            </div>
          </div>

          {/* Price card for small screens */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 md:hidden">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {t("productDetail.price", "価格")}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {price}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back (desktop) */}
      <button
        type="button"
        onClick={() => router.push("/dashboard/inventory")}
        className="mt-5 hidden sm:inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium 
                   text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 
                   transition active:scale-95"
      >
        <ArrowLeft className="size-4" />
        <span>{t("productDetail.backToInventory", "在庫に戻る")}</span>
      </button>
    </section>
  );
};

export default ProductDetailSection;
