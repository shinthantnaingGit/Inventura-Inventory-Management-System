"use client";

import React, { useMemo } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  BadgeJapaneseYenIcon,
  Calendar,
} from "lucide-react";
import { storeVoucher } from "@/services/voucher";
import { getProducts, productApiUrl } from "@/services/product";
import { useI18n } from "@/i18n/I18nProvider";

// Small helper for currency-ish display
const fmt = (n) =>
  isNaN(n) ? "-" : new Intl.NumberFormat().format(Math.round(n));

export default function VoucherCreateSection() {
  const router = useRouter();
  const { t } = useI18n();

  // Load products for selector
  const {
    data: productsResp,
    isLoading: productsLoading,
    error: productsError,
  } = getProducts(`${productApiUrl}?limit=100`);
  const products = productsResp?.data ?? [];

  // RHF
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues, // ADDED
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      voucher_id: "",
      customer_name: "",
      customer_email: "",
      sale_date: new Date().toISOString().slice(0, 10),
      records: [
        {
          product_id: "",
          quantity: 1,
          unit_price: "",
          cost: 0,
        },
      ],
      confirm: false,
      goback: false,
    },
  });

  const { fields, append, remove } = useFieldArray({ name: "records", control });

  // Live subscription to records for instant totals
  const recordsWatch = useWatch({ control, name: "records" });

  const taxRate = 0.07; // 7%

  // Totals recompute instantly as records change
  const totals = useMemo(() => {
    const total =
      recordsWatch?.reduce(
        (sum, r) => sum + Number(r?.cost ?? 0),
        0
      ) || 0;
    const tax = total * taxRate;
    const net = total + tax;
    return { total, tax, net };
  }, [recordsWatch]);

  const confirmed = watch("confirm");
  const goBack = watch("goback");

