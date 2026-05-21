"use client";

import { Badge } from "@/components/ui/badge";
import NewsletterSignup from "@/components/sections/NewsletterSignup";

export default function Footer() {
  return (
    <footer className="relative py-16 px-4 bg-cyber-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 max-w-2xl">
          <NewsletterSignup />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-black">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-orange to-cyber-pink">
                STUDEX
              </span>
              <span className="text-cyber-cyan">CLAW</span>
            </h3>
            <p className="font-mono text-sm text-gray-500 mt-3 max-w-md leading-relaxed">
              The most powerful agentic SaaS platform in Africa. Powered by Tencent Cloud,
              NVIDIA, and Google Vertex AI. Three persistent agents, one cognitive brain.
            </p>
            <div className="flex gap-2 mt-4">
              <Badge variant="default">TENCENT CLOUD</Badge>
              <Badge variant="green">NVIDIA</Badge>
              <Badge variant="pink">VERTEX AI</Badge>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm text-white font-bold uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2 font-mono text-sm text-gray-500">
              <li><a href="#" className="hover:text-cyber-cyan transition-colors">Products</a></li>
              <li><a href="/brain" className="hover:text-cyber-cyan transition-colors">Cognitive Brain</a></li>
              <li><a href="#" className="hover:text-cyber-cyan transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-cyber-cyan transition-colors">API Reference</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm text-white font-bold uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2 font-mono text-sm text-gray-500">
              <li><a href="#" className="hover:text-cyber-cyan transition-colors">About StudEx</a></li>
              <li><a href="#" className="hover:text-cyber-cyan transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-cyber-cyan transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-cyber-cyan transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-gray-600">
            &copy; {new Date().getFullYear()} StudEx Cognitive Brain. All rights reserved. Built for Africa.
          </p>
          <p className="font-mono text-xs text-gray-600">
            Deployed on <span className="text-cyber-cyan">Tencent Cloud</span> &bull; JNB1 Region
          </p>
        </div>
      </div>
    </footer>
  );
}
