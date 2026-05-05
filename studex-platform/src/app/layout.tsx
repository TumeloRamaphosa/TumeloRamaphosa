import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudExClaw | Cognitive Brain + Agentic Force for Africa",
  description:
    "The most powerful agentic SaaS platform in Africa. Tencent Cloud powered, NVIDIA accelerated, Vertex AI integrated. Three persistent AI agents, one cognitive brain.",
  keywords: [
    "StudEx",
    "AI Agents",
    "Tencent Cloud",
    "NVIDIA",
    "Africa",
    "SaaS",
    "Cognitive Brain",
    "RAG",
  ],
  openGraph: {
    title: "StudExClaw | Agentic Force for Africa",
    description: "Three persistent agents. One cognitive brain. 60-75% lower TCO.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cyber-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
