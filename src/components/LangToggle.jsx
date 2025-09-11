"use client";
import { Languages } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function LangToggle({ className = "", size = "sm" }) {
  const { t, locale, setLocale } = useI18n();
  const toggle = () => setLocale(locale === "en" ? "ja" : "en");

  // size presets
  const S =
    size === "sm"
      ? {
          pad: "px-3 py-1.5",
          icon: "size-4",
          labelW: "w-[48px]",
          text: "text-sm",
        }
      : {
          pad: "px-3.5 py-2",
          icon: "size-5",
          labelW: "w-[56px]",
          text: "text-sm",
        };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("nav.settings", "設定")}
      className={[
        "flex  items-center gap-2 border",
        S.pad,
        S.text,
        className,
      ].join(" ")}
    >
      <Languages className={`${S.icon} shrink-0`} />
      {/* Reserve label width so EN/日本語 doesn’t push neighbors */}
      <span className={`hidden sm:block w-15 text-center`}>
        {locale === "en" ? "ENGLISH" : "日本語"}
      </span>
    </button>
  );
}

export function LangToggleIcon() {
  const { t, locale, setLocale } = useI18n();
  const toggle = () => setLocale(locale === "en" ? "ja" : "en");

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700"
    >
      <Languages/>
    </button>
  );
}
