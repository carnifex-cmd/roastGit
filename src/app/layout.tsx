import "./globals.css";
import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { WebVitals } from "@/components/WebVitals";
import { Analytics } from "@vercel/analytics/next";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://roastgit.in"),
  title: {
    default: "RoastGit | AI-Powered GitHub Profile Roasts | Free Developer Tool",
    template: "%s | RoastGit",
  },
  description:
    "Get an honest, AI-generated roast of your GitHub profile. Analyze your repos, commits, and activity — no sign-up required.",
  keywords: [
    "github roast",
    "github profile review",
    "roast my github",
    "ai code review",
    "github analyzer",
    "developer tools",
    "github profile roast",
  ],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://roastgit.in",
    siteName: "RoastGit",
    title: "RoastGit | AI-Powered GitHub Profile Roasts",
    description:
      "Get an honest AI roast of your GitHub profile. Repos, commits, and activity analyzed.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RoastGit | AI-Powered GitHub Profile Roasts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoastGit | AI-Powered GitHub Profile Roasts",
    description: "Get your GitHub honestly reviewed by AI.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://roastgit.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <body className="antialiased">
        <WebVitals />
        <div className="min-h-screen">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}

