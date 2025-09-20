import { useState } from "react";
import useSWR from "swr";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import useAccountStore from "@/store/useAccountStore";
import {
  fetchProfile,
  profileApiUrl,
  updateProfileName,
  storeProfileImage,
  deleteProfileImage,
  updatePassword,
} from "@/services/profile";

export function useProfileHook() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { logOut } = useAccountStore();
  const { mutate: globalMutate } = useSWRConfig();

  // Profile data fetching
  const {
    data: profileData,
    isLoading,
    error,
    mutate,
  } = useSWR(profileApiUrl, fetchProfile);

  // Local state for UI interactions
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Initialize edit form when profile data changes
  const initializeEditForm = () => {
    if (profileData?.data?.name) {
      setEditForm({ name: profileData.data.name });
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString(
      locale === "ja" ? "ja-JP" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Tokyo",
      }
    );
  };

  // Profile name update
  const handleUpdateName = async () => {
    if (!editForm.name.trim()) {
      toast.error(t("profile.messages.nameRequired", "名前は必須です"));
      return;
    }

    try {
      setIsUpdating(true);
      const res = await updateProfileName({ name: editForm.name });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(
          err || t("profile.messages.updateFailed", "名前の更新に失敗しました")
        );
      }

      toast.success(t("profile.messages.nameUpdated", "名前を更新しました"));
      setIsEditing(false);

      // Refresh profile data
      await mutate();
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error(
        error.message ||
          t("profile.messages.updateError", "名前の更新に失敗しました")
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Profile image upload
  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(
        t(
          "profile.messages.invalidImageType",
          "Please select a valid image file"
        )
      );
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        t(
          "profile.messages.imageTooLarge",
          "画像サイズは5MB未満である必要があります"
        )
      );
      return;
    }

    try {
      setIsUploading(true);
      const res = await storeProfileImage(file);

      if (!res.ok) {
        const err = await res.text();
        throw new Error(
          err ||
            t(
              "profile.messages.uploadFailed",
              "画像のアップロードに失敗しました"
            )
        );
      }

      toast.success(
        t("profile.messages.imageUpdated", "プロフィール画像を更新しました")
      );

      // Refresh profile data
      await mutate();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        error.message ||
          t("profile.messages.uploadError", "画像のアップロードに失敗しました")
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Profile image delete
  const handleImageDelete = async () => {
    try {
      setIsUploading(true);
      const res = await deleteProfileImage();

      if (!res.ok) {
        const err = await res.text();
        throw new Error(
          err || t("profile.messages.deleteFailed", "画像の削除に失敗しました")
        );
      }

      toast.success(
        t("profile.messages.imageDeleted", "プロフィール画像を削除しました")
      );

      // Refresh profile data
      await mutate();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error(
        error.message ||
          t("profile.messages.deleteError", "画像の削除に失敗しました")
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Password change
  const handlePasswordChange = async () => {
    setPasswordMessage("");
    setIsSubmittingPassword(true);

    // Validate passwords match
    if (passwords.new_password !== passwords.new_password_confirmation) {
      setPasswordMessage(
        t(
          "profile.passwordModal.messages.passwordMismatch",
          "Passwords do not match"
        )
      );
      setIsSubmittingPassword(false);
      return;
    }

    try {
      const res = await updatePassword({
        old_password: passwords.old_password,
        new_password: passwords.new_password,
        new_password_confirmation: passwords.new_password_confirmation,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data?.message ||
            t(
              "profile.passwordModal.toasts.failedToChange",
              "Failed to change password"
            )
        );
      }

      toast.success(
        t(
          "profile.passwordModal.toasts.success",
          "Password changed successfully"
        )
      );
      setPasswordMessage(
        t(
          "profile.passwordModal.messages.success",
          "Password changed successfully"
        )
      );

      // Log out user and redirect to login page after password change
      setTimeout(() => {
        logOut();
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        error.message ||
          t(
            "profile.passwordModal.toasts.error",
            "パスワードの変更に失敗しました"
          )
      );
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  // Edit form handlers
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartEdit = () => {
    initializeEditForm();
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    initializeEditForm();
  };

  // Password form handlers
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswords({
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setPasswordMessage("");
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswords({
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setPasswordMessage("");
  };

  return {
    // Data
    profileData: profileData?.data,
    isLoading,
    error,

    // UI State
    isEditing,
    editForm,
    isUpdating,
    isUploading,
    showPasswordModal,
    passwords,
    passwordMessage,
    isSubmittingPassword,

    // Actions
    mutate,
    handleUpdateName,
    handleImageUpload,
    handleImageDelete,
    handlePasswordChange,
    handleEditFormChange,
    handleStartEdit,
    handleCancelEdit,
    handleOpenPasswordModal,
    handleClosePasswordModal,
    formatDate,
  };
}
