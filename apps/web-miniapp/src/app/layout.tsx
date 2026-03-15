import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="dark">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body dir="ltr" className={`${inter.className} bg-slate-900 text-slate-50 antialiased flex items-center justify-center min-h-screen`}>
        <div className="w-full max-w-[480px] h-screen bg-slate-950 flex flex-col relative overflow-hidden shadow-2xl border-x border-white/5">
          <header className="px-6 py-4 border-b border-white/10 shrink-0 backdrop-blur-md bg-white/5">
            <div className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase">
              Neuro-Academy
            </div>
          </header>
          <main className="flex-1 overflow-y-auto pb-[70px]">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
