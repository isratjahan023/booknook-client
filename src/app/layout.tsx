import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

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
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-[#faf7ef] font-sans text-[#23452f] antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}