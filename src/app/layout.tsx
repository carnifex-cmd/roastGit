import "./globals.css";
import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "RoastGit — Tasteful GitHub Roasts",
  description: "Minimal, premium GitHub profile roasts with restraint.",
  icons: {
    icon: "/icon.png",
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <body className="antialiased">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
