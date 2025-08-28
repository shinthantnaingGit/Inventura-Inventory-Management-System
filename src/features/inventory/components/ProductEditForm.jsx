"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { getProduct, updateProduct } from "@/services/product";

const ProductEditForm = () => {
  const router = useRouter();
  const { id } = useParams();

  // Load current product
  const {
    data: productResp,
    error,
    isLoading,
    mutate, // not used here but handy if you want a Retry button
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
      const result = (await res.json?.()) ?? res; // support either fetch Response or direct object
      if (res.ok === false) {
        throw new Error(result?.message || "Failed to update product");
      }
      toast.success(result?.message || "Product updated successfully");

      if (goBack) {
        router.push("/dashboard/inventory");
      } else {
        router.push(`/dashboard/inventory/${id}`);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  // Loading / Error minimal states (keeps it simple & consistent)
  if (isLoading) {
    return (
      <div className="mx-auto max-w-[80%] sm:max-w-[60%] lg:max-w-[40%]">
        <div className="bg-white border dark:border-gray-700 border-gray-300 dark:bg-gray-800 rounded-xl p-6">
          <div className="space-y-4 animate-pulse">
            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-5 w-56 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-8 w-full sm:w-36 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[80%] sm:max-w-[60%] lg:max-w-[40%]">
        <div className="bg-white border dark:border-gray-700 border-gray-300 dark:bg-gray-800 rounded-xl p-6">
          <p className="text-sm text-red-500">
            Failed to load product. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[80%] sm:max-w-[60%] lg:max-w-[40%]">
      <div className="bg-white border dark:border-gray-700 border-gray-300 dark:bg-gray-800 rounded-xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Product */}
          <div>
            <label
              htmlFor="product"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Product <span className="text-red-500">*</span>
            </label>
            <input
              id="product"
              type="text"
              placeholder="e.g., Data Analytics Services"
              {...register("product_name", {
                required: "Product is required",
                minLength: { value: 2, message: "Min 2 characters" },
                maxLength: { value: 80, message: "Max 80 characters" },
              })}
              aria-invalid={!!errors.product_name}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 
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
              Price <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="number"
              placeholder="e.g., 1100"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 0, message: "Cannot be negative" },
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
                required: "Please confirm to update this product",
              })}
              className="size-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I confirm to update this product
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
              Go Back To Product List After Saving
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
              Reset
            </button>
            <button
              type="submit"
              disabled={!confirmed || isSubmitting}
              className="w-full sm:w-auto rounded-lg bg-blue-600 text-white px-4 py-2 
                       hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? "Updating…" : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditForm;
