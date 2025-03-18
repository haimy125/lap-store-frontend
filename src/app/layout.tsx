// src/app/layout.tsx (Client Component)
"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isDashboardPage = pathname === "/dashboard";

  return (
    <html lang="en" className="bg-gray-900 text-gray-300 ">
      {/* Thêm bg-gray-800 và text-gray-300 vào html để có nền xám đậm và chữ xám nhạt mặc định */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen shadow-md`}
      >
        <Header />
        <Breadcrumbs />
        <main
          className={`pt-8 sm:pt-16 flex-grow ${
            isDashboardPage ? "" : "container mx-auto max-w-7xl px-4"
          }`}
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
