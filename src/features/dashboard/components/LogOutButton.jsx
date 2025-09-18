"use client";

import useAccountStore from "@/store/useAccountStore";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";

const LogOutButton = () => {
  const { logOut } = useAccountStore();
  const router = useRouter();
  const { t } = useI18n();

  const handleLogOut = () => {
    logOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogOut}
      className="flex items-center w-full cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
    >
      <LogOut size={18} />
      {t("nav.logout", "ログアウト")}
    </button>
  );
};

export default LogOutButton;
