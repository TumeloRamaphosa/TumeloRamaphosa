import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-2">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-9 text-sm text-muted md:flex-row">
        <span className="flex items-center gap-2 font-display font-bold text-text">
          <span className="text-teal">◐</span> LAISA
        </span>
        <span>An agent-run operating system. Built in South Africa, for the world.</span>
        <div className="flex gap-5">
          <Link href="/" className="hover:text-text">LAISA</Link>
          <Link href="/safesight" className="hover:text-text">SafeSight</Link>
        </div>
      </div>
    </footer>
  );
}
