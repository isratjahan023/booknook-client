import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ThemeProvider from "@/components/ThemeProvider";

const headingFont = Cormorant_Garamond({
  variable: "--font-booknook-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bodyFont = DM_Sans({
  variable: "--font-booknook-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BookNook | Home",
    template: "BookNook | %s",
  },
  description: "Discover, borrow, and share books with BookNook.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Suspense
              fallback={
                <header className="h-20 border-b border-border bg-background" />
              }
            >
              <Navbar />
            </Suspense>

            <div className="flex-1">
              <Suspense
                fallback={
                  <div
                    role="status"
                    className="flex min-h-[60vh] items-center justify-center gap-3"
                  >
                    <span
                      aria-hidden="true"
                      className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
                    />
                    Loading...
                  </div>
                }
              >
                {children}
              </Suspense>
            </div>

            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}