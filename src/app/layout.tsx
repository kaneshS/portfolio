import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { CursorGlow } from "@/components/cursor-glow";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Kaneshwar Sharma | Senior Backend Engineer",
  description:
    "Senior Backend Engineer specializing in scalable systems, cloud infrastructure, and real-time applications.",
  keywords: [
    "backend engineer",
    "software engineer",
    "cloud",
    "scalable systems",
    "distributed systems",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CursorGlow />
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
