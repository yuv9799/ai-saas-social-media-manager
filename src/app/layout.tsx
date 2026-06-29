import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnnounceBanner } from "@/components/AnnounceBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SocialPulse AI — AI-Powered Social Media Management",
  description:
    "Write, schedule, and analyse social media posts across Instagram, LinkedIn, X, TikTok, and Pinterest with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${syne.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <div className="relative min-h-screen bg-ink grain-overlay">
            <div className="glow-orb" />
            <AnnounceBanner />
            <Navbar />
            <main className="relative z-10 flex-1">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}