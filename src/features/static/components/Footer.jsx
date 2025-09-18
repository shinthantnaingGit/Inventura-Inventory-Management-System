"use client";
import { useI18n } from "@/i18n/I18nProvider";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-center py-6 px-4">
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {t("landing.footer.copyright", "© 2025 インベンチュラ。無断転載を禁じます。")}
      </p>
    </footer>
  );
}
