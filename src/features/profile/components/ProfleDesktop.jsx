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

const ProfileDesktop = ({ profileData, onOpenPasswordModal }) => {
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
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 sm:px-12 py-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {t("profile.title", "ユーザープロフィール")}
            </h1>
            <p className="text-blue-100">
              {t("profile.subtitle", "アカウント情報と設定を管理します")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Back to Dashboard */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-white/90 text-blue-600 hover:bg-white px-3 py-2 text-sm font-medium transition"
              aria-label={t("profile.actions.back", "ダッシュボードへ戻る")}
            >
              <ArrowLeft className="size-4" />
              {t("profile.actions.back", "ダッシュボードへ戻る")}
            </Link>
            {/* Lang Toggle */}
            <LangToggle
              text="text-blue-600"
              className="rounded-xl bg-white/90  hover:bg-white px-3 py-2 text-sm font-medium transition"
            />
            {/* Dark Mode Toggle */}
            <DarkModeToggle className="rounded-xl bg-white/90  hover:bg-white px-3 py-2 text-sm font-medium transition text-blue-600" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Left Column - Profile Image and Basic Info */}
          <div className="lg:col-span-1">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div
                  className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full flex items-center justify-center overflow-hidden shadow-2xl ${
                    profileData.profile_image &&
                    profileData.profile_image.trim() !== "" &&
                    !profileData.profile_image.endsWith("/storage")
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
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
                    <User size={60} className="text-gray-500" />
                  )}
                </div>

                {/* Edit Icon Dropdown */}
                <button
                  onClick={() => setShowImageDropdown(!showImageDropdown)}
                  className="absolute bottom-2 right-2 bg-white text-gray-600 p-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  title="Profile Options"
                >
                  <MoreVertical size={18} />
                </button>

                {/* Dropdown Menu */}
                {showImageDropdown && (
                  <div className="absolute -right-30 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[160px]">
                    <label
                      htmlFor="desktop-profile-image"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <Camera size={18} />
                      {profileData?.profile_image &&
                      profileData.profile_image.trim() !== "" &&
                      !profileData.profile_image.endsWith("/storage")
                        ? t(
                            "profile.actions.changeProfile",
                            "プロフィールを変更"
                          )
                        : t("profile.actions.addPhoto", "写真を追加")}
                    </label>
                    <input
                      id="desktop-profile-image"
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
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={18} />
                          {t(
                            "profile.actions.removeProfile",
                            "プロフィールを削除"
                          )}
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

              <div className="mb-6 flex flex-col justify-center items-center">
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {t("profile.labels.userId", "ユーザーID")}: #{profileData.id}
                </p>

                {!isEditing ? (
                  <div className="flex w-full sm:w-80 items-center justify-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-white mb-2">
                      {profileData.name}
                    </h2>
                    <button
                      onClick={handleStartEdit}
                      className="p-2 -mb-2 text-gray-700 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
                      aria-label={t("profile.actions.editName", "氏名を編集")}
                    >
                      <Edit3 size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={handleEditFormChange}
                      className="w-full sm:w-96 text-2xl sm:text-3xl font-bold text-gray-700 dark:text-white text-center bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl px-3 py-1 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                      placeholder={t(
                        "profile.placeholders.name",
                        "表示名を入力"
                      )}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleUpdateName}
                        disabled={isUpdating}
                        className={`flex shadow-sm items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                          isUpdating
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Save size={18} />
                        )}
                        {t("common.save", "保存")}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                        className="flex shadow-sm items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors"
                      >
                        <X size={18} />
                        {t("common.cancel", "キャンセル")}
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 dark:border dark:border-green-600/30">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    {t("profile.badges.active", "アクティブなプロフィール")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Email Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Mail size={22} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-white mb-1 sm:mb-2">
                    {t("profile.labels.email", "メールアドレス")}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-lg break-all">
                    {profileData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Timeline */}
            <div className="grid md:grid-cols-2 gap-6">
              <InfoCard
                icon={<Calendar size={24} className="text-green-600" />}
                iconWrapClass="bg-green-100 dark:bg-green-900/30"
                title={t("profile.labels.memberSince", "登録日")}
                value={formatDate(profileData.created_at)}
              />
              <InfoCard
                icon={<Calendar size={24} className="text-purple-600" />}
                iconWrapClass="bg-purple-100 dark:bg-purple-900/30"
                title={t("profile.labels.lastUpdated", "最終更新")}
                value={formatDate(profileData.updated_at)}
              />
            </div>

            {/* Change Password Button */}
            <button
              onClick={onOpenPasswordModal}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold transition-colors"
            >
              {t("profile.actions.changePassword", "パスワードを変更")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, iconWrapClass, title, value }) => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
    <div className="flex items-start gap-4 sm:gap-6">
      <div className={`p-3 sm:p-4 rounded-xl ${iconWrapClass}`}>{icon}</div>
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-white mb-1 sm:mb-2">
          {title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300">{value}</p>
      </div>
    </div>
  </div>
);

export default ProfileDesktop;
