"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Languages } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import InventuraMark from "@/components/InventuraMark";
import { useI18n } from "@/i18n/I18nProvider";
import LangToggle from "@/components/LangToggle";

export default function Header() {
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((s) => !s);

  const nav = [
    { name: t("landing.nav.home", "ホーム"), href: "#hero" },
    { name: t("landing.nav.about", "我々について"), href: "#about" },
    { name: t("landing.nav.features", "機能"), href: "#intro" },
    { name: t("landing.nav.contact", "お問い合わせ"), href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md transition-colors duration-500">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        {/* Left: logo */}
        <div className="flex items-center space-x-2">
          <InventuraMark className="size-7" />
          <h1 className="text-2xl font-bold">{t("brand", "インベンチュラ")}</h1>
        </div>

        {/* Center: desktop nav */}
        <nav className="hidden md:flex flex-grow justify-center">
          <div className="flex items-center space-x-6">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300"
              >
                {item.name}
              </a>
            ))}
          </div>
        </nav>

        {/* Right: toggles + auth */}
        <div className="hidden md:flex items-center space-x-4">
          <LangToggle className="rounded-xl bg-gray-100  dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600" />
          <DarkModeToggle className="rounded-xl bg-gray-100  dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600" />
          <Link
            href="/login"
            className="px-4 py-2 w-25 text-center text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
          >
            {t("landing.auth.login", "ログイン")}
          </Link>
          <Link
            href="/register"
            className="px-3 py-2 w-20 text-center text-sm font-medium text-blue-600 dark:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            {t("landing.auth.register", "登録")}
          </Link>
        </div>
        <DarkModeToggle className="rounded-xl md:hidden bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600" />
        <LangToggle className="rounded-xl md:hidden bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600" />
        {/* Mobile: menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden px-4 py-2 bg-white dark:bg-gray-800 ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <nav className="flex flex-col space-y-2">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={toggleMenu}
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300"
            >
              {item.name}
            </a>
          ))}
          <Link href="/login" onClick={toggleMenu} className="block py-2">
            {t("landing.auth.login", "ログイン")}
          </Link>
          <Link href="/register" onClick={toggleMenu} className="block py-2">
            {t("landing.auth.register", "登録")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
