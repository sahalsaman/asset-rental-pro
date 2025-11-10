

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast'
import { Analytics } from "@vercel/analytics/next"
import { app_config } from "../../app-config";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: 'Rental Property Management - Efficient Solutions for Landlords',
  description: 'Discover top-tier rental property management services designed to maximize your rental income, simplify tenant management, streamline rent collection, and reduce operational hassles.',
  keywords: 'rental property management, rent business,property managent, rent invoice, real estate management, pg management, hostel management, apartment management, rent collection, flat management, tenant screening, maintenance services, landlord solutions, WEBCOS',
  authors: [{ name: 'WEBCOS', url: 'https://webcos.co' }],
  creator: 'WEBCOS',
  publisher: 'WEBCOS',
  applicationName: 'Rental Property Management',
  category: 'Real Estate',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/en-IN',
    },
  },
  openGraph: {
    title: 'Rental Property Management - Maximize Rental Income',
    description: 'Professional rental property management application. From tenant screening to rent collection, we handle it all for landlords and property owners.',
    url: 'https://rentities.in',
    siteName: 'WEBCOS',
    images: [
      {
        url: '../../public/logo green.png',
        width: 1200,
        height: 630,
        alt: 'Rental Property Management Solutions',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rental Property Management - Efficient Solutions',
    description: 'Simplify your rental management with ARP. Maximize profits, minimize hassle.',
    images: ['../../public/logo green.png'],
    creator: '@webcos',
  },
  // verification: {
  //   google: 'your-google-site-verification-code',
  // },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>{app_config.APP_NAME} – Smart Rental Management</title>
        <meta name="description" content="Automate rent collection, track maintenance, and manage properties effortlessly." />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >{children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}

