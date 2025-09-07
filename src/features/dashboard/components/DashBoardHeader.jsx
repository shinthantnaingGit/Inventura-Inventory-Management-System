"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DarkThemeToggle } from "flowbite-react";
import { Bell, Search, ChevronDown, Settings, User, Globe } from "lucide-react";
import LogOutButton from "./LogOutButton";
import { useI18n } from "@/i18n/I18nProvider";

const DashBoardHeader = ({ onOpenSidebar, brand = "Inventura" }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);
  const { t, locale, setLocale } = useI18n();

  useEffect(() => {
    const onClick = (e) =>
      profileRef.current && !profileRef.current.contains(e.target) && setOpenProfile(false);
    const onKey = (e) => e.key === "Escape" && setOpenProfile(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggleLocale = () => setLocale(locale === "en" ? "ja" : "en");

  return (
    <header className="mb-5 top-0 z-40 border-b border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/60 backdrop-blur">
      <div className="mx-auto px-4 sm:px-6 lg:px-10">
        {/* Stable 3-column grid prevents center from shifting */}
        <div className="h-16 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          {/* Left: brand (don’t shrink) */}
          <div className="min-w-0">
            <Link
              href="/dashboard"
              className="font-bold text-lg sm:text-xl tracking-tight text-gray-900 dark:text-gray-100 whitespace-nowrap"
              title={t("brand", brand)}
            >
              {t("brand", "インベンチュラ")}
            </Link>
          </div>

          {/* Center: search (stable width area) */}
          <div className="hidden md:block max-w-xl mx-auto w-full">
            <div className="relative">
              <input
                type="search"
                placeholder={t("searchPlaceholder", "注文・商品・バウチャーを検索…")}
                aria-label={t("searchPlaceholder", "注文・商品・バウチャーを検索…")}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            </div>
          </div>

          {/* Right: actions (no shrink) */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0">
            {/* Language toggle — reserve width for longest label */}
            <button
              type="button"
              onClick={toggleLocale}
              className="inline-flex items-center w-fit gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 justify-center"
              aria-label={t("nav.settings", "設定")}
            >
              <Globe className="size-4 shrink-0" />
              {/* Reserve label width so EN/日本語 doesn’t reflow neighbors */}
              <span className="hidden sm:inline w-[48px]  text-center">
                {locale === "en" ? "EN" : "日本語"}
              </span>
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              aria-label={t("nav.orders", "注文")}
              title={t("nav.orders", "注文")}
            >
              <Bell className="size-5 shrink-0" />
              <span className="absolute -top-0.5 -right-0.5 block size-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-gray-900" />
            </button>

            {/* Theme toggle */}
            <div className="block">
              <DarkThemeToggle />
            </div>

            {/* Profile menu — fix label width to avoid EN/JA shift */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setOpenProfile((s) => !s)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-2 pr-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-haspopup="menu"
                aria-expanded={openProfile}
              >
                <span className="grid place-items-center size-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-semibold">
                  SB
                </span>
                {/* Reserve space for 'プロフィール' vs 'Profile' */}
                <span className="hidden sm:block text-sm text-gray-800 dark:text-gray-100 w-[5.75rem] text-left truncate">
                  {t("nav.profile", "プロフィール")}
                </span>
                <ChevronDown className="size-4 text-gray-500 shrink-0" />
              </button>

              {openProfile && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg"
                >
                  <MenuItem href="/dashboard/profile" icon={User} label={t("nav.profile", "プロフィール")} />
                  <MenuItem href="/dashboard/settings" icon={Settings} label={t("nav.settings", "設定")} />
                  <div className="my-1 h-px bg-gray-200 dark:bg-gray-800" />
                  <LogOutButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashBoardHeader;

function MenuItem({ href, icon: Icon, label }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <Icon className="size-4 text-gray-500 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
