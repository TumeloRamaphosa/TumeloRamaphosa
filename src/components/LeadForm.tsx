"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LeadForm({ source = "laisa" }: { source?: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          company: form.get("company"),
          message: form.get("message"),
          source,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setState("done");
      setMessage("Thank you — we'll be in touch within one business day.");
    } catch (err) {
      setState("error");
      setMessage(
        err instanceof Error ? err.message : "Something went wrong. Please retry."
      );
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-[14px] border border-signal/30 bg-signal/5 p-8 text-center">
        <p className="flex items-center justify-center gap-2 text-lg font-semibold text-signal">
          <span className="handled-dot" />
          {message}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="name" placeholder="Your name" required />
        <Input name="email" type="email" placeholder="Work email" required />
      </div>
      <Input name="company" placeholder="Company / practice name" />
      <textarea
        name="message"
        rows={3}
        placeholder="What would you like StudEx Ai OS to run for you?"
        className="flex w-full rounded-[10px] border border-line bg-surface-2 px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:border-signal/50 focus:outline-none focus:ring-2 focus:ring-signal/30 transition-colors"
      />
      <Button type="submit" size="lg" disabled={state === "loading"}>
        {state === "loading" ? "Sending…" : "Book a walkthrough"}
      </Button>
      {state === "error" && (
        <p className="text-sm text-red-400">{message}</p>
      )}
      <p className="text-xs text-muted">
        We only use your details to contact you about StudEx Ai OS. No spam, ever.
      </p>
    </form>
  );
}
