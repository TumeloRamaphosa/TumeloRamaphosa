import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-9 text-sm text-muted md:flex-row">
        <span className="flex items-center gap-2.5 font-display font-semibold text-ink">
          <span className="handled-dot" /> StudEx Ai OS
        </span>
        <span>An agent-run operating system. Built in South Africa, for the world.</span>
        <div className="flex flex-wrap gap-5">
          <Link href="/" className="hover:text-ink">StudEx Ai OS</Link>
          <Link href="/safesight" className="hover:text-ink">SafeSight</Link>
          <Link href="/demo" className="hover:text-ink">LAISA dashboard</Link>
        </div>
      </div>
    </footer>
  );
}
