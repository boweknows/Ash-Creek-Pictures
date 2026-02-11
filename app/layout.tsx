import type { Metadata } from "next";
import "./globals.css";
import { PWARegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: "Ash Creek Career OS",
  description: "Daily command center for a filmmaker.",
  manifest: "/manifest.json",
  themeColor: "#0B1020",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
