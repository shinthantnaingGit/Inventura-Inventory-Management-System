"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { messages } from "./messages";

const I18nCtx = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState("ja");

  // load saved locale
  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("locale") : null;
    if (saved && messages[saved]) setLocale(saved);
  }, []);

  // persist on change
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("locale", locale);
  }, [locale]);

  const dict = messages[locale] || messages.ja;

  // tiny t() helper: dot-path e.g. "nav.dashboard"
  const t = useMemo(() => {
    return (key, fallback = "") => {
      try {
        return (
          key
            .split(".")
            .reduce(
              (acc, k) => (acc && acc[k] != null ? acc[k] : undefined),
              dict
            ) ??
          fallback ??
          key
        );
      } catch {
        return fallback || key;
      }
    };
  }, [dict]);

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
