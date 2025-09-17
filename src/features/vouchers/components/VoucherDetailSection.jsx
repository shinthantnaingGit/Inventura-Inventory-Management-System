// src/features/vouchers/components/VoucherDetailSection.jsx
"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchVouchers, voucherApiUrl } from "@/services/voucher";
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
import useSWR from "swr";

const VoucherDetailSection = () => {
  const { id } = useParams();
  const router = useRouter();
  const {
    data: voucher,
    error,
    isLoading,
    mutate,
  } = useSWR(`${voucherApiUrl}/${id}`, fetchVouchers);
  const { t } = useI18n();

  if (isLoading) return <VoucherDetailSkeleton />;

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
                {t(
                  "voucherDetail.errorTitle",
                  "バウチャーの読み込みに失敗しました"
                )}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {error?.message ||
                  t(
                    "voucherDetail.errorBody",
                    "接続を確認して、もう一度お試しください。"
                  )}
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
  const createdAt = v?.created_at
    ? new Date(v.created_at).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";
  const updatedAt = v?.updated_at
    ? new Date(v.updated_at).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

  const handlePrint = () => window.print();

  return (
    <section className="mx-auto max-w-full sm:max-w-[70%] lg:max-w-[60%] print:w-full print:p-5 px-4 sm:px-5 pb-24 sm:pb-6">
      {/* PRINT PAGE SETUP */}
      <style jsx global>{`
        @page {
          size: A4;
          margin: 10mm 8mm;
        }
        @media print {
          html,
          body {
            background: white !important;
            color: #000 !important;
            font-family: Arial, sans-serif !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          /* Force light mode for print */
          .dark {
            background: white !important;
            color: #000 !important;
          }
          .dark * {
            background: white !important;
            color: #000 !important;
          }
          /* Ensure single page */
          .print-container {
            page-break-inside: avoid;
            max-height: 100vh;
            overflow: hidden;
          }
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
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
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
          <div className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {t("voucherDetail.customerName", "顧客名")}: {v?.customer_name}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {t("voucherDetail.customerEmail", "顧客メール")}:{" "}
              {v?.customer_email}
            </div>
          </div>

          {/* Lines (if provided) */}
          {Array.isArray(v?.records) && v.records.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 pr-2 text-gray-700 dark:text-gray-200">
                      {t("vouchers.create.lines.product", "商品")}
                    </th>
                    <th className="py-2 pr-2 text-right text-gray-700 dark:text-gray-200">
                      {t("vouchers.create.lines.qty", "数量")}
                    </th>
                    <th className="py-2 pr-2 text-right text-gray-700 dark:text-gray-200">
                      {t("vouchers.create.lines.unitPrice", "単価")}
                    </th>
                    <th className="py-2 pr-2 text-right text-gray-700 dark:text-gray-200">
                      {t("vouchers.create.lines.cost", "金額")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {v.records.map((r, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="py-2 pr-2 text-gray-900 dark:text-gray-100">
                        {r?.product?.product_name || "-"}
                      </td>
                      <td className="py-2 pr-2 text-right text-gray-900 dark:text-gray-100">
                        {r?.quantity}
                      </td>
                      <td className="py-2 pr-2 text-right text-gray-900 dark:text-gray-100">
                        ¥
                        {new Intl.NumberFormat().format(r?.product?.price ?? 0)}
                      </td>
                      <td className="py-2 pr-2 text-right text-gray-900 dark:text-gray-100">
                        ¥{new Intl.NumberFormat().format(r?.cost ?? 0)}
                      </td>
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
              <span className="text-gray-600 dark:text-gray-300">
                {t("voucherDetail.total", "合計")}: {v?.total}{" "}
              </span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <BadgeJapaneseYenIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-gray-600 dark:text-gray-300">
                {t("voucherDetail.tax", "税")}: {v?.tax}
              </span>
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
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  {t("voucherDetail.createdAt", "作成日時")}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {createdAt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  {t("voucherDetail.updatedAt", "更新日時")}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {updatedAt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  {t("voucherDetail.saleDate", "販売日")}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {v?.sale_date}
                </p>
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
  const { t, locale } = useI18n();

  // Language-specific content from i18n messages
  const isJapanese = locale === "ja";

  return (
    <div
      className="print-container"
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "10pt",
        lineHeight: "1.3",
        color: "#333",
        maxWidth: "210mm",
        margin: "0 auto",
        padding: "0",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Company Header */}
      <div
        style={{
          borderBottom: "2px solid #2563eb",
          paddingBottom: "8pt",
          marginBottom: "12pt",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "18pt",
                fontWeight: "bold",
                color: "#2563eb",
                margin: "0 0 3pt 0",
                letterSpacing: "0.5pt",
              }}
            >
              {t("vouchers.print.company.name")}
            </h1>
            <p
              style={{
                fontSize: "8pt",
                color: "#666",
                margin: "0",
                fontStyle: "italic",
              }}
            >
              {t("vouchers.print.company.tagline")}
            </p>
          </div>
          <div
            style={{
              textAlign: "right",
              fontSize: "8pt",
              color: "#666",
            }}
          >
            <div>{t("vouchers.print.company.address")}</div>
            <div>{t("vouchers.print.company.city")}</div>
            <div>{t("vouchers.print.company.phone")}</div>
            <div>{t("vouchers.print.company.email")}</div>
          </div>
        </div>
      </div>

      {/* Document Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "15pt",
        }}
      >
        <h2
          style={{
            fontSize: "16pt",
            fontWeight: "bold",
            color: "#1f2937",
            margin: "0 0 3pt 0",
            textTransform: "uppercase",
            letterSpacing: "1pt",
          }}
        >
          {title}
        </h2>
        <div
          style={{
            width: "40pt",
            height: "1pt",
            backgroundColor: "#2563eb",
            margin: "0 auto",
          }}
        ></div>
      </div>

      {/* Document Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15pt",
          backgroundColor: "#f8fafc",
          padding: "8pt",
          borderRadius: "3pt",
          border: "1px solid #e2e8f0",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "9pt",
              fontWeight: "bold",
              color: "#374151",
              margin: "0 0 5pt 0",
            }}
          >
            {t("vouchers.print.documentInfo")}
          </h3>
          <div style={{ fontSize: "8pt", lineHeight: "1.4" }}>
            <div>
              <strong>{t("vouchers.print.invoiceNo")}:</strong>{" "}
              {voucher.voucher_id}
            </div>
            <div>
              <strong>{t("vouchers.print.saleDate")}:</strong>{" "}
              {voucher.sale_date}
            </div>
            <div>
              <strong>{t("vouchers.print.issueDate")}:</strong>{" "}
              {new Date().toLocaleDateString(isJapanese ? "ja-JP" : "en-US")}
            </div>
          </div>
        </div>
        <div>
          <h3
            style={{
              fontSize: "9pt",
              fontWeight: "bold",
              color: "#374151",
              margin: "0 0 5pt 0",
            }}
          >
            {t("vouchers.print.billTo")}
          </h3>
          <div style={{ fontSize: "8pt", lineHeight: "1.4" }}>
            <div>
              <strong>{voucher.customer_name}</strong>
            </div>
            <div>{voucher.customer_email || "-"}</div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "8pt",
          marginBottom: "12pt",
          backgroundColor: "white",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f1f5f9" }}>
            <th
              style={{
                border: "1px solid #d1d5db",
                padding: "6pt 4pt",
                textAlign: "left",
                fontWeight: "bold",
                color: "#374151",
                fontSize: "7pt",
                textTransform: "uppercase",
                letterSpacing: "0.3pt",
              }}
            >
              {t("vouchers.print.item")}
            </th>
            <th
              style={{
                border: "1px solid #d1d5db",
                padding: "6pt 4pt",
                textAlign: "center",
                fontWeight: "bold",
                color: "#374151",
                fontSize: "7pt",
                textTransform: "uppercase",
                letterSpacing: "0.3pt",
                width: "15%",
              }}
            >
              {t("vouchers.print.qty")}
            </th>
            <th
              style={{
                border: "1px solid #d1d5db",
                padding: "6pt 4pt",
                textAlign: "right",
                fontWeight: "bold",
                color: "#374151",
                fontSize: "7pt",
                textTransform: "uppercase",
                letterSpacing: "0.3pt",
                width: "20%",
              }}
            >
              {t("vouchers.print.unitPrice")}
            </th>
            <th
              style={{
                border: "1px solid #d1d5db",
                padding: "6pt 4pt",
                textAlign: "right",
                fontWeight: "bold",
                color: "#374151",
                fontSize: "7pt",
                textTransform: "uppercase",
                letterSpacing: "0.3pt",
                width: "20%",
              }}
            >
              {t("vouchers.print.amount")}
            </th>
          </tr>
        </thead>
        <tbody>
          {(voucher.records || []).map((r, i) => (
            <tr
              key={i}
              style={{
                backgroundColor: i % 2 === 0 ? "white" : "#f9fafb",
              }}
            >
              <td
                style={{
                  border: "1px solid #d1d5db",
                  padding: "4pt 3pt",
                  verticalAlign: "top",
                }}
              >
                {r.name}
              </td>
              <td
                style={{
                  border: "1px solid #d1d5db",
                  padding: "4pt 3pt",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                {nf(r.qty)}
              </td>
              <td
                style={{
                  border: "1px solid #d1d5db",
                  padding: "4pt 3pt",
                  textAlign: "right",
                  verticalAlign: "top",
                }}
              >
                ¥{nf(r.unit)}
              </td>
              <td
                style={{
                  border: "1px solid #d1d5db",
                  padding: "4pt 3pt",
                  textAlign: "right",
                  verticalAlign: "top",
                  fontWeight: "500",
                }}
              >
                ¥{nf(r.cost)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "15pt",
        }}
      >
        <div
          style={{
            width: "250pt",
            backgroundColor: "#f8fafc",
            padding: "8pt",
            borderRadius: "3pt",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "3pt 0",
              borderBottom: "1px solid #d1d5db",
            }}
          >
            <span style={{ fontSize: "8pt", color: "#6b7280" }}>
              {t("vouchers.print.subtotal")}
            </span>
            <span style={{ fontSize: "8pt", fontWeight: "500" }}>
              ¥{nf(voucher.total)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "3pt 0",
              borderBottom: "1px solid #d1d5db",
            }}
          >
            <span style={{ fontSize: "8pt", color: "#6b7280" }}>
              {t("vouchers.print.tax")}
            </span>
            <span style={{ fontSize: "8pt", fontWeight: "500" }}>
              ¥{nf(voucher.tax)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4pt 0",
              fontSize: "10pt",
              fontWeight: "bold",
              color: "#1f2937",
              borderTop: "2px solid #2563eb",
              marginTop: "2pt",
            }}
          >
            <span>{t("vouchers.print.total")}</span>
            <span>¥{nf(voucher.net_total)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "8pt",
          marginTop: "10pt",
          fontSize: "7pt",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "4pt" }}>
          <strong style={{ color: "#374151" }}>
            {t("vouchers.print.thankYou")}
          </strong>
        </div>
        <div style={{ lineHeight: "1.3" }}>
          <div>{t("vouchers.print.paymentTerms")}</div>
          <div>{t("vouchers.print.contact")}</div>
          <div style={{ marginTop: "4pt", fontSize: "6pt" }}>
            {t("vouchers.print.generated").replace(
              "{date}",
              new Date().toLocaleString(isJapanese ? "ja-JP" : "en-US")
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
