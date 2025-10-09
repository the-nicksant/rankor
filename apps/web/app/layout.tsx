import React from 'react'
import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

const geist = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rankor",
  description: "Transforme seus eventos, levante lutadores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={geist.className}>{children}</body>
    </html>
  );
}
