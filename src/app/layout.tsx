import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tiltq",
  description: "Your ultimate League of Legends companion for those heated moments",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/tiltqimage.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/tiltqimage.svg",
        type: "image/svg+xml",
      }
    ],
    apple: [
      {
        url: "/tiltqimage.png",
        sizes: "180x180",
      },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-G2VV5BNMN2`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G2VV5BNMN2');
          `}
        </Script>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/tiltqimage.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/tiltqimage.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/tiltqimage.png" sizes="180x180" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
