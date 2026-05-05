"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Brain, Zap } from "lucide-react";

const navLinks = [
  { href: "#stack", label: "Stack" },
  { href: "#pricing", label: "Pricing" },
  { href: "#consultants", label: "AI Consultants" },
  { href: "#devhub", label: "Dev Hub" },
  { href: "/brain", label: "Brain", highlight: true },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-orange via-cyber-pink to-cyber-cyan flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-lg font-black">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-orange to-cyber-pink">
              STUDEX
            </span>
            <span className="text-cyber-cyan">CLAW</span>
          </span>
          <Badge variant="default" className="hidden sm:flex text-[9px] py-0">
            v2.0
          </Badge>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`font-mono text-sm uppercase tracking-wider transition-colors ${
                link.highlight
                  ? "text-cyber-pink hover:text-cyber-pink/80"
                  : "text-gray-400 hover:text-cyber-cyan"
              }`}
            >
              {link.highlight && <Brain className="w-3 h-3 inline mr-1" />}
              {link.label}
            </Link>
          ))}
          <Button size="sm" variant="pink">
            Deploy Now
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-cyber-dark/95 backdrop-blur-xl border-b border-white/10 p-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block font-mono text-sm uppercase tracking-wider py-2 ${
                link.highlight ? "text-cyber-pink" : "text-gray-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button size="sm" variant="pink" className="w-full mt-2">
            Deploy Now
          </Button>
        </div>
      )}
    </nav>
  );
}
