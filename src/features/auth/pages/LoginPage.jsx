"use client";
import React from "react";
import AuthHeader from "../components/AuthHeader";
import LoginForm from "../components/LoginForm";
import { useI18n } from "@/i18n/I18nProvider";

const LoginPage = () => {
  const { t } = useI18n();

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <AuthHeader />
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          {t("auth.login.page.title", "アカウントにサインイン")}
        </h2>
        <LoginForm />
      </div>
    </section>
  );
};

export default LoginPage;
