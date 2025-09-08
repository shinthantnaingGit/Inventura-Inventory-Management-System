"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import useAccountStore from "@/store/useAccountStore";
import {
  profileApiUrl,
  getProfiles,
  updateProfile,
} from "@/services/profile";

const inputBase =
  "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-amber-500 transition";

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500 transition";

export default function ProfileSection() {
  const { t } = useI18n();
  const token = useAccountStore.getState().token;
  const { data, error, isLoading, mutate } = getProfiles(profileApiUrl);
  const profile = data?.data ?? {};

  // local state
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [name, setName] = useState(profile?.name || "");
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  const onSaveName = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(profile.id, { name });
      if (!res.ok) throw new Error(await res.text());
      toast.success(t("profile.toasts.nameSaved","氏名を更新しました。"));
      mutate();
      setEditNameOpen(false);
    } catch {
      toast.error(t("profile.toasts.errorGeneric","通信に失敗しました。"));
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    if (pw.next.length < 8) return toast.error(t("profile.validation.passwordMin","パスワードは8文字以上で入力してください。"));
    if (pw.next !== pw.confirm) return toast.error(t("profile.validation.passwordMatch","新しいパスワードと確認用が一致しません。"));

    try {
      const res = await fetch(`${profileApiUrl}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: pw.current,
          new_password: pw.next,
          new_password_confirmation: pw.confirm,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(t("profile.toasts.passwordSaved","パスワードを更新しました。"));
      setPw({ current: "", next: "", confirm: "" });
      setPwOpen(false);
    } catch {
      toast.error(t("profile.toasts.errorGeneric","通信に失敗しました。"));
    }
  };

  if (isLoading) return <div className="p-6">{t("common.loading","読み込み中…")}</div>;
  if (error) return <div className="p-6 text-red-500">{t("common.error","エラーが発生しました")}</div>;

  return (
    <section className="mx-auto max-w-full sm:max-w-[70%] lg:max-w-[60%] px-4 sm:px-5 pb-24 sm:pb-6">
      {/* Avatar + Basic Info */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="size-20 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
          {profile.profile_image ? (
            <Image
              src={profile.profile_image}
              alt="avatar"
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl text-gray-500">
              {profile?.name?.[0] ?? "U"}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{profile?.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.email}</p>
        </div>
      </div>

      {/* Profile fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <Field label={t("profile.labels.name","氏名")} value={profile?.name} />
        <Field label={t("profile.labels.email","メールアドレス")} value={profile?.email} />
        <Field label="Created" value={profile?.created_at} />
        <Field label="Updated" value={profile?.updated_at} />
      </div>

      {/* Change Name (collapsible) */}
      <div className="border-t pt-4">
        <button
          onClick={() => setEditNameOpen(!editNameOpen)}
          className="flex w-full items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {t("profile.sections.changeName","氏名の変更")}
          {editNameOpen ? <ChevronUp className="size-4"/> : <ChevronDown className="size-4"/>}
        </button>
        {editNameOpen && (
          <form onSubmit={onSaveName} className="mt-3 space-y-2">
            <input
              className={inputBase}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("profile.placeholders.name","表示名を入力")}
              required
            />
            <button className={btnPrimary}>
              {t("profile.actions.save","保存")}
            </button>
          </form>
        )}
      </div>

      {/* Change Password (collapsible) */}
      <div className="border-t pt-4">
        <button
          onClick={() => setPwOpen(!pwOpen)}
          className="flex w-full items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {t("profile.sections.changePassword","パスワードの変更")}
          {pwOpen ? <ChevronUp className="size-4"/> : <ChevronDown className="size-4"/>}
        </button>
        {pwOpen && (
          <form onSubmit={onChangePassword} className="mt-3 grid gap-3 sm:grid-cols-3">
            <input
              type="password"
              className={inputBase}
              value={pw.current}
              onChange={(e) => setPw({ ...pw, current: e.target.value })}
              placeholder={t("profile.labels.currentPassword","現在のパスワード")}
              required
            />
            <input
              type="password"
              className={inputBase}
              value={pw.next}
              onChange={(e) => setPw({ ...pw, next: e.target.value })}
              placeholder={t("profile.labels.newPassword","新しいパスワード")}
              required
            />
            <input
              type="password"
              className={inputBase}
              value={pw.confirm}
              onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              placeholder={t("profile.labels.confirmPassword","新しいパスワード（確認）")}
              required
            />
            <div className="sm:col-span-3 flex justify-end">
              <button className={btnPrimary}>
                {t("profile.actions.updatePassword","パスワードを更新")}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="mt-1 font-medium text-gray-900 dark:text-gray-100 break-all">
        {value || "—"}
      </span>
    </div>
  );
}
