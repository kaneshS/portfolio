import type { Metadata, Viewport } from "next";
import { IM_Fell_English_SC, Alegreya, Caveat } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { PostHogProvider } from "@/components/posthog-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { MapReveal } from "@/components/map-reveal";

const display = IM_Fell_English_SC({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Alegreya({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand", display: "swap" });

export const metadata: Metadata = {
  title: "Kaneshwar Sharma | Senior Backend Engineer",
  description:
    "A Marauder's Map of systems built at scale: Python and Go backends, Kafka pipelines, AWS and GCP infrastructure.",
  keywords: ["backend engineer", "software engineer", "cloud", "scalable systems", "distributed systems"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9d9b3" },
    { media: "(prefers-color-scheme: dark)", color: "#1a140d" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${display.variable} ${body.variable} ${hand.variable}`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] btn btn-wax"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <PostHogProvider>
            <MapReveal />
            <Navigation />
            <main id="main">{children}</main>
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
