import { Toaster } from "sonner";
import "../styles/globals.css";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { ThemeModeScript } from "flowbite-react";
import NextTopLoader from "nextjs-toploader";
import { ConfirmDialog } from "primereact/confirmdialog";
import PrimeReactThemeBridge from "@/components/PrimeReactThemeBridge";
import { I18nProvider } from "@/i18n/I18nProvider"; // 🔸 add this

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
          <Toaster />
          <NextTopLoader />
        </I18nProvider>
      </body>
    </html>
  );
}
