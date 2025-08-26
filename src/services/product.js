import useSWR from "swr";
import { token } from "./profile";
import useAccountStore from "@/store/useAccountStore";

export const productApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products`;
export const fetcher = (url) =>
  fetch(url, {
    method: "GET",
    headers: {
      // Authorization : `Bearer ${token}`,
      //FIX CACHING ISSUE
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
  }).then((res) => res.json()); // Reusable fetcher

// 1) GET (READ) Products
export const getProducts = (url) => {
  return useSWR(url, fetcher); // Use SWR for fetching
};

// 2) POST (CREATE) Product
export const storeProduct = (payLoad) => {
  return fetch(productApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
    body: JSON.stringify(payLoad),
  });
};

// 3) GET (READ) One Product
export const getProduct = (id) => {
  return useSWR(`${productApiUrl}/${id}`, fetcher);
};

// 4) DELETE (DELETE) One Product
export const destroyProduct = (id) => {
  return fetch(`${productApiUrl}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
  });
};

// 5) PUT (UPDATE) One Product
export const updateProduct = (id, payLoad) => {
  return fetch(`${productApiUrl}/${id}`, {
    method: "PUT", // or PATCH if your backend supports partial updates
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
    body: JSON.stringify(payLoad),
  });
};
