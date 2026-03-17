import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DynamicBackground } from "@/components/DynamicBackground";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Neuro Academy | TWA",
  description: "Advanced Cognitive Training Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} text-[#fef9f0] min-h-screen antialiased flex items-center justify-center bg-[#05060d]`}>
        <div
          id="app-container"
          className="w-full max-w-[480px] h-screen flex flex-col relative overflow-hidden shadow-2xl border-x border-[rgba(255,255,255,0.07)]"
        >
          {/* Layer 1 — background image, slightly softened. Filter here only, not on container */}
          <div
            id="app-bg-layer"
            className="absolute inset-0 z-0"
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center 100%',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(2px) brightness(0.78)',
              transform: 'scale(1.03)', /* hide blur edges */
              transformOrigin: 'center',
            }}
          />

          {/* Layer 2 — soft gradient overlay: keeps background visible */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(10,14,42,0.42) 0%, rgba(10,14,42,0.18) 38%, rgba(10,14,42,0.52) 100%)',
            }}
          />

          {/* Dynamic background client logic */}
          <DynamicBackground />

          {/* Header — translucent glass, cool navy */}
          <header
            className="px-6 py-4 border-b shrink-0 relative z-10"
            style={{
              background: 'rgba(18,22,58,0.52)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderColor: 'rgba(180,200,255,0.08)',
            }}
          >
            <div className="text-[10px] font-black tracking-[0.2em] text-[#f59e0b] uppercase">
              Nero
            </div>
          </header>

          {/* Main */}
          <main className="flex-1 overflow-y-auto pb-16 relative z-10">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>

          <BottomNav />
        </div>
      </body>
    </html>
  );
}
