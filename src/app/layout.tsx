import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import AppBar from "@/components/ui/core/AppBar";
import Footer from "@/components/ui/core/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Barzzy",
  description: "Barzzy Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppBar/>
        <main className="min-h-screen flex flex-col">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
