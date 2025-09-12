import { Toaster } from "sonner";
import "../styles/globals.css";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { ThemeModeScript } from "flowbite-react";
import NextTopLoader from "nextjs-toploader";
import { ConfirmDialog } from "primereact/confirmdialog";
import PrimeReactThemeBridge from "@/components/PrimeReactThemeBridge";
import { I18nProvider } from "@/i18n/I18nProvider"; // 🔸 add this


export const metadata = {
  title: "インベンチュラ",
  description:
    "在庫・請求書・バウチャーを管理できるモダンなWebアプリ。英語/日本語対応。Next.js・TailwindCSS・PrimeReactで構築し、Laravel API (MMS IT) を利用。",

  keywords: [
    "在庫管理",
    "請求書システム",
    "バウチャー管理",
    "Next.js",
    "React",
    "TailwindCSS",
    "PrimeReact",
    "MMS IT",
    "Laravel API",
    "日本語 英語",
  ],

  authors: [{ name: "Shin Thant Naing" }],

  openGraph: {
    title: "Inventura | 在庫・請求書管理システム",
    description:
      "製品・バウチャー・請求書を効率的に管理。英語/日本語対応。Next.js + TailwindCSS + PrimeReact で開発。",
    url: "https://inventura.vercel.app", // <-- replace with your domain
    siteName: "Inventura",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Inventura ダッシュボード プレビュー",
      },
    ],
    locale: "ja_JP", // ← 日本向け
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Inventura: 在庫・請求書管理システム",
    description:
      "英語/日本語対応の在庫・請求書管理アプリ。Laravel API (MMS IT) を利用。",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  alternates: {
    canonical: "https://inventura.vercel.app",
    languages: {
      en: "https://inventura.vercel.app/en",
      ja: "https://inventura.vercel.app/ja",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body>
        {/* i18n provider wraps everything */}
        <I18nProvider>
          <PrimeReactThemeBridge />
          {children}
          <ConfirmDialog />
          <Toaster position="top-center" richColors />
          <NextTopLoader />
        </I18nProvider>
      </body>
    </html>
  );
}
