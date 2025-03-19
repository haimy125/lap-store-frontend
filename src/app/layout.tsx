// src/app/layout.tsx
"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Product } from "@/types/product";

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

  const [, setSearchResults] = useState<Product[]>([]);

  return (
    <html lang="en" className="bg-gray-900 text-gray-300 ">
      {/* <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function (c, s, q, u, a, r, e) {
              c.hj=c.hj||function(){(c.hj.q=c.hj.q||[]).push(arguments)};
              c._hjSettings = { hjid: a };
              r = s.getElementsByTagName('head')[0];
              e = s.createElement('script');
              e.async = true;
              e.src = q + c._hjSettings.hjid + u;
              r.appendChild(e);
          })(window, document, 'https://static.hj.contentsquare.net/c/csq-', '.js', 5341733);
          `,
          }}
        />
      </head> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen shadow-md`}
      >
        <Header onSearchResults={setSearchResults} />{" "}
        {/* Pass the state updater function */}
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
