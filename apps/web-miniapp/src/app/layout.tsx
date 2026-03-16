import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
      <body className={`${inter.className} bg-[#0e0d0c] text-[#fef9f0] min-h-screen antialiased flex items-center justify-center`}>
        <div className="w-full max-w-[480px] h-screen bg-[#0e0d0c] flex flex-col relative overflow-hidden shadow-2xl border-x border-[rgba(255,255,255,0.07)]">
          {/* Header */}
          <header className="px-6 py-4 border-b border-[rgba(255,255,255,0.07)] shrink-0 glass rounded-none">
            <div className="text-[10px] font-black tracking-[0.2em] text-[#f59e0b] uppercase">
              Neuro-Academy
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
