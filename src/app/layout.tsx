import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { TopNav } from "@/components/layout/TopNav";
import { MainNav } from "@/components/layout/MainNav";
import { StockTicker } from "@/components/layout/StockTicker";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Founder Diary — India's Leading Tech & Startup Media Platform",
  description: "Breaking news, in-depth analysis, and data-driven insights on India's startup ecosystem, technology trends, and venture capital landscape.",
  keywords: "startup news, Indian startups, funding rounds, tech news, venture capital, founder stories",
};

import { AuthProvider } from "@/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">
        <QueryProvider>
          <AuthProvider>
            {/* <TopNav /> */}
            <StockTicker />
            <MainNav />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
