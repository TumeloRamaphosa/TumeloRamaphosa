"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Nav({
  links,
  brand = "LAISA",
  cta = { label: "Book a walkthrough", href: "#contact" },
}: {
  links: { label: string; href: string }[];
  brand?: string;
  cta?: { label: string; href: string };
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight font-display">
          <span className="text-teal">◐</span> {brand}
        </Link>
        <nav className="ml-auto hidden gap-8 text-sm text-muted md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-text">
              {l.label}
            </a>
          ))}
        </nav>
        <a href={cta.href} className="ml-auto md:ml-0">
          <Button size="sm">{cta.label}</Button>
        </a>
      </div>
    </header>
  );
}
