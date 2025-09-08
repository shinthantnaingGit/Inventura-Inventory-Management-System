import useAccountStore from "@/store/useAccountStore";

export const token = useAccountStore.getState().token;

import useSWR from "swr";

export const profileApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user-profile/profile`;
export const fetcher = (url) =>
  fetch(url, {
    method: "GET",
    headers: {
      // Authorization : `Bearer ${token}`,
      //FIX CACHING ISSUE
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
  }).then((res) => res.json()); // Reusable fetcher

// 1) GET (READ) profiles
export const getProfiles = (url) => {
  return useSWR(url, fetcher); // Use SWR for fetching
};

// 2) POST (CREATE) profile
export const storeProfile = (payLoad) => {
  return fetch(profileApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
    body: JSON.stringify(payLoad),
  });
};

// 3) GET (READ) One profile
export const getProfile = (id) => {
  return useSWR(`${profileApiUrl}/${id}`, fetcher);
};

// 4) DELETE (DELETE) One profile
export const destroyProfile = (id) => {
  return fetch(`${profileApiUrl}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
  });
};

// 5) PUT (UPDATE) One profile
export const updateProfile = (id, payLoad) => {
  return fetch(`${profileApiUrl}/${id}`, {
    method: "PUT", // or PATCH if your backend supports partial updates
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
    body: JSON.stringify(payLoad),
  });
};
