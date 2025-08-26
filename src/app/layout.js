// app/layout.jsx (Correct)

import { Toaster } from "sonner";
import "../styles/globals.css";
import "primereact/resources/themes/lara-dark-blue/theme.css"; // or lara-dark-blue
import "primereact/resources/primereact.min.css";
import { ThemeModeScript } from "flowbite-react";
import NextTopLoader from "nextjs-toploader";
import { ConfirmDialog } from "primereact/confirmdialog";
import PrimeReactThemeBridge from "@/components/PrimeReactThemeBridge";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body>
          <PrimeReactThemeBridge />
        {children}
         <ConfirmDialog />
        <Toaster />
        <NextTopLoader />
      </body>
    </html>
  );
}
