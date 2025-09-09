"use client";
import { Globe } from "lucide-react";
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
        "",
        "",
        S.pad,
        S.text,
        className,
      ].join(" ")}
    >
      <Globe className={`${S.icon} shrink-0`} />
      {/* Reserve label width so EN/日本語 doesn’t push neighbors */}
      <span className={`hidden sm:block w-fit ${S.labelW} text-center`}>
        {locale === "en" ? "ENGLISH" : "日本語"}
      </span>
    </button>
  );
}
