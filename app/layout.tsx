import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ToastContextProvider } from "@/lib/use-toast";
import { Toaster } from "@/components/ui/toaster";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "FolioHub";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://foliohub.co";

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
  description: "Your personal landing page that converts attention into opportunities.",
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: "website",
    siteName: APP_NAME,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans`}>
        <ToastContextProvider>
          {children}
          <Toaster />
        </ToastContextProvider>
      </body>
    </html>
  );
}
