"use client";

import "./globals.css";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-950 text-slate-100">
      <body className={`${inter.className} min-h-screen`}>
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
