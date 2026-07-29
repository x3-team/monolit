import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "StudioGate",
  description:
    "Give freelancers Figma & Higgsfield access without sharing passwords. One-click revoke.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
