import useSWR from "swr";
import { token } from "./profile";
import useAccountStore from "@/store/useAccountStore";

export const voucherApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/vouchers`;
export const fetcher = (url) =>
  fetch(url, {
    method: "GET",
    headers: {
      // Authorization : `Bearer ${token}`,
      //FIX CACHING ISSUE
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
  }).then((res) => res.json()); // Reusable fetcher

// 1) GET (READ) Vouchers
export const getVouchers = (url) => {
  return useSWR(url, fetcher); // Use SWR for fetching
};

// 2) POST (CREATE) Voucher
export const storeVoucher = (payLoad) => {
  return fetch(voucherApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
    body: JSON.stringify(payLoad),
  });
};

// 3) GET (READ) One Voucher
export const getVoucher = (id) => {
  return useSWR(`${voucherApiUrl}/${id}`, fetcher);
};

// 4) DELETE (DELETE) One Voucher
export const destroyVoucher = (id) => {
  return fetch(`${voucherApiUrl}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
  });
};

// 5) PUT (UPDATE) One Voucher
export const updateVoucher = (id, payLoad) => {
  return fetch(`${voucherApiUrl}/${id}`, {
    method: "PUT", // or PATCH if your backend supports partial updates
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
    body: JSON.stringify(payLoad),
  });
};
