// services/profile.js
import useAccountStore from "@/store/useAccountStore";
import useSWR from "swr";
import { uploadImage } from "./media";

export const profileApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user-profile/show`;
export const profileBaseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user-profile`;
export const token = useAccountStore.getState().token;

// 1) GET PROFILE
export const fetchProfile = (url) => {
  const token = useAccountStore.getState().token;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
};

// 2) UPLOAD IMAGE TO MEDIA ENDPOINT (using media service)
export const uploadImageToMedia = uploadImage;

// 3) UPDATE PROFILE WITH IMAGE PATH
export const updateProfileImage = (imagePath) => {
  const formData = new URLSearchParams();
  formData.append("profile_image", imagePath);

  return fetch(`${profileBaseUrl}/change-profile-image`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
    body: formData,
  });
};

// 4) DELETE PROFILE IMAGE
export const deleteProfileImage = () => {
  const formData = new URLSearchParams();
  formData.append("profile_image", ""); // Empty string to remove image

  return fetch(`${profileBaseUrl}/change-profile-image`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
    body: formData,
  });
};

// 5) COMBINED FUNCTION: Upload image and update profile
export const storeProfileImage = async (file) => {
  try {
    // First, upload image to media endpoint
    const uploadResponse = await uploadImageToMedia(file);

    const uploadData = await uploadResponse.json();
    const imagePath =
      uploadData.path ||
      uploadData.url ||
      uploadData.image ||
      uploadData.data?.path ||
      uploadData.data?.url;

    if (!imagePath) {
      throw new Error("No image path returned from media upload");
    }

    // Then, update profile with the image path
    const profileResponse = await updateProfileImage(imagePath);

    if (!profileResponse.ok) {
      const errorData = await profileResponse.text();
      throw new Error(`Failed to update profile: ${errorData}`);
    }

    return profileResponse;
  } catch (error) {
    throw error;
  }
};

// 6) PATCH (UPDATE) CHANGE NAME
export const updateProfileName = (payload) => {
  const formData = new URLSearchParams();
  formData.append("name", payload.name);

  return fetch(`${profileBaseUrl}/change-name`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
    body: formData,
  });
};

// 7) PATCH (UPDATE) CHANGE PASSWORD
export const updatePassword = (payload) => {
  const formData = new URLSearchParams();
  formData.append("old_password", payload.old_password);
  formData.append("new_password", payload.new_password);
  formData.append(
    "new_password_confirmation",
    payload.new_password_confirmation
  );

  return fetch(`${profileBaseUrl}/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${useAccountStore.getState().token}`,
    },
    body: formData,
  });
};
