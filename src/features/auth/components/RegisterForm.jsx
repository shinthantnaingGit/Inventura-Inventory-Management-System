"use client";
import React, { useState, useRef, useEffect } from "react";
import { User, Mail, Lock, X } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { userRegister } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";

const TermsModal = ({ open, onClose }) => {
  const { t } = useI18n();
  const dialogRef = useRef(null);

  // basic focus handling when modal opens
  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 id="terms-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t("auth.register.terms.title", "利用規約")}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label={t("auth.register.terms.actions.close", "閉じる")}
          >
            <X className="size-5" />
          </button>
        </div>

        <div
          ref={dialogRef}
          tabIndex={-1}
          className="px-6 py-5 max-h-[60vh] overflow-y-auto text-sm text-gray-700 dark:text-gray-300 leading-6"
        >
          <p className="mb-3">
            {t(
              "auth.register.terms.intro",
              "本規約は、インベンチュラのサービスをご利用いただく際の条件を定めるものです。ご利用前に必ずお読みください。"
            )}
          </p>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
            {t("auth.register.terms.section1.title", "1. アカウント")}
          </h4>
          <p className="mb-3">
            {t(
              "auth.register.terms.section1.body",
              "ユーザーは正確な情報を提供し、ログイン情報の機密性を保持する責任があります。"
            )}
          </p>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
            {t("auth.register.terms.section2.title", "2. データとプライバシー")}
          </h4>
          <p className="mb-3">
            {t(
              "auth.register.terms.section2.body",
              "当社はサービス提供および改善のために、プライバシーポリシーに基づきデータを取り扱います。"
            )}
          </p>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
            {t("auth.register.terms.section3.title", "3. 禁止事項")}
          </h4>
          <p className="mb-3">
            {t(
              "auth.register.terms.section3.body",
              "不正アクセス、サービスの妨害、法令違反行為は固く禁止します。"
            )}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-4">
            {t(
              "auth.register.terms.footer",
              "本規約は予告なく変更される場合があります。最新の規約は当社サイトでご確認ください。"
            )}
          </p>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            {t("auth.register.terms.actions.accept", "同意して閉じる")}
          </button>
        </div>
      </div>
    </div>
  );
};

const RegisterForm = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [openTerms, setOpenTerms] = useState(false);

  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      };

      const res = await userRegister(payload);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || t("auth.register.errors.failed", "登録に失敗しました"));
      }

      toast.success(t("auth.register.toasts.success", "登録が完了しました。ログインしてください。"));
      reset();
      router.push("/login");
    } catch (err) {
      toast.error(err.message || t("auth.register.errors.generic", "エラーが発生しました"));
    }
  };

  return (
    <>
      <TermsModal open={openTerms} onClose={() => setOpenTerms(false)} />

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("auth.register.labels.name", "氏名")}
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                placeholder={t("auth.register.placeholders.name", "お名前")}
                className={`w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700"
                }`}
                {...register("name", {
                  required: t("auth.register.validation.name.required", "氏名は必須です"),
                  minLength: { value: 2, message: t("auth.register.validation.name.min", "2文字以上で入力してください") },
                })}
                autoComplete="name"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={20} />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-500">{String(errors.name.message)}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("auth.register.labels.email", "メールアドレス")}
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder={t("auth.register.placeholders.email", "you@example.com")}
                className={`w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700"
                }`}
                {...register("email", {
                  required: t("auth.register.validation.email.required", "メールアドレスは必須です"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("auth.register.validation.email.invalid", "メールアドレスの形式が正しくありません"),
                  },
                })}
                autoComplete="email"
                inputMode="email"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={20} />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-500">{String(errors.email.message)}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("auth.register.labels.password", "パスワード")}
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder={t("auth.register.placeholders.password", "••••••••")}
                className={`w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700"
                }`}
                {...register("password", {
                  required: t("auth.register.validation.password.required", "パスワードは必須です"),
                  minLength: { value: 6, message: t("auth.register.validation.password.min", "6文字以上で入力してください") },
                })}
                autoComplete="new-password"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={20} />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{String(errors.password.message)}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("auth.register.labels.passwordConfirm", "パスワード（確認）")}
            </label>
            <div className="relative">
              <input
                type="password"
                id="password_confirmation"
                placeholder={t("auth.register.placeholders.passwordConfirm", "••••••••")}
                className={`w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.password_confirmation ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700"
                }`}
                {...register("password_confirmation", {
                  required: t("auth.register.validation.passwordConfirm.required", "確認用パスワードは必須です"),
                  validate: (value) =>
                    value === password || t("auth.register.validation.passwordConfirm.match", "パスワードが一致しません"),
                })}
                autoComplete="new-password"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={20} />
            </div>
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-500">{String(errors.password_confirmation.message)}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                {...register("terms", {
                  required: t("auth.register.validation.terms.required", "利用規約に同意してください"),
                })}
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-900 dark:text-gray-300">
                {t("auth.register.labels.agreePrefix", "以下に同意します:")}{" "}
                <button
                  type="button"
                  onClick={() => setOpenTerms(true)}
                  className="text-blue-600 hover:underline dark:text-blue-400 ml-1"
                >
                  {t("auth.register.labels.termsLink", "利用規約")}
                </button>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-xs mt-1">{String(errors.terms.message)}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? t("auth.register.actions.creating", "アカウント作成中…")
              : t("auth.register.actions.create", "アカウントを作成")}
          </button>
        </form>

        {/* Login link */}
        <div className="mt-6 text-center">
          <span className="text-gray-600 dark:text-gray-300">
            {t("auth.register.labels.haveAccount", "すでにアカウントをお持ちですか？")}{" "}
          </span>
          <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            {t("auth.register.actions.signIn", "サインイン")}
          </Link>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
