import type { Metadata } from "next";
import { Onest, Unbounded } from "next/font/google";
import "./globals.css";

/** Заголовки — выразительный бесплатный шрифт с кириллицей */
const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

/** Текст интерфейса */
const body = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "StudioGate — доступы Figma и Higgsfield без паролей",
  description:
    "Выдавайте фрилансерам доступ к Figma и Higgsfield без передачи паролей. Отзыв в один клик. Учёт AI-затрат по проектам.",
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
