import "./globals.css";
import localFont from "next/font/local";
import { Megrim } from "next/font/google";
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
const megrim = Megrim({
    subsets: ["latin"],
    weight: "400", // Megrim has a single weight
});

export const metadata = {
    title: "Megrim",
    description: "Megrim Management Platform",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppBar megrimFont={megrim.className} />
        <main className="min-h-screen flex flex-col">{children}</main>
        <Footer />
        </body>
        </html>
    );
}
