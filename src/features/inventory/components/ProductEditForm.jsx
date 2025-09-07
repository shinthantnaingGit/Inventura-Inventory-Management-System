"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { getProduct, updateProduct } from "@/services/product";
import { ArrowLeft } from "lucide-react";
import ProductEditSkeleton from "./ProductEditSkeleton";
import { useI18n } from "@/i18n/I18nProvider";

const ProductEditForm = () => {
  const router = useRouter();
  const { id } = useParams();
  const { t } = useI18n();

  // Load current product
  const {
    data: productResp,
    error,
    isLoading,
    mutate, // optional retry hook if you add a button later
  } = getProduct(id);

  // RHF setup
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      product_name: "",
      price: "",
      confirm: false,
      goback: false,
    },
  });

  // When product loads, hydrate the form
  useEffect(() => {
    const p = productResp?.data;
    if (p) {
      reset({
        product_name: p.product_name ?? "",
        price: p.price ?? "",
        confirm: false,
        goback: false,
      });
    }
  }, [productResp, reset]);

  const confirmed = watch("confirm");
  const goBack = watch("goback");

  const onSubmit = async (data) => {
    try {
      const payload = {
        product_name: data.product_name,
        price: data.price,
      };
      const res = await updateProduct(id, payload);
      const result = (await res.json?.()) ?? res; // support Response or direct object
      if (res.ok === false) {
        throw new Error(result?.message || t("productEdit.toast.failUpdate", "商品の更新に失敗しました"));
      }
      toast.success(t("productEdit.toast.success", "商品を更新しました"));

      if (goBack) {
        router.push("/dashboard/inventory");
      } else {
        router.push(`/dashboard/inventory/${id}`);
      }
    } catch (err) {
      toast.error(t("productEdit.toast.genericError", "エラーが発生しました"));
    }
  };

  // Loading / Error minimal states
  if (isLoading) {
    return <ProductEditSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[80%] sm:max-w-[60%] lg:max-w-[40%]">
        <div className="bg-white border dark:border-gray-700 border-gray-300 dark:bg-gray-800 rounded-xl p-6">
          <p className="text-sm text-red-500">
            {t("productEdit.loadError", "商品情報の取得に失敗しました。もう一度お試しください。")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[80%] sm:max-w-[60%] lg:max-w-[40%] sm:p-5">
      {/* 🔙 Back button (mobile) */}
      <button
        type="button"
        onClick={() => router.push("/dashboard/inventory")}
        className="mb-5 sm:hidden inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 
             bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium 
             text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 
             transition active:scale-95"
      >
        <ArrowLeft className="size-4" />
        <span>{t("productEdit.backToInventory", "在庫に戻る")}</span>
      </button>

      <h3 className="text-gray-900 text-xl dark:text-gray-100 font-bold mb-5">
        {t("productEdit.title", "商品を編集")}
      </h3>

      <div className="bg-white border dark:border-gray-700 border-gray-300 dark:bg-gray-800 rounded-xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Product */}
          <div>
            <label
              htmlFor="product"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("productEdit.labels.product", "商品")} <span className="text-red-500">*</span>
            </label>
            <input
              id="product"
              type="text"
              placeholder={t("productEdit.placeholders.product", "例：データ分析サービス")}
              {...register("product_name", {
                required: t("productEdit.errors.productRequired", "商品名は必須です"),
                minLength: { value: 2, message: t("productEdit.errors.productMin", "2文字以上で入力してください") },
                maxLength: { value: 80, message: t("productEdit.errors.productMax", "80文字以内で入力してください") },
              })}
              aria-invalid={!!errors.product_name}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg白 dark:bg-gray-900 
                       text-gray-900 dark:text-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.product_name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.product_name.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("productEdit.labels.price", "価格")} <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="number"
              placeholder={t("productEdit.placeholders.price", "例：1100")}
              {...register("price", {
                required: t("productEdit.errors.priceRequired", "価格は必須です"),
                valueAsNumber: true,
                min: { value: 0, message: t("productEdit.errors.priceMin", "0未満にはできません") },
              })}
              aria-invalid={!!errors.price}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 
                       text-gray-900 dark:text-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Confirm */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("confirm", {
                required: t("productEdit.errors.confirmRequired", "更新前に確認にチェックしてください"),
              })}
              className="size-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t("productEdit.labels.confirm", "この商品を更新することを確認します")}
            </span>
          </div>
          {errors.confirm && (
            <p className="text-sm text-red-500">{errors.confirm.message}</p>
          )}

          {/* Go Back to Product List */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("goback")}
              className="size-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t("productEdit.labels.goBackAfterSave", "保存後に商品一覧へ戻る")}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() =>
                reset({
                  product_name: productResp?.data?.product_name ?? "",
                  price: productResp?.data?.price ?? "",
                  confirm: false,
                  goback: false,
                })
              }
              className="w-full sm:w-auto rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 
                       text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {t("productEdit.actions.reset", "リセット")}
            </button>
            <button
              type="submit"
              disabled={!confirmed || isSubmitting}
              className="w-full sm:w-auto rounded-lg bg-blue-600 text-white px-4 py-2 
                       hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isSubmitting
                ? t("productEdit.actions.updating", "更新中…")
                : t("productEdit.actions.update", "商品を更新")}
            </button>
          </div>
        </form>
      </div>

      {/* Back button (desktop) */}
      <button
        type="button"
        onClick={() => router.push("/dashboard/inventory")}
        className="mt-5 hidden sm:inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 
             bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium 
             text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 
             transition active:scale-95"
      >
        <ArrowLeft className="size-4" />
        <span>{t("productEdit.backToInventory", "在庫に戻る")}</span>
      </button>
    </div>
  );
};

export default ProductEditForm;
