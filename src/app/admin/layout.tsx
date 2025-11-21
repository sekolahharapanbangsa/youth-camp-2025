import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - Youth Camp 2025",
  description: "Panel administrasi untuk mengelola data siswa, kehadiran, dan laporan Youth Camp 2025.",
  keywords: ["Admin Panel", "Youth Camp 2025", "Education Management", "School Administration"],
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Admin Panel - Youth Camp 2025",
    description: "Panel administrasi untuk mengelola data siswa, kehadiran, dan laporan Youth Camp 2025.",
    type: "website",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}