"use cache";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://soon.codetwine.dev";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Soon — Public Countdown by Link",
    template: "%s | Soon",
  },
  description:
    "Create a public countdown, share the link, and count down together with anyone.",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Soon — Public Countdown by Link",
    description:
      "Create a public countdown, share the link, and count down together.",
    type: "website",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Soon — Public Countdown by Link",
    description:
      "Create a public countdown, share the link, and count down together.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  cacheLife("max");
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-svh flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
