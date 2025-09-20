// services/media.js
import useAccountStore from "@/store/useAccountStore";

const mediaApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/media`;

// 1) UPLOAD IMAGE TO MEDIA ENDPOINT
export const uploadImage = async (file) => {
  const fd = new FormData();
  fd.append("image", file);

  const token = useAccountStore.getState().token;

  const response = await fetch(mediaApiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: fd,
  });

  // If not successful, get error details
  if (!response.ok) {
    let errorMessage = `Upload failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // If we can't parse JSON, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response;
};

// 2) DELETE IMAGE FROM MEDIA ENDPOINT
export const deleteImage = (imagePath) => {
  const token = useAccountStore.getState().token;
  return fetch(`${mediaApiUrl}/${imagePath}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 3) GET IMAGE URL (helper function)
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Otherwise, construct the full URL
  return `${process.env.NEXT_PUBLIC_API_URL}/${imagePath}`;
};
