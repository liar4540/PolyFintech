import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NETS Pulse — Pay, Discover, Connect",
  description:
    "Gen Z payment super-app powered by NETS. Discover trending merchants, split bills instantly, and gamify your spending journey.",
  keywords: ["NETS", "payment", "fintech", "Singapore", "cross-border", "QR", "split"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
