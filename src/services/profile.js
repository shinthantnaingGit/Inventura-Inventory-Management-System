// services/profile.js
import useAccountStore from "@/store/useAccountStore";
import useSWR from "swr";

export const profileApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user-profile`;
export const token = useAccountStore.getState().token;
export const fetcher = (url) =>
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
  }).then((res) => res.json());

// 1) GET PROFILE
export const getProfile = () => {
  return useSWR(`${profileApiUrl}/profile`, fetcher);
};

// 2) POST (CREATE) ADD PROFILE IMAGE  <-- use FormData
export const storeProfileImage = (file) => {
  const fd = new FormData();
  // 👇 match your backend’s field name (commonly "profile_image" or "image")
  fd.append("profile_image", file);

  return fetch(`${profileApiUrl}/change-profile-image`, {
    method: "POST",
    headers: {
      // ❌ don't set Content-Type for FormData; browser will set boundary
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
    body: fd,
  });
};

// 3) PATCH (UPDATE) CHANGE NAME  <-- remove trailing space + send JSON object
export const updateProfileName = (payload) => {
  return fetch(`${profileApiUrl}/change-name`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
    body: JSON.stringify(payload), // e.g. { name: "New Name" }
  });
};

// 4) PATCH (UPDATE) CHANGE PASSWORD (unchanged)
export const updatePassword = (payload) => {
  return fetch(`${profileApiUrl}/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
    body: JSON.stringify(payload),
  });
};
