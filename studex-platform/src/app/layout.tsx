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
      <body className="bg-gray-50 text-gray-900 antialiased">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-blue-600">StudEx</h1>
                <p className="text-sm text-gray-600">Agent Platform</p>
              </div>
              <div className="flex gap-6">
                <a href="/dashboard" className="text-sm font-medium hover:text-blue-600">Dashboard</a>
                <a href="/cyber-world" className="text-sm font-medium hover:text-cyan-600">Cyber World</a>
                <a href="/dark-factory" className="text-sm font-medium hover:text-amber-600">Dark Factory</a>
                <a href="/priorities" className="text-sm font-medium hover:text-blue-600">Priorities</a>
                <a href="/models" className="text-sm font-medium hover:text-blue-600">Models</a>
                <a href="/email" className="text-sm font-medium hover:text-blue-600">Email</a>
                <a href="/integrations" className="text-sm font-medium hover:text-blue-600">Integrations</a>
                <a href="/vm" className="text-sm font-medium hover:text-blue-600">VMs</a>
                <a href="/settings" className="text-sm font-medium hover:text-blue-600">Settings</a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
