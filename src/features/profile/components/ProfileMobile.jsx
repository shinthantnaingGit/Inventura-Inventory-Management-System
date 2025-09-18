"use client";
import Link from "next/link";
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
} from "lucide-react";
import { DarkThemeToggle } from "flowbite-react";
import { useState } from "react";
import {
  storeProfileImage,
  updateProfileName,
  profileApiUrl,
} from "@/services/profile";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { useI18n } from "@/i18n/I18nProvider";
import LangToggle from "@/components/LangToggle";

const ProfileMobile = ({ profileData, onOpenPasswordModal }) => {
  const { t, locale } = useI18n();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: profileData.name });
  const [isUpdating, setIsUpdating] = useState(false);
  const { mutate } = useSWRConfig();

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString(locale === "ja" ? "ja-JP" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tokyo",
    });

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      const res = await updateProfileName({ name: editForm.name });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to update name");
      }
      toast.success(t("profile.toasts.nameSaved", "氏名を更新しました。"));
      // refresh profile data (FIX: target the actual profile endpoint)
      await mutate(profileApiUrl);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      toast.error(
        e.message || t("profile.toasts.errorGeneric", "通信に失敗しました。")
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ name: profileData.name });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUpdating(true);
      const res = await storeProfileImage(file); // FormData handled in service
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to upload image");
      }
      toast.success(
        t("profile.toasts.imageSaved", "プロフィール画像を更新しました。")
      );
      // await mutate(
      //   (key) => typeof key === "string" && key.startsWith(profileApiUrl),
      //   undefined,
      //   { revalidate: true }
      // );
      mutate((key) => typeof key === "string" && key.startsWith(profileApiUrl));
    } catch (e) {
      console.error(e);
      toast.error(
        e.message || t("profile.toasts.errorGeneric", "通信に失敗しました。")
      );
    } finally {
      setIsUpdating(false);
      e.target.value = "";
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
            <DarkThemeToggle className="border text-white dark:text-white" />
            <LangToggle className="px-2 py-3 rounded-lg text-white border dark:border-gray-300" />
          </div>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center overflow-hidden">
              {profileData.profile_image ? (
                <img
                  src={profileData.profile_image}
                  alt={t("profile.alt.avatar", "プロフィール画像")}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>
            <label
              htmlFor="mobile-profile-image"
              className="absolute -bottom-1 -right-1 bg-white text-blue-600 p-2 rounded-full shadow-lg cursor-pointer"
              title={t("profile.actions.uploadImage", "画像をアップロード")}
            >
              <Camera size={14} />
              <input
                id="mobile-profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {!isEditing ? (
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-semibold text-white text-center">
                {profileData.name}
              </h2>
              <button
                onClick={() => setIsEditing(true)}
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
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="text-xl font-semibold text-gray-800 dark:text-white text-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("profile.placeholders.name", "表示名を入力")}
              />
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleSave}
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
                  onClick={handleCancel}
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
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {t("profile.labels.email", "メールアドレス")}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 ml-11 break-all">
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
          <h4 className="font-medium text-gray-800 dark:text-white text-sm">
            {title}
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileMobile;