// put this helper above onSubmit (inside component file, outside onSubmit)
const makeVoucherId = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${y}${m}${day}-${rand}`;
};

// REPLACE your existing onSubmit with this version
const onSubmit = async () => {
  try {
    // read current form values
    const values = getValues();

    // build record lines to match API sample (include nested product, quantity as string)
    const items = (values.records || [])
      .filter((r) => r.product_id && Number(r.quantity) > 0)
      .map((r) => {
        const prod = products.find((p) => String(p.id) === String(r.product_id));
        return {
          product_id: Number(r.product_id),
          // include minimal product object like your sample
          product: prod
            ? {
                id: prod.id,
                product_name: prod.product_name,
                price: Number(prod.price),
                created_at: prod.created_at ?? undefined,
              }
            : undefined,
          quantity: String(r.quantity), // API sample uses string
          cost: Number(r.cost || 0),
          created_at: new Date().toISOString(), // optional; harmless if backend ignores
        };
      });

    // compute totals just before submit (simple + precise)
    const total = items.reduce((s, r) => s + (r.cost || 0), 0);
    const tax = +(total * 0.07).toFixed(2);
    const net_total = +(total + tax).toFixed(2);

    // voucher_id fallback if user left it blank
    const voucher_id =
      (values.voucher_id || "").trim() || makeVoucherId();

    const payload = {
      voucher_id,
      customer_name: values.customer_name,
      customer_email: values.customer_email || undefined,
      sale_date: values.sale_date,
      records: items,
      total,
      tax,
      net_total,
      // DO NOT send 'id' in request; backend will generate it
    };

    const res = await storeVoucher(payload);
    const result = (await res.json?.()) ?? res;

    if (!res?.ok) {
      // bubble up API validation message so 422 is obvious
      console.error("Voucher create 422:", result);
      throw new Error(
        result?.message ||
          result?.errors?.[0] ||
          t("vouchers.create.toast.failCreate", "伝票の作成に失敗しました")
      );
    }

    toast.success(t("vouchers.create.toast.success", "伝票を作成しました"));

    const newId = result?.data?.id ?? result?.id;
    if (goBack) {
      router.push("/dashboard/vouchers");
    } else if (newId) {
      router.push(`/dashboard/vouchers/${newId}`);
    } else {
      router.push("/dashboard/vouchers");
    }
  } catch (err) {
    console.error(err);
    toast.error(t("vouchers.create.toast.genericError", "エラーが発生しました"));
  }
};


  return (
    <section className="mx-auto max-w-full sm:max-w-[80%] lg:max-w-[60%] px-4 sm:px-5 pb-24 sm:pb-6">
      {/* Back (mobile) */}
      <Link
        href="/dashboard/vouchers"
        className="mb-5 sm:hidden inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium 
                   text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 
                   transition active:scale-95"
      >
        <ArrowLeft className="size-4" />
        <span>{t("vouchers.create.backToVouchers", "バウチャーに戻る")}</span>
      </Link>

      <h3 className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-4">
        {t("vouchers.create.title", "伝票を作成")}
      </h3>

      <div className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-8 shadow-sm">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Voucher ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("vouchers.create.labels.voucherId", "伝票番号")}
              </label>
              <input
                type="text"
                placeholder={t(
                  "vouchers.create.placeholders.voucherId",
                  "例：INV-20241014-5129"
                )}
                {...register("voucher_id")}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 
                           text-gray-900 dark:text-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sale date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("vouchers.create.labels.saleDate", "販売日")}
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("sale_date", { required: true })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 
                             text-gray-900 dark:text-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Customer name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("vouchers.create.labels.customerName", "顧客名")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={t(
                  "vouchers.create.placeholders.customerName",
                  "例：山田 太郎"
                )}
                {...register("customer_name", {
                  required: t(
                    "vouchers.create.errors.customerNameRequired",
                    "顧客名は必須です"
                  ),
                  minLength: {
                    value: 2,
                    message: t(
                      "vouchers.create.errors.customerMin",
                      "2文字以上で入力してください"
                    ),
                  },
                  maxLength: {
                    value: 80,
                    message: t(
                      "vouchers.create.errors.customerMax",
                      "80文字以内で入力してください"
                    ),
                  },
                })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 
                           text-gray-900 dark:text-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.customer_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.customer_name.message}
                </p>
              )}
            </div>

            {/* Customer email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("vouchers.create.labels.customerEmail", "顧客メール")}
              </label>
              <input
                type="email"
                placeholder={t(
                  "vouchers.create.placeholders.customerEmail",
                  "例：taro@example.com"
                )}
                {...register("customer_email")}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 
                           text-gray-900 dark:text-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Records header */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {t("vouchers.create.lines.title", "明細")}
            </h4>
            <button
              type="button"
              onClick={() =>
                append({
                  product_id: "",
                  quantity: 1,
                  unit_price: "",
                  cost: 0,
                })
              }
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
            >
              <Plus className="size-4" />
              {t("vouchers.create.lines.add", "行を追加")}
            </button>
          </div>

          {/* Lines grid */}
          <div className="space-y-3">
            {fields.map((f, idx) => {
              const cost = watch(`records.${idx}.cost`);

              return (
                <div
                  key={f.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                >
                  {/* Product */}
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("vouchers.create.lines.product", "商品")}
                    </label>
                    {(() => {
                      const productReg = register(
                        `records.${idx}.product_id`
                      );
                      return (
                        <select
                          {...productReg}
                          onChange={(e) => {
                            // RHF update
                            productReg.onChange(e);

                            // Derive unit from product and recalc cost
                            const prod = products.find(
                              (p) =>
                                String(p.id) === String(e.target.value)
                            );
                            const unit = Number(prod?.price ?? 0);
                            setValue(
                              `records.${idx}.unit_price`,
                              unit,
                              { shouldDirty: true, shouldValidate: true }
                            );
                            const qty = Number(
                              getValues(`records.${idx}.quantity`) ?? 0
                            );
                            setValue(
                              `records.${idx}.cost`,
                              qty * unit,
                              { shouldDirty: true, shouldValidate: true }
                            );
                          }}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 
                                     text-gray-900 dark:text-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">
                            {t(
                              "vouchers.create.lines.selectProduct",
                              "商品を選択"
                            )}
                          </option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.product_name} — ¥{fmt(p.price)}
                            </option>
                          ))}
                        </select>
                      );
                    })()}
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("vouchers.create.lines.qty", "数量")}
                    </label>
                    {(() => {
                      const qtyReg = register(
                        `records.${idx}.quantity`,
                        { valueAsNumber: true }
                      );
                      return (
                        <input
                          type="number"
                          min={1}
                          step={1}
                          {...qtyReg}
                          onChange={(e) => {
                            qtyReg.onChange(e);
                            const qty = Number(e.target.value ?? 0);
                            const unit = Number(
                              getValues(`records.${idx}.unit_price`) ?? 0
                            );
                            setValue(
                              `records.${idx}.cost`,
                              qty * unit,
                              { shouldDirty: true, shouldValidate: true }
                            );
                          }}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 
                                     text-gray-900 dark:text-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      );
                    })()}
                  </div>

                  {/* Unit price (editable) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("vouchers.create.lines.unitPrice", "単価")}
                    </label>
                    {(() => {
                      const unitReg = register(
                        `records.${idx}.unit_price`,
                        { valueAsNumber: true }
                      );
                      return (
                        <input
                          type="number"
                          step="1"
                          {...unitReg}
                          onChange={(e) => {
                            unitReg.onChange(e);
                            const unit = Number(e.target.value ?? 0);
                            const qty = Number(
                              getValues(`records.${idx}.quantity`) ?? 0
                            );
                            setValue(
                              `records.${idx}.cost`,
                              qty * unit,
                              { shouldDirty: true, shouldValidate: true }
                            );
                          }}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 
                                     text-gray-900 dark:text-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      );
                    })()}
                  </div>

                  {/* Cost (qty * unit) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("vouchers.create.lines.cost", "金額")}
                    </label>
                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2">
                      <BadgeJapaneseYenIcon className="size-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        ¥{fmt(cost)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <div className="sm:col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      title={t("vouchers.create.lines.remove", "削除")}
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <BadgeJapaneseYenIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("vouchers.create.totals.total", "合計")}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  ¥{fmt(totals.total)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <BadgeJapaneseYenIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("vouchers.create.totals.tax", "税 (7%)")}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  ¥{fmt(totals.tax)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <BadgeJapaneseYenIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("vouchers.create.totals.net", "税込合計")}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  ¥{fmt(totals.net)}
                </p>
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("confirm", {
                  required: t(
                    "vouchers.create.errors.confirmRequired",
                    "作成前に確認にチェックしてください"
                  ),
                })}
                className="size-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t(
                  "vouchers.create.labels.confirm",
                  "この伝票を作成することを確認します"
                )}
              </span>
            </label>
            {errors.confirm && (
              <p className="text-sm text-red-500">{errors.confirm.message}</p>
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("goback")}
                className="size-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t(
                  "vouchers.create.labels.goBackAfterSave",
                  "保存後に伝票一覧へ戻る"
                )}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() =>
                reset({
                  voucher_id: "",
                  customer_name: "",
                  customer_email: "",
                  sale_date: new Date().toISOString().slice(0, 10),
                  records: [
                    { product_id: "", quantity: 1, unit_price: "", cost: 0 },
                  ],
                  confirm: false,
                  goback: false,
                })
              }
              className="w-full sm:w-auto rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 
                         text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {t("vouchers.create.actions.reset", "リセット")}
            </button>
            <button
              type="submit"
              disabled={!confirmed || isSubmitting}
              className="w-full sm:w-auto rounded-lg bg-blue-600 text-white px-4 py-2 
                         hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isSubmitting
                ? t("vouchers.create.actions.creating", "作成中…")
                : t("vouchers.create.actions.create", "伝票を作成")}
            </button>
          </div>
        </form>
      </div>

      {/* Back (desktop) */}
      <Link
        href="/dashboard/vouchers"
        className="mt-5 hidden sm:inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium 
                   text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 
                   transition active:scale-95"
      >
        <ArrowLeft className="size-4" />
        <span>{t("vouchers.create.backToVouchers", "バウチャーに戻る")}</span>
      </Link>
    </section>
  );
}
