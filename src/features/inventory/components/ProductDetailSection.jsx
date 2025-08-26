"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProduct } from "@/services/product";
import {
  AlertTriangle,
  RotateCcw,
  Tag,
  DollarSign,
  Calendar,
  Clock,
  Pencil,
} from "lucide-react";
import ProductDetailSkeleton from "./ProductDetailSkeleton";

const ProductDetailSection = () => {
  const { id } = useParams();
  // Use SWR-style hook to fetch a single product
  const { data: product, error, isLoading, mutate } = getProduct(id);

  // Loading state → skeleton
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  // Error state → alert card with retry
  if (error) {
    return (
      <section className="px-0 lg:px-20 rounded-xl bg-[--color-card] text-[--color-fg] border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="size-5 text-red-500 mt-0.5"
            aria-hidden="true"
          />
          <div className="flex-1">
            <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
              Failed to load product
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {error?.message || "Please check your connection and try again."}
            </p>
            <div className="mt-4">
              <button
                onClick={() => mutate && mutate()}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 active:scale-[.99] transition"
              >
                <RotateCcw className="size-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Prepare friendly date strings
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

  // Success state → creative card layout
  return (
    <section className="">
      <h3 className="text-gray-900 text-xl dark:text-gray-100 font-bold mb-5">
        Product Detail
      </h3>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-10 space-y-6 mx-auto max-w-[100%] sm:max-w-[70%] lg:max-w-[60%]">
        {/* Top row: ID badge, product name, and edit button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
            <Tag className="w-4 h-4" />
            ID: {product?.data?.id ?? id}
          </span>

          <h4 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex-1">
            {productName}
          </h4>

          <Link
            href={`/dashboard/inventory/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-amber-500 text-white hover:bg-amber-600 active:scale-[.98] transition"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
        </div>

        {/* Price prominently displayed */}
        <div className="flex items-center gap-2 text-xl font-bold text-green-600 dark:text-green-400">
          <DollarSign className="w-5 h-5" />
          <span>{price}</span>
        </div>

        {/* Metadata cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Created at */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Created at
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {createdAt}
              </p>
            </div>
          </div>
          {/* Updated at */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Updated at
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {updatedAt}
              </p>
            </div>
          </div>
          {/* Duplicate price card for small screens */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 md:hidden">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {price}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailSection;
