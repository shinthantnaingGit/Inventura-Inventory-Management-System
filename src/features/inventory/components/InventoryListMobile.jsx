"use client";
import React from "react";
import Link from "next/link";
import { Tag, CircleDollarSign, Info, Pencil, Trash } from "lucide-react";
import { confirmDialog } from "primereact/confirmdialog";
import { destroyProduct, productApiUrl } from "@/services/product";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

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

  const handleDelete = (id, name) => {
    confirmDialog({
      message: `Are you sure you want to delete "${name}"?`,
      header: "Confirm Delete",
      acceptLabel: "Yes, Delete",
      rejectLabel: "Cancel",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const res = await destroyProduct(id);
          const result = await res.json();
          if (!res.ok) throw new Error(result?.message || "Fail to delete");
          toast.success(result?.message || "Deleted");
        } catch (err) {
          toast.error(err.message || "Something went wrong");
        }
        mutate(productApiUrl);
      },
    });
  };

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          No products yet
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Create your first product or import a CSV to get started.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/inventory/create"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            ＋ Create Product
          </Link>
          <button
            type="button"
            onClick={() => alert("Hook up CSV import handler")}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Import CSV
          </button>
        </div>
      </div>
    );
  }

  return (
    <ul role="list" className="space-y-3">
      {products.map((p) => (
        <li
          key={p.id}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-4"
        >
          {/* Top line: ID badge + name */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-200">
                <Tag className="size-3.5" />
                ID: {p.id}
              </span>
            </div>
          </div>

          {/* Name */}
          <h4 className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            {p.product_name}
          </h4>

          {/* Price */}
          <div className="mt-1 flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
            <CircleDollarSign className="size-4" />
            <span>¥{p.price}</span>
          </div>

          {/* Actions */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Link
              href={`/dashboard/inventory/${p.id}`}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={`View ${p.product_name}`}
              title="View"
            >
              <Info className="size-4 text-blue-600 dark:text-blue-400" />
              <span>View</span>
            </Link>

            <Link
              href={`/dashboard/inventory/${p.id}/edit`}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={`Edit ${p.product_name}`}
              title="Edit"
            >
              <Pencil className="size-4 text-green-600 dark:text-green-400" />
              <span>Edit</span>
            </Link>

            <button
              onClick={() => handleDelete(p.id, p.product_name)}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={`Delete ${p.product_name}`}
              title="Delete"
            >
              <Trash className="size-4 text-red-600 dark:text-red-400" />
              <span>Delete</span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
