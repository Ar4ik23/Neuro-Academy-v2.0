import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DynamicBackground } from "@/components/DynamicBackground";
import { AuthInit } from "@/components/AuthInit";
import { VipBadge } from "@/components/VipBadge";
import { ScrollReset } from "@/components/ScrollReset";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Franklin Learning | TWA",
  description: "Advanced Cognitive Training Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <head />
      <body className={`${inter.className} text-[#fef9f0] antialiased bg-[#05060d]`}
        style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {/* Telegram WebApp SDK — beforeInteractive loads it before React hydration */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <div
          id="app-container"
          className="w-full max-w-[480px] sm:max-w-[600px] md:max-w-[900px] lg:max-w-full overflow-hidden shadow-2xl border-x border-[rgba(255,255,255,0.07)] lg:border-x-0 lg:shadow-none"
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {/* Layer 1 — background image, slightly softened */}
          <div
            id="app-bg-layer"
            className="absolute inset-0 z-0"
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center 100%',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(2px) brightness(0.78)',
              transform: 'scale(1.03)',
              transformOrigin: 'center',
            }}
          />

          {/* Layer 2 — soft gradient overlay */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(10,14,42,0.42) 0%, rgba(10,14,42,0.18) 38%, rgba(10,14,42,0.52) 100%)',
            }}
          />

          <DynamicBackground />
          <ScrollReset />
          <AuthInit />

          {/* Header — pinned to top, never shifts */}
          <header
            className="absolute top-0 left-0 right-0 px-6 border-b z-20 flex items-center justify-between"
            style={{
              height: 52,
              background: 'rgba(18,22,58,0.52)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderColor: 'rgba(180,200,255,0.08)',
            }}
          >
            <div className="text-[10px] font-black tracking-[0.2em] text-[#f59e0b] uppercase">
              Franklin Learning
            </div>
            <VipBadge />
          </header>

          {/* Main — fills the space between header and nav, never causes reflow */}
          <main
            className="absolute left-0 right-0 overflow-y-auto z-10"
            style={{ top: 52, bottom: 64 }}
          >
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>

          <BottomNav />
        </div>
      </body>
    </html>
  );
}
