import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Youth Camp 2025 - Attendance System",
  description: "Sistem absensi digital untuk Youth Camp 2025 dengan tema 'Knowledge, Faith and Character are. The Ultimate Goals of Education.' Dilengkapi dengan foto verifikasi dan monitoring real-time.",
  keywords: ["Youth Camp 2025", "Attendance System", "Absensi Digital", "Education", "Character Building", "Knowledge", "Faith", "School Management"],
  authors: [{ name: "IT Team - Sekolah Harapan Bangsa" }],
  creator: "IT Team - Sekolah Harapan Bangsa",
  publisher: "Sekolah Harapan Bangsa",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Youth Camp 2025 - Attendance System",
    description: "Sistem absensi digital untuk Youth Camp 2025 dengan tema 'Knowledge, Faith and Character are. The Ultimate Goals of Education.'",
    url: "https://youthcamp2025.vercel.app",
    siteName: "Youth Camp 2025",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Youth Camp 2025 - Knowledge, Faith and Character",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Youth Camp 2025 - Attendance System",
    description: "Sistem absensi digital untuk Youth Camp 2025 dengan tema 'Knowledge, Faith and Character are. The Ultimate Goals of Education.'",
    images: ["/logo.svg"],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  category: "Education",
  classification: "Education Management System",
  referrer: "origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="application-name" content="Youth Camp 2025" />
        <meta name="apple-mobile-web-app-title" content="Youth Camp 2025" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
