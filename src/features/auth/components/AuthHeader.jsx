// components/AuthHeader.jsx
import React from "react";
import Link from "next/link";
import { DarkThemeToggle } from "flowbite-react";
import InventuraMark from "@/components/InventuraMark";
import LangToggle, { LangToggleIcon } from "@/components/LangToggle";
import { useI18n } from "@/i18n/I18nProvider";

const AuthHeader = () => {
    const { t } = useI18n();
  
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
      <Link
        href="/"
        className="text-xl font-bold text-gray-900 dark:text-white"
      >
        <div className="flex items-center space-x-2">
          <InventuraMark className="size-7" />
          <h1 className="text-2xl font-bold">{t("brand", "インベンチュラ")}</h1>
        </div>
      </Link>
      <div className="flex gap-3">
        <LangToggle className="rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700" />
        <DarkThemeToggle />
      </div>
    </div>
  );
};

export default AuthHeader;
