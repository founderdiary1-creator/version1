import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { MainNav } from "@/components/layout/MainNav";
import { StockTicker } from "@/components/layout/StockTicker";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/providers/AuthProvider";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://founderdiary.com'),
  title: {
    default: "Founder Diary | India's Startup Intelligence Network",
    template: "%s | Founder Diary",
  },
  description: "Breaking news, in-depth analysis, and data-driven insights on India's startup ecosystem, technology trends, and venture capital landscape.",
  keywords: ["startup news", "Indian startups", "funding rounds", "tech news", "venture capital", "founder stories"],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Founder Diary',
    images: [
      {
        url: '/images/og-default.jpeg',
        width: 1200,
        height: 630,
        alt: 'Founder Diary | Startup Intelligence',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};



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
            <Analytics />
            <MainNav />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
