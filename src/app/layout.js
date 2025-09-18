import { Toaster } from "sonner";
import "../styles/globals.css";
import NextTopLoader from "nextjs-toploader";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: "インベンチュラ",
  description:
    "在庫・請求書・バウチャーを管理できるモダンなWebアプリ。英語/日本語対応。Next.js・TailwindCSS・shadcn/uiで構築し、Laravel API (MMS IT) を利用。",

  keywords: [
    "在庫管理",
    "請求書システム",
    "バウチャー管理",
    "Next.js",
    "React",
    "TailwindCSS",
    "shadcn/ui",
    "MMS IT",
    "Laravel API",
    "日本語 英語",
  ],

  authors: [{ name: "Shin Thant Naing" }],

  openGraph: {
    title: "Inventura | 在庫・請求書管理システム",
    description:
      "製品・バウチャー・請求書を効率的に管理。英語/日本語対応。Next.js + TailwindCSS + shadcn/ui で開発。",
    url: "https://inventura-inventory-management-syst.vercel.app/", // <-- replace with your domain
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
      "英語/日本語対応の在庫・請求書管理アプリ。shadcn/ui + Laravel API (MMS IT) を利用。",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },

  manifest: "/site.webmanifest",

  alternates: {
    canonical: "https://inventura-inventory-management-syst.vercel.app",
    languages: {
      en: "https://inventura-inventory-management-syst.vercel.app/en",
      ja: "https://inventura-inventory-management-syst.vercel.app/ja",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        {/* Theme provider wraps everything */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* i18n provider wraps everything */}
          <I18nProvider>
            {children}
            <Toaster position="top-center" richColors />
            <NextTopLoader />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
