

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./clientWraper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AssetRentalPro ",
  description: "Manage Your Rental Assets Seamlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >{children}

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 bg-white">
        © {new Date().getFullYear()} AssetRentalPro. All rights reserved.
      </footer>
      </body>
    </html>
  );
}

