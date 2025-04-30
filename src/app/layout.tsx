import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
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
  title: "TravelHub - Trouvez votre prochain voyage",
  description:
    "Recherchez et réservez des vols, hôtels et activités pour votre prochain voyage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-100 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} TravelHub - Tous droits réservés
          </div>
        </footer>
      </body>
    </html>
  );
}
