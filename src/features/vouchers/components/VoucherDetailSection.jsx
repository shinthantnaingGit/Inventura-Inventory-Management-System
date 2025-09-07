// src/features/vouchers/components/VoucherDetailSection.jsx
"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getVoucher } from "@/services/voucher";
import {
  AlertTriangle,
  RotateCcw,
  Tag,
  Calendar,
  Clock,
  ArrowLeft,
  BadgeJapaneseYenIcon,
  User,
  Mail,
  Printer,
} from "lucide-react";
import VoucherDetailSkeleton from "./VoucherDetailSkeleton";
import { useI18n } from "@/i18n/I18nProvider";

const VoucherDetailSection = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: voucher, error, isLoading, mutate } = getVoucher(id);
  const { t } = useI18n();

  if (isLoading) return <VoucherDetailSkeleton />;

  if (error) {
    return (
      <section className="mx-auto max-w-full sm:max-w-[70%] lg:max-w-[60%] px-4 sm:px-5 pb-24 sm:pb-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-red-500 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
                {t("voucherDetail.errorTitle", "バウチャーの読み込みに失敗しました")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {error?.message || t("voucherDetail.errorBody", "接続を確認して、もう一度お試しください。")}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => mutate && mutate()}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 active:scale-[.99] transition"
                >
                  <RotateCcw className="size-4" />
                  {t("voucherDetail.retry", "再試行")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const v = voucher?.data;
  const createdAt = v?.created_at ? new Date(v.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "-";
  const updatedAt = v?.updated_at ? new Date(v.updated_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "-";

  const handlePrint = () => window.print();

  return (
    <section className="mx-auto max-w-full sm:max-w-[70%] lg:max-w-[60%] print:w-full print:p-5 px-4 sm:px-5 pb-24 sm:pb-6">
      {/* PRINT PAGE SETUP */}
      <style jsx global>{`
        @page { size: A4; margin: 12mm; }
        @media print {
          html, body { background: white !important; }
        }
      `}</style>

      {/* Screen UI */}
      <div className="print:hidden">
        {/* Back (mobile) */}
        <button
          type="button"
          onClick={() => router.push("/dashboard/vouchers")}
          className="mb-4 sm:hidden inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition active:scale-95"
        >
          <ArrowLeft className="size-4" />
          <span>{t("voucherDetail.backToVouchers", "バウチャーに戻る")}</span>
        </button>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 dark:text-gray-100 text-xl font-bold">
            {t("voucherDetail.title", "バウチャー詳細")}
          </h3>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            title={t("common.print", "印刷")}
          >
            <Printer className="size-4" />
            {t("common.print", "印刷")}
          </button>
        </div>

        <div className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-10 shadow-sm">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
              <Tag className="w-4 h-4" />
              {t("voucherDetail.idBadge", "ID")}: {v?.id ?? id}
            </span>

            <h4 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex-1">
              {v?.voucher_id}
            </h4>
          </div>

          {/* Customer Info */}
          <div className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {t("voucherDetail.customerName", "顧客名")}: {v?.customer_name}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {t("voucherDetail.customerEmail", "顧客メール")}: {v?.customer_email}
            </div>
          </div>

          {/* Lines (if provided) */}
          {Array.isArray(v?.records) && v.records.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 pr-2">{t("vouchers.create.lines.product", "商品")}</th>
                    <th className="py-2 pr-2 text-right">{t("vouchers.create.lines.qty", "数量")}</th>
                    <th className="py-2 pr-2 text-right">{t("vouchers.create.lines.unitPrice", "単価")}</th>
                    <th className="py-2 pr-2 text-right">{t("vouchers.create.lines.cost", "金額")}</th>
                  </tr>
                </thead>
                <tbody>
                  {v.records.map((r, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 pr-2">{r?.product?.product_name || "-"}</td>
                      <td className="py-2 pr-2 text-right">{r?.quantity}</td>
                      <td className="py-2 pr-2 text-right">¥{new Intl.NumberFormat().format(r?.product?.price ?? 0)}</td>
                      <td className="py-2 pr-2 text-right">¥{new Intl.NumberFormat().format(r?.cost ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Totals */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 font-medium">
              <BadgeJapaneseYenIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
              {t("voucherDetail.total", "合計")}: {v?.total}
            </div>
            <div className="flex items-center gap-2 font-medium">
              <BadgeJapaneseYenIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              {t("voucherDetail.tax", "税")}: {v?.tax}
            </div>
            <div className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400">
              <BadgeJapaneseYenIcon className="w-4 h-4" />
              {t("voucherDetail.netTotal", "税込合計")}: {v?.net_total}
            </div>
          </div>

          {/* Meta grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("voucherDetail.createdAt", "作成日時")}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{createdAt}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("voucherDetail.updatedAt", "更新日時")}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{updatedAt}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("voucherDetail.saleDate", "販売日")}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{v?.sale_date}</p>
              </div>
            </div>
          </div>

          {/* Back (desktop) */}
          <button
            type="button"
            onClick={() => router.push("/dashboard/vouchers")}
            className="mt-5 hidden sm:inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition active:scale-95"
          >
            <ArrowLeft className="size-4" />
            <span>{t("voucherDetail.backToVouchers", "バウチャーに戻る")}</span>
          </button>
        </div>
      </div>

      {/* PRINT-ONLY LAYOUT */}
      <div className="hidden print:block">
        <InvoiceA4
          title={t("vouchers.print.title", "納品書 / 請求書")}
          voucher={{
            voucher_id: v?.voucher_id,
            sale_date: v?.sale_date,
            customer_name: v?.customer_name,
            customer_email: v?.customer_email,
            records: (v?.records || []).map((r) => ({
              name: r?.product?.product_name || "-",
              qty: r?.quantity,
              unit: r?.product?.price,
              cost: r?.cost,
            })),
            total: v?.total,
            tax: v?.tax,
            net_total: v?.net_total,
          }}
        />
      </div>
    </section>
  );
};

export default VoucherDetailSection;

function InvoiceA4({ title, voucher }) {
  const nf = (n) => (isNaN(n) ? "-" : new Intl.NumberFormat().format(n));
  return (
    <div className="">
      <h1 style={{ fontSize: "18pt", fontWeight: 700, marginBottom: "8pt" }}>{title}</h1>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10pt" }}>
        <div>
          <div><strong>No:</strong> {voucher.voucher_id}</div>
          <div><strong>Date:</strong> {voucher.sale_date}</div>
        </div>
        <div>
          <div><strong>Customer:</strong> {voucher.customer_name}</div>
          <div><strong>Email:</strong> {voucher.customer_email || "-"}</div>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10pt" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #888", textAlign: "left", padding: "6pt" }}>Item</th>
            <th style={{ borderBottom: "1px solid #888", textAlign: "right", padding: "6pt" }}>Qty</th>
            <th style={{ borderBottom: "1px solid #888", textAlign: "right", padding: "6pt" }}>Unit</th>
            <th style={{ borderBottom: "1px solid #888", textAlign: "right", padding: "6pt" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {(voucher.records || []).map((r, i) => (
            <tr key={i}>
              <td style={{ borderBottom: "1px solid #eee", padding: "6pt" }}>{r.name}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: "6pt", textAlign: "right" }}>{nf(r.qty)}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: "6pt", textAlign: "right" }}>¥{nf(r.unit)}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: "6pt", textAlign: "right" }}>¥{nf(r.cost)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "10pt", display: "grid", gridTemplateColumns: "1fr 200pt", gap: "8pt" }}>
        <div />
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4pt 0" }}>
            <span>Total</span><strong>¥{nf(voucher.total)}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4pt 0" }}>
            <span>Tax (7%)</span><strong>¥{nf(voucher.tax)}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6pt 0", borderTop: "1px solid #888", marginTop: "4pt" }}>
            <span>Net Total</span><strong>¥{nf(voucher.net_total)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
