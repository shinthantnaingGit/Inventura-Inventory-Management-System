"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DarkThemeToggle } from "flowbite-react";
import {
  Bell,
  Search,
  ChevronDown,
  Settings,
  User,
  Globe,
  UserCheck,
} from "lucide-react";
import LogOutButton from "./LogOutButton";
import { useI18n } from "@/i18n/I18nProvider";
import GlobalSearch from "@/components/GlobalSearch";
import { fetchProfile, profileApiUrl } from "@/services/profile";
import LangToggle from "@/components/LangToggle";
import InventuraMark from "@/components/InventuraMark";
import useSWR from "swr";

const DashBoardHeader = ({ onOpenSidebar, brand = "Inventura" }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);
  const { t } = useI18n();

  useEffect(() => {
    const onClick = (e) =>
      profileRef.current &&
      !profileRef.current.contains(e.target) &&
      setOpenProfile(false);
    const onKey = (e) => e.key === "Escape" && setOpenProfile(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  const {
    data: profile,
    isLoading,
    error,
  } = useSWR(`${profileApiUrl}/profile`, fetchProfile);
  const profileData = profile?.data;

  return (
    <header className="mb-5 print:hidden top-0 relative z-50 border-b border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/60 backdrop-blur">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stable 3-column grid prevents center from shifting */}
        <div className="h-16 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          {/* Left: brand (don’t shrink) */}
          <div className="min-w-0">
            <Link
              href="/dashboard"
              className="font-bold text-lg flex gap-2 sm:text-xl tracking-tight text-gray-900 dark:text-gray-100 whitespace-nowrap"
              title={t("brand", brand)}
            >
              <InventuraMark /> {t("brand", "インベンチュラ")}
            </Link>
          </div>

          {/* Center: search (stable width area) */}
          <div className="hidden md:block max-w-xl mx-auto w-full">
            <GlobalSearch />
          </div>

          {/* Right: actions (no shrink) */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0">
            {/* Language toggle — reserve width for longest label */}

            <LangToggle className="rounded-xl text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700" />

            {/* Theme toggle */}
            <div className="block">
              <DarkThemeToggle />
            </div>

            {/* Profile menu — fix label width to avoid EN/JA shift */}
            <div className="relative " ref={profileRef}>
              <div
                type="button"
                onClick={() => setOpenProfile((s) => !s)}
                className="inline-flex justify-center items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-2 pr-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-haspopup="menu"
                aria-expanded={openProfile}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center overflow-hidden">
                  {!isLoading && profileData.profile_image ? (
                    <img
                      src={profileData.profile_image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/pf.png"; // fallback image
                      }}
                    />
                  ) : (
                    <User size={32} className="text-white" />
                  )}
                </div>
                {/* Reserve space for 'プロフィール' vs 'Profile' */}
                <span className="hidden sm:block text-sm text-gray-800 dark:text-gray-100 w-[5.75rem] text-center truncate">
                  {/* {t("nav.profile", "プロフィール")} */}
                  {profileData?.name}
                </span>
                <ChevronDown className="size-4 text-gray-600 shrink-0" />
              </div>

              {openProfile && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg"
                >
                  <MenuItem
                    href="/dashboard/profile"
                    icon={User}
                    label={t("nav.profile", "プロフィール")}
                  />
                  {/* <MenuItem
                    href="/dashboard/settings"
                    icon={Settings}
                    label={t("nav.settings", "設定")}
                  /> */}
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
      <Icon className="size-4 text-gray-600 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
