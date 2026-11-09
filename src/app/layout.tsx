import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { PostHogProvider } from "@/components/posthog-provider";
import { ThemeProvider } from "@/components/theme-provider";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = localFont({ src: "./fonts/GeistVF.woff", variable: "--font-body", weight: "100 900", display: "swap" });
const mono = localFont({ src: "./fonts/GeistMonoVF.woff", variable: "--font-mono", weight: "100 900", display: "swap" });

export const metadata: Metadata = {
  title: "Kaneshwar Sharma | Senior Full-Stack Engineer",
  description:
    "Senior full-stack engineer. Python and Go services, Kafka pipelines, React and Next.js front ends, AWS and GCP infrastructure that hold at scale.",
  keywords: ["full-stack engineer", "backend engineer", "software engineer", "cloud", "scalable systems", "distributed systems"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c0f" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'){document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] btn btn-accent">
          Skip to content
        </a>
        <ThemeProvider>
          <PostHogProvider>
            <Navigation />
            <main id="main">{children}</main>
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
