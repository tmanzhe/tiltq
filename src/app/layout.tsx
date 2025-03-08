import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
