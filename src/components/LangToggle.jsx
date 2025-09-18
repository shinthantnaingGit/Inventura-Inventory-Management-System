"use client";
import { Languages } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function LangToggle({ text = "", className = "" }) {
  const { t, locale, setLocale } = useI18n();
  const toggle = () => setLocale(locale === "en" ? "ja" : "en");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("nav.settings", "設定")}
      className={[
        "flex  items-center gap-2 px-3 py-1.5 text-sm",
        className,
      ].join(" ")}
    >
      <Languages className={`size-4 shrink-0  ${text && text}`} />
      {/* Reserve label width so EN/日本語 doesn’t push neighbors */}
      <span
        className={`hidden sm:block w-10 text-center ${
          text ? text : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {locale === "en" ? "日本" : "EN"}
      </span>
    </button>
  );
}
