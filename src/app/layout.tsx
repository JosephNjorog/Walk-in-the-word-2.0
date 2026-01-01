import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

export const metadata: Metadata = {
  title: "Walk in the Word | Daily Bible Reading & Accountability",
  description: "Transform your daily Scripture reading into an engaging, accountable, and spiritually enriching experience. Join thousands growing in faith through daily Bible reading and community accountability.",
  keywords: ["Bible", "Scripture", "Daily Reading", "Christian", "Faith", "Accountability", "Bible Study"],
  authors: [{ name: "Walk in the Word" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Walk in the Word",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Walk in the Word | Daily Bible Reading & Accountability",
    description: "Transform your daily Scripture reading into an engaging experience.",
    type: "website",
    siteName: "Walk in the Word",
  },
  twitter: {
    card: "summary_large_image",
    title: "Walk in the Word | Daily Bible Reading",
    description: "Transform your daily Scripture reading into an engaging experience.",
  },
  icons: {
    icon: [
      { url: "/icons/icon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/icon-152x152.svg", sizes: "152x152", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Walk in the Word" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="min-h-screen">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="3a894f89-aae2-423c-88d1-bd3f6d1416e7"
        />
        {children}
        <Toaster position="top-right" richColors />
        <PWAInstallPrompt />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
