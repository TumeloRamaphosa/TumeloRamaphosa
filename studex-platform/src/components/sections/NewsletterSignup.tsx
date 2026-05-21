"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ListKey = "agent" | "meat" | "both";

const OPTIONS: { key: ListKey; label: string }[] = [
  { key: "agent", label: "Agent Service" },
  { key: "meat", label: "StudEx Meat" },
  { key: "both", label: "Both" },
];

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [list, setList] = useState<ListKey>("agent");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, list }),
      });
      const data = await res.json();
      if (res.ok) {
        setState("done");
        setMessage(data.message || "You're in. Check your inbox to confirm.");
        setEmail("");
      } else {
        setState("error");
        setMessage(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setState("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-cyber-dark/40 p-6 md:p-8 backdrop-blur-sm">
      <h4 className="font-display text-xl font-black text-white">
        Join the{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-orange to-cyber-pink">
          launch list
        </span>
      </h4>
      <p className="font-mono text-sm text-gray-500 mt-2 mb-5">
        Launch-day offers for StudEx Meat and Agent-as-a-Service. No spam, unsubscribe anytime.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setList(o.key)}
            className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-md border transition-colors ${
              list === o.key
                ? "border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10"
                : "border-white/10 text-gray-500 hover:text-gray-300"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "loading"}
          aria-label="Email address"
        />
        <Button type="submit" variant="orange" disabled={state === "loading"} className="shrink-0">
          {state === "loading" ? "Joining…" : "Notify me"}
        </Button>
      </form>

      {message && (
        <p
          className={`font-mono text-xs mt-3 ${
            state === "error" ? "text-red-400" : "text-cyber-green"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
