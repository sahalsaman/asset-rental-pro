

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
   title: {
    default: "Rentities | Property Management App",
    template: "%s | Rentities",
  },
  description: 'Discover top-tier rental property management services designed to maximize your rental income, simplify tenant management, streamline rent collection, and reduce operational hassles.',
  keywords: 'rental property management, rent business,property managent, rent invoice, real estate management, pg management, hostel management, apartment management, rent collection, flat management, tenant screening, maintenance services, landlord solutions, WEBCOS',
  authors: [{ name: 'WEBCOS', url: 'https://webcos.co' }],
  creator: 'WEBCOS',
  publisher: 'WEBCOS',
  applicationName: 'Rentities - Property Management App',
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
    canonical: "https://rentities.in",
    languages: {
      "en-IN": "https://rentities.in/en-IN",
    },
  },
  openGraph: {
    title: 'Rental Property Management - Maximize Rental Income',
    description: 'Professional rental property management application. From tenant screening to rent collection, we handle it all for landlords and property owners.',
    url: 'https://rentities.in',
     siteName: "Rentities",
    images: [
      {
        url: '../../public/logo green.png',
        width: 1200,
        height: 630,
        alt: "Rentities - Rent Collection App",
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
       card: "summary_large_image",
    title: "Rentities | Rent Collection & Property Management App",
    description:
      "Simplify rent collection and tenant management with Rentities. For landlords, PGs, and hostel owners.",
    images: ["https://rentities.in/app-banner.webp"], 
    creator: "@webcos",
  },
   icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Rentities",
              operatingSystem: "Web, Android, iOS",
              applicationCategory: "FinanceApplication",
              description:
                "Rentities is a smart rent collection and property management app that automates rent payments, reminders, invoices, and tenant tracking for landlords.",
              url: "https://rentities.in",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "127",
              },
              publisher: {
                "@type": "Organization",
                name: "WEBCOS",
                url: "https://webcos.co",
                logo: "https://rentities.in/logo green.png",
              },
            }),
          }}
        />
      
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

