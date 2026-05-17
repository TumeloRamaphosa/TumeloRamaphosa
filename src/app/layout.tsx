import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudEx Ai OS — Your business, on autopilot",
  description:
    "StudEx Ai OS is an agent-run operating system for your business. It unifies WhatsApp, email, payments, billing, social and content into one dashboard — and gets smarter every week.",
  keywords: [
    "AI agents",
    "business operating system",
    "automation",
    "South Africa",
    "SaaS",
    "agentic AI",
    "SafeSight",
  ],
  openGraph: {
    title: "StudEx Ai OS — Your business, on autopilot",
    description:
      "An operating system, staffed by agents that work 24/7 and get smarter every week.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink text-text antialiased">{children}</body>
    </html>
  );
}
