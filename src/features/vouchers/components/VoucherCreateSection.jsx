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
import { fetchProducts, productApiUrl } from "@/services/product";
import { useI18n } from "@/i18n/I18nProvider";
import useSWR from "swr";

// ============================================
// HELPER FUNCTIONS
// ============================================

// Format numbers with thousand separators (e.g., 1000 → 1,000)
const fmt = (n) =>
  isNaN(n) ? "-" : new Intl.NumberFormat().format(Math.round(n));

// Generate unique voucher ID based on current date + random number
// Format: INV-YYYYMMDD-XXXX (e.g., INV-20241218-1234)
const makeVoucherId = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
  return `INV-${y}${m}${day}-${rand}`;
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function VoucherCreateSection() {
  // ============================================
  // HOOKS & DATA FETCHING
  // ============================================
  
  const router = useRouter(); // For navigation after form submission
  const { t } = useI18n(); // For internationalization (i18n)

  // Fetch products list from API using SWR for caching & revalidation
  const {
    data: productsResp,
    isLoading: productsLoading,
    error: productsError,
  } = useSWR(`${productApiUrl}?limit=100`, fetchProducts);
  
  // Extract products array from response, default to empty array if no data
  const products = productsResp?.data ?? [];

  // ============================================
  // FORM SETUP WITH REACT HOOK FORM
  // ============================================
  
  const {
    register,        // Register input fields
    handleSubmit,    // Handle form submission
    control,         // Control for field arrays and watching
    setValue,        // Programmatically set field values
    watch,          // Watch specific fields for changes
    getValues,      // Get current form values
    reset,          // Reset form to default values
    formState: { errors, isSubmitting }, // Form state and validation errors
  } = useForm({
    // Initial form values
    defaultValues: {
      voucher_id: makeVoucherId(), // Auto-generate voucher ID
      customer_name: "",
      customer_email: "",
      sale_date: new Date().toISOString().slice(0, 10), // Today's date in YYYY-MM-DD format
      records: [
        {
          product_id: "",
          quantity: 1,
          unit_price: "",
          cost: 0,
        },
      ],
      confirm: false, // Confirmation checkbox
    },
  });

  // Handle dynamic array of product line items
  const { fields, append, remove } = useFieldArray({
    name: "records",
    control,
  });

  // Watch all records for real-time calculation updates
  const recordsWatch = useWatch({ control, name: "records" });

  // Tax configuration (7% Japanese consumption tax)
  const taxRate = 0.07;

  // ============================================
  // COMPUTED VALUES (TOTALS)
  // ============================================
  
  // Calculate totals whenever records change (reactive computation)
  const totals = useMemo(() => {
    // Sum all line item costs
    const total =
      recordsWatch?.reduce((sum, r) => sum + Number(r?.cost ?? 0), 0) || 0;
    // Calculate tax amount
    const tax = total * taxRate;
    // Calculate final total including tax
    const net = total + tax;
    return { total, tax, net };
  }, [recordsWatch]); // Recalculate when records change

  // Watch confirmation checkbox state
  const confirmed = watch("confirm");

  // ============================================
  // PRODUCT SELECTION HANDLER
  // ============================================
  
  // Check if product already exists in records and update quantity
  const handleProductSelection = (productId, currentIndex) => {
    if (!productId) return;
    
    const currentRecords = getValues("records");
    
    // Find if this product already exists in another row
    const existingIndex = currentRecords.findIndex((r, idx) => 
      idx !== currentIndex && String(r.product_id) === String(productId)
    );
    
    if (existingIndex !== -1) {
      // Product already exists - add quantities together
      const existingQty = Number(currentRecords[existingIndex].quantity || 0);
      const currentQty = Number(currentRecords[currentIndex].quantity || 1);
      const newQty = existingQty + currentQty;
      
      // Update existing row with combined quantity
      const unitPrice = Number(currentRecords[existingIndex].unit_price || 0);
      setValue(`records.${existingIndex}.quantity`, newQty);
      setValue(`records.${existingIndex}.cost`, newQty * unitPrice);
      
      // Remove current duplicate row
      remove(currentIndex);
      
      // Show notification to user
      toast.info(t("vouchers.create.toast.productCombined", "同じ商品の数量を合計しました"));
      return true; // Indicate that product was combined
    }
    
    return false; // Product was not a duplicate
  };

  // ============================================
  // FORM SUBMISSION
  // ============================================
  
  const onSubmit = async () => {
    try {
      // Get all current form values
      const values = getValues();

      // Transform records to match API format
      // Filter out empty records and format properly
      const items = (values.records || [])
        .filter((r) => r.product_id && Number(r.quantity) > 0) // Only include valid items
        .map((r) => {
          // Find full product details from products list
          const prod = products.find(
            (p) => String(p.id) === String(r.product_id)
          );
          
          return {
            product_id: Number(r.product_id),
            // Include nested product object as required by API
            product: prod
              ? {
                  id: prod.id,
                  product_name: prod.product_name,
                  price: Number(prod.price),
                  created_at: prod.created_at ?? undefined,
                }
              : undefined,
            quantity: String(r.quantity), // API expects string for quantity
            cost: Number(r.cost || 0),
            created_at: new Date().toISOString(), // Current timestamp
          };
        });

      // Calculate final totals for submission
      const total = items.reduce((s, r) => s + (r.cost || 0), 0);
      const tax = +(total * taxRate).toFixed(2); // Round to 2 decimal places
      const net_total = +(total + tax).toFixed(2);

      // Ensure voucher_id is not empty (use auto-generated if needed)
      const voucher_id = (values.voucher_id || "").trim() || makeVoucherId();

      // Prepare final payload for API
      const payload = {
        voucher_id,
        customer_name: values.customer_name,
        customer_email: values.customer_email || undefined, // Optional field
        sale_date: values.sale_date,
        records: items,
        total,
        tax,
        net_total,
        // Note: Don't send 'id' - backend will generate it
      };

      // Send to API
      const res = await storeVoucher(payload);
      const result = (await res.json?.()) ?? res;

      // Handle API errors
      if (!res?.ok) {
        console.error("Voucher create error:", result);
        throw new Error(
          result?.message ||
            result?.errors?.[0] ||
            t("vouchers.create.toast.failCreate", "伝票の作成に失敗しました")
        );
      }

      // Success - show notification
      toast.success(t("vouchers.create.toast.success", "伝票を作成しました"));

      // Navigate to new voucher or vouchers list
      const newId = result?.data?.id ?? result?.id;
      if (newId) {
        router.push(`/dashboard/vouchers/${newId}`);
      } else {
        router.push("/dashboard/vouchers");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        t("vouchers.create.toast.genericError", "エラーが発生しました")
      );
    }
  };

  // ============================================
  // RENDER UI
  // ============================================
  
  return (
    <section className="mx-auto max-w-full sm:max-w-[80%] lg:max-w-[60%] px-4 sm:px-5 pb-24 sm:pb-6">
      {/* Mobile-only back button (hidden on desktop) */}
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

      {/* Page title */}
      <h3 className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-4">
        {t("vouchers.create.title", "伝票を作成")}
      </h3>

      {/* Main form container */}
      <div className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* ============================================ */}
          {/* BASIC INFO SECTION - 2 column grid on desktop */}
          {/* ============================================ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Voucher ID field */}
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

            {/* Sale date field with calendar icon */}
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
                <Calendar className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
              </div>
            </div>

            {/* Customer name field (required) */}
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
              {/* Show validation error if exists */}
              {errors.customer_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.customer_name.message}
                </p>
              )}
            </div>

            {/* Customer email field (optional) */}
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

          {/* ============================================ */}
          {/* PRODUCT LINE ITEMS SECTION */}
          {/* ============================================ */}
          
          {/* Section header with Add button */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {t("vouchers.create.lines.title", "明細")}
            </h4>
            <button
              type="button"
              onClick={() =>
                // Add new empty line item
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

          {/* Dynamic line items list */}
          <div className="space-y-3">
            {fields.map((f, idx) => {
              // Watch cost for this specific line item
              const cost = watch(`records.${idx}.cost`);

              return (
                <div
                  key={f.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                >
                  {/* Product dropdown (5 columns on desktop) */}
                  <div className="md:col-span-12">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("vouchers.create.lines.product", "商品")}
                    </label>
                    {(() => {
                      const productReg = register(`records.${idx}.product_id`);
                      return (
                        <select
                          {...productReg}
                          onChange={(e) => {
                            // Update form state
                            productReg.onChange(e);
                            
                            // Check for duplicate product
                            const isDuplicate = handleProductSelection(e.target.value, idx);
                            
                            // If not duplicate, update pricing
                            if (!isDuplicate && e.target.value) {
                              // Find selected product details
                              const prod = products.find(
                                (p) => String(p.id) === String(e.target.value)
                              );
                              const unit = Number(prod?.price ?? 0);
                              
                              // Set unit price from product
                              setValue(`records.${idx}.unit_price`, unit, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                              
                              // Calculate and set cost (quantity × unit price)
                              const qty = Number(
                                getValues(`records.${idx}.quantity`) ?? 0
                              );
                              setValue(`records.${idx}.cost`, qty * unit, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                            }
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

                  {/* Quantity input (2 columns on desktop) */}
                  <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("vouchers.create.lines.qty", "数量")}
                    </label>
                    {(() => {
                      const qtyReg = register(`records.${idx}.quantity`, {
                        valueAsNumber: true, // Automatically convert to number
                      });
                      return (
                        <input
                          type="number"
                          min={1}
                          step={1}
                          {...qtyReg}
                          onChange={(e) => {
                            // Update form state
                            qtyReg.onChange(e);
                            
                            // Recalculate cost when quantity changes
                            const qty = Number(e.target.value ?? 0);
                            const unit = Number(
                              getValues(`records.${idx}.unit_price`) ?? 0
                            );
                            setValue(`records.${idx}.cost`, qty * unit, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 
                                     text-gray-900 dark:text-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      );
                    })()}
                  </div>

                  {/* Unit price input - editable (2 columns on desktop) */}
                  <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("vouchers.create.lines.unitPrice", "単価")}
                    </label>
                    {(() => {
                      const unitReg = register(`records.${idx}.unit_price`, {
                        valueAsNumber: true,
                      });
                      return (
                        <input
                          type="number"
                          step="1"
                          {...unitReg}
                          onChange={(e) => {
                            // Update form state
                            unitReg.onChange(e);
                            
                            // Recalculate cost when unit price changes
                            const unit = Number(e.target.value ?? 0);
                            const qty = Number(
                              getValues(`records.${idx}.quantity`) ?? 0
                            );
                            setValue(`records.${idx}.cost`, qty * unit, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 
                                     text-gray-900 dark:text-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      );
                    })()}
                  </div>

                  {/* Cost display - read only (2 columns on desktop) */}
                  <div className="md:col-span-4">
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

                  {/* Delete button (1 column on desktop) */}
                  <div className="md:col-span-2 self-end flex items-end">
                    <button
                      type="button"
                      onClick={() => remove(idx)} // Remove this line item
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

          {/* ============================================ */}
          {/* TOTALS SECTION - 3 column grid */}
          {/* ============================================ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Subtotal */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <BadgeJapaneseYenIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {t("vouchers.create.totals.total", "合計")}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  ¥{fmt(totals.total)}
                </p>
              </div>
            </div>
            
            {/* Tax amount */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <BadgeJapaneseYenIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {t("vouchers.create.totals.tax", "税 (7%)")}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  ¥{fmt(totals.tax)}
                </p>
              </div>
            </div>
            
            {/* Grand total */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <BadgeJapaneseYenIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {t("vouchers.create.totals.net", "税込合計")}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  ¥{fmt(totals.net)}
                </p>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* CONFIRMATION CHECKBOX */}
          {/* ============================================ */}
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
                className="size-4 accent-blue-600 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t(
                  "vouchers.create.labels.confirm",
                  "この伝票を作成することを確認します"
                )}
              </span>
            </label>
            {/* Show error if confirmation not checked */}
            {errors.confirm && (
              <p className="text-sm text-red-500">{errors.confirm.message}</p>
            )}
          </div>

          {/* ============================================ */}
          {/* ACTION BUTTONS */}
          {/* ============================================ */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            {/* Reset button - clears all form data */}
            <button
              type="button"
              onClick={() =>
                reset({
                  voucher_id: makeVoucherId(), // Generate new ID on reset
                  customer_name: "",
                  customer_email: "",
                  sale_date: new Date().toISOString().slice(0, 10),
                  records: [
                    { product_id: "", quantity: 1, unit_price: "", cost: 0 },
                  ],
                  confirm: false,
                })
              }
              className="w-full sm:w-auto rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 
                         text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {t("vouchers.create.actions.reset", "リセット")}
            </button>
            
            {/* Submit button - disabled until confirmed */}
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

      {/* Desktop-only back button (hidden on mobile) */}
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