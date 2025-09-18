"use client";
import React from "react";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { userLogin } from "@/services/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAccountStore from "@/store/useAccountStore";
import { useI18n } from "@/i18n/I18nProvider";

const LoginForm = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const { setToken } = useAccountStore();

  const onSubmit = async (data) => {
    try {
      const res = await userLogin({ email: data.email, password: data.password });
      const loginData = await res.json();

      if (!res.ok) {
        throw new Error(loginData.message || t("auth.login.errors.failed", "ログインに失敗しました"));
      }

      setToken(loginData.token);
      toast.success(t("auth.login.toasts.success", "ログインしました"));
      reset();
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || t("auth.login.errors.failed", "ログインに失敗しました"));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("auth.login.labels.email", "メールアドレス")}
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              {...register("email", {
                required: t("auth.login.validation.email.required", "メールアドレスは必須です"),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("auth.login.validation.email.invalid", "メールアドレスの形式が正しくありません"),
                },
              })}
              className={`w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder={t("auth.login.placeholders.email", "you@example.com")}
              autoComplete="email"
              inputMode="email"
            />
            <Mail
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600"
              aria-hidden="true"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{String(errors.email.message)}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("auth.login.labels.password", "パスワード")}
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              {...register("password", {
                required: t("auth.login.validation.password.required", "パスワードは必須です"),
                minLength: {
                  value: 6,
                  message: t("auth.login.validation.password.min", "パスワードは6文字以上で入力してください"),
                },
              })}
              className={`w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder={t("auth.login.placeholders.password", "••••••••")}
              autoComplete="current-password"
            />
            <Lock
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600"
              aria-hidden="true"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{String(errors.password.message)}</p>
          )}
        </div>

        {/* Remember / Forgot */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              {...register("rememberMe")}
              className="h-4 accent-blue-600 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              {t("auth.login.labels.remember", "ログイン状態を保持")}
            </label>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {t("auth.login.actions.forgot", "パスワードをお忘れですか？")}
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSubmitting
            ? t("auth.login.actions.signingIn", "サインイン中…")
            : t("auth.login.actions.signIn", "サインイン")}
        </button>
      </form>

      {/* Register link */}
      <div className="mt-6 text-center">
        <span className="text-gray-600 dark:text-gray-300">
          {t("auth.login.labels.noAccount", "アカウントをお持ちではありませんか？")}{" "}
        </span>
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {t("auth.login.actions.signUp", "登録する")}
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;