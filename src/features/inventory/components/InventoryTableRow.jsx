"use client";
import React from "react";
import { Pencil, Trash, Info } from "lucide-react";
import Link from "next/link";
import { confirmDialog } from "primereact/confirmdialog"; // For confirmDialog method
import { destroyProduct, productApiUrl } from "@/services/product";
import { toast } from "sonner";
import { mutate, useSWRConfig } from "swr";

const InventoryTableRow = ({ product: { id, product_name, price } }) => {
  const { mutate } = useSWRConfig();
  const handleDelete = () => {
    confirmDialog({
      message: `Are you sure you want to delete "${product_name}"?`,
      header: "Confirm Delete",
      acceptLabel: "Yes, Delete",
      rejectLabel: "Cancel",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const res = await destroyProduct(id);
          const result = await res.json();
          if (!res.ok) {
            throw new Error(result.message || "Fail to delete");
          }
          toast.success(result.message);
        } catch (err) {
          toast.error(err.message);
        }
        mutate(productApiUrl);
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
            aria-label={`View details for ${product_name}`}
            title="View details"
          >
            <Info className="size-8 active:scale-90 border active:opacity-90 duration-200 dark:border-gray-700 p-1 border-gray-300 rounded dark:hover:bg-gray-700  hover:bg-gray-200 text-blue-600 dark:text-blue-400 hover:underline" />
          </Link>
          {/* Edit product */}
          <Link
            href={`/dashboard/inventory/${id}/edit`}
            aria-label={`Edit ${product_name}`}
            title="Edit"
          >
            <Pencil className="size-8 active:scale-90 border active:opacity-90 duration-200 dark:border-gray-700 p-1 border-gray-300 rounded dark:hover:bg-gray-700 hover:bg-gray-200 text-bl text-green-600 dark:text-green-400 hover:underline" />
          </Link>
          {/* Delete product */}
          <button onClick={handleDelete} title="Delete">
            <Trash className="size-8 active:scale-90 border active:opacity-90 duration-200 dark:border-gray-700 p-1 border-gray-300 rounded dark:hover:bg-gray-700 hover:bg-gray-200 text-bl text-red-600 dark:text-red-400 hover:underline" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default InventoryTableRow;
