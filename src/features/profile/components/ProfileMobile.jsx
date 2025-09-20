"use client";
import Link from "next/link";
import { useState } from "react";
import {
  User,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Loader2,
  ArrowLeft,
  Trash2,
  MoreVertical,
} from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useI18n } from "@/i18n/I18nProvider";
import LangToggle from "@/components/LangToggle";
import { useProfileHook } from "../hooks/useProfileHook";

const ProfileMobile = ({ profileData, onOpenPasswordModal }) => {
  const { t } = useI18n();
  const {
    isEditing,
    editForm,
    isUpdating,
    isUploading,
    handleUpdateName,
    handleImageUpload,
    handleImageDelete,
    handleEditFormChange,
    handleStartEdit,
    handleCancelEdit,
    formatDate,
  } = useProfileHook();

  const [showImageDropdown, setShowImageDropdown] = useState(false);

  const handleImageUploadWrapper = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageUpload(file);
      e.target.value = ""; // Reset file input
      setShowImageDropdown(false); // Close dropdown after upload
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 shadow-lg transition-colors duration-300">
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-white">
            {t("profile.title", "ユーザープロフィール")}
          </h1>
          <div className="flex items-center gap-2">
            <DarkModeToggle className="px-2 py-3 rounded-lg text-white border dark:border-gray-300" />
            <LangToggle className="px-2 py-3 rounded-lg text-white border dark:border-gray-300" />
          </div>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ${
                profileData.profile_image &&
                profileData.profile_image.trim() !== "" &&
                !profileData.profile_image.endsWith("/storage")
                  ? "bg-gradient-to-r from-blue-400 to-purple-400"
                  : "bg-gray-200"
              }`}
            >
              {profileData.profile_image &&
              profileData.profile_image.trim() !== "" &&
              !profileData.profile_image.endsWith("/storage") ? (
                <img
                  src={profileData.profile_image}
                  alt={t("profile.alt.avatar", "プロフィール画像")}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-gray-500" />
              )}
            </div>

            {/* Edit Icon Dropdown */}
            <button
              onClick={() => setShowImageDropdown(!showImageDropdown)}
              className="absolute -bottom-1 -right-1 bg-white text-gray-600 p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
              title="Profile Options"
            >
              <MoreVertical size={14} />
            </button>

            {/* Dropdown Menu */}
            {showImageDropdown && (
              <div className="absolute -right-30 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[140px]">
                <label
                  htmlFor="mobile-profile-image"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Camera size={16} />
                  {profileData?.profile_image &&
                  profileData.profile_image.trim() !== "" &&
                  !profileData.profile_image.endsWith("/storage")
                    ? t("profile.actions.changeProfile", "プロフィールを変更")
                    : t("profile.actions.addPhoto", "写真を追加")}
                </label>
                <input
                  id="mobile-profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUploadWrapper}
                  className="hidden"
                />
                {profileData?.profile_image &&
                  profileData.profile_image.trim() !== "" &&
                  !profileData.profile_image.endsWith("/storage") && (
                    <button
                      onClick={() => {
                        handleImageDelete();
                        setShowImageDropdown(false);
                      }}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                      {t("profile.actions.removeProfile", "プロフィールを削除")}
                    </button>
                  )}
              </div>
            )}

            {/* Click outside to close dropdown */}
            {showImageDropdown && (
              <div
                className="fixed inset-0 z-0"
                onClick={() => setShowImageDropdown(false)}
              />
            )}
          </div>

          {!isEditing ? (
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-semibold text-white text-center">
                {profileData.name}
              </h2>
              <button
                onClick={handleStartEdit}
                className="p-1 -mb-1 text-white/80 hover:text-white transition-colors"
                aria-label={t("profile.actions.editName", "氏名を編集")}
              >
                <Edit3 size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 w-full">
              <input
                type="text"
                value={editForm.name}
                onChange={handleEditFormChange}
                className="text-xl font-semibold text-gray-700 dark:text-white text-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("profile.placeholders.name", "表示名を入力")}
              />
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleUpdateName}
                  disabled={isUpdating}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-colors ${
                    isUpdating
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isUpdating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {t("common.save", "保存")}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-colors"
                >
                  <X size={16} />
                  {t("common.cancel", "キャンセル")}
                </button>
              </div>
            </div>
          )}
          <p className="text-blue-100 text-sm mt-1">
            {t("profile.labels.userId", "ユーザーID")}: #{profileData.id}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4 flex flex-col gap-2">
        {/* Email */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Mail size={16} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-white">
              {t("profile.labels.email", "メールアドレス")}
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 ml-11 break-all">
            {profileData.email}
          </p>
        </div>

        {/* Dates */}
        <div className="space-y-3">
          <InfoRow
            color="green"
            title={t("profile.labels.memberSince", "登録日")}
            value={formatDate(profileData.created_at)}
          />
          <InfoRow
            color="purple"
            title={t("profile.labels.lastUpdated", "最終更新")}
            value={formatDate(profileData.updated_at)}
          />
        </div>

        {/* Change Password */}
        <button
          onClick={onOpenPasswordModal}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          {t("profile.actions.changePassword", "パスワードを変更")}
        </button>

        {/* Status */}
        <div className="flex justify-center pt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 dark:border dark:border-green-600/30">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            {t("profile.badges.active", "アクティブ")}
          </span>
        </div>

        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="flex text-sm w-fit border dark:border-gray-700 dark:bg-blue-600 dark:text-white border-gray-300 justify-center items-center gap-1 rounded-lg text-blue-600 hover:bg-white px-2 py-2 font-medium transition"
          aria-label={t("profile.actions.back", "ダッシュボードへ戻る")}
        >
          <ArrowLeft className="size-4" />
          {t("profile.actions.back", "ダッシュボードへ戻る")}
        </Link>
      </div>
    </div>
  );
};

const InfoRow = ({ color = "green", title, value }) => {
  const colorMap = {
    green: "bg-green-100 dark:bg-green-900/30 text-green-600",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
  };
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${colorMap[color]} rounded-lg`}>
          <Calendar size={16} className={colorMap[color].split(" ").pop()} />
        </div>
        <div>
          <h4 className="font-medium text-gray-700 dark:text-white text-sm">
            {title}
          </h4>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileMobile;
