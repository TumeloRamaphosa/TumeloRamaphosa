"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { Contact, ContactStatus } from "@/lib/contacts";

const STATUSES: ContactStatus[] = ["lead", "ready", "contacted", "responded", "customer", "rejected", "unsubscribed", "bounced"];
const TIERS = ["A", "B", "C", "D"];
const STATUS_COLOR: Record<ContactStatus, string> = {
  lead: "text-gray-400",
  ready: "text-cyber-orange",
  contacted: "text-cyber-pink",
  responded: "text-cyber-cyan",
  customer: "text-cyber-green",
  rejected: "text-red-400",
  unsubscribed: "text-gray-500",
  bounced: "text-red-400",
};

export default function ContactsTable({
  contacts,
  total,
  search,
}: {
  contacts: Contact[];
  total: number;
  search: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [actionState, setActionState] = useState<string>("");

  function updateFilter(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value); else p.delete(key);
    startTransition(() => router.push(`/admin/contacts?${p.toString()}`));
  }

  async function updateStatus(id: string, status: ContactStatus) {
    setActionState(`Updating ${id.slice(0, 6)}…`);
    const res = await fetch(`/api/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setActionState("Saved.");
      startTransition(() => router.refresh());
    } else {
      const j = await res.json().catch(() => ({}));
      setActionState(`Error: ${j.error || res.status}`);
    }
  }

  async function syncListmonk(dryRun: boolean) {
    setActionState(dryRun ? "Previewing Listmonk sync…" : "Syncing to Listmonk…");
    const res = await fetch("/api/contacts/sync-listmonk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dry_run: dryRun, tier: search.tier, country: search.country }),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      setActionState(`Listmonk: pushed ${j.stats.pushed}, already in ${j.stats.alreadyIn}, skipped ${j.stats.skipped}, failed ${j.stats.failed}.`);
      if (!dryRun) startTransition(() => router.refresh());
    } else {
      setActionState(`Error: ${j.error || res.status}`);
    }
  }

  async function runOutreach(dryRun: boolean) {
    setActionState(dryRun ? "Previewing outreach batch…" : "Sending outreach batch…");
    const res = await fetch("/api/contacts/outreach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dry_run: dryRun, batch_size: 25, tier: search.tier, country: search.country, product: search.product }),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      setActionState(`Outreach: picked ${j.stats.picked}, sent ${j.stats.sent}, failed ${j.stats.failed}.`);
      if (!dryRun) startTransition(() => router.refresh());
    } else {
      setActionState(`Error: ${j.error || res.status}`);
    }
  }

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4 p-4 rounded-xl border border-white/10 bg-cyber-dark/40">
        <input
          type="text"
          placeholder="Search name / email / website"
          defaultValue={search.search || ""}
          onKeyDown={(e) => e.key === "Enter" && updateFilter("search", (e.target as HTMLInputElement).value)}
          className="flex-1 min-w-[200px] h-9 rounded-md border border-white/10 bg-cyber-black px-3 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-cyber-cyan/50"
        />
        <Select label="Tier" value={search.tier || ""} options={["", ...TIERS]} onChange={(v) => updateFilter("tier", v)} />
        <Select label="Country" value={search.country || ""} options={["", "SA", "Tanzania", "Kenya", "Mozambique", "Botswana", "Namibia"]} onChange={(v) => updateFilter("country", v)} />
        <Select label="Status" value={search.status || ""} options={["", ...STATUSES]} onChange={(v) => updateFilter("status", v)} />
        <Select label="Product" value={search.product || ""} options={["", "Biltong", "Oats", "Wheat", "Coffee", "Biltong Snacks"]} onChange={(v) => updateFilter("product", v)} />
        <label className="inline-flex items-center gap-2 font-mono text-xs text-gray-400">
          <input type="checkbox" checked={search.has_email === "1"} onChange={(e) => updateFilter("has_email", e.target.checked ? "1" : "")} />
          has email
        </label>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button onClick={() => syncListmonk(true)} className="font-mono text-xs uppercase tracking-wider px-3 py-2 rounded-md border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/10">
          Sync to Listmonk (dry-run)
        </button>
        <button onClick={() => syncListmonk(false)} className="font-mono text-xs uppercase tracking-wider px-3 py-2 rounded-md bg-cyber-cyan text-black hover:bg-cyber-cyan/80">
          Sync to Listmonk
        </button>
        <button onClick={() => runOutreach(true)} className="font-mono text-xs uppercase tracking-wider px-3 py-2 rounded-md border border-cyber-pink/40 text-cyber-pink hover:bg-cyber-pink/10">
          Outreach batch (dry-run)
        </button>
        <button onClick={() => runOutreach(false)} className="font-mono text-xs uppercase tracking-wider px-3 py-2 rounded-md bg-cyber-pink text-white hover:bg-cyber-pink/80">
          Send outreach batch (25)
        </button>
        <div className="ml-auto font-mono text-xs text-gray-500">
          Showing {contacts.length} of {total}
        </div>
      </div>

      {actionState && (
        <div className="mb-3 font-mono text-xs text-cyber-green">{actionState}</div>
      )}
      {isPending && (
        <div className="mb-3 font-mono text-xs text-cyber-cyan">Loading…</div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full font-mono text-xs">
          <thead className="bg-cyber-dark/60 text-gray-400 uppercase tracking-wider">
            <tr>
              <Th>Name</Th><Th>Type</Th><Th>Tier</Th><Th>Country</Th>
              <Th>Email</Th><Th>Product</Th><Th>Pri</Th><Th>Status</Th><Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-t border-white/5 hover:bg-cyber-dark/30">
                <Td>
                  <div className="text-white">{c.name}</div>
                  {c.website && <a href={c.website} target="_blank" rel="noreferrer" className="text-cyber-cyan/70 hover:text-cyber-cyan text-[11px]">{c.website.replace(/^https?:\/\//, "")}</a>}
                </Td>
                <Td>{c.business_type || "—"}</Td>
                <Td>{c.tier || "—"}</Td>
                <Td>{c.country || "—"}</Td>
                <Td>{c.email ? <a className="text-cyber-cyan/80 hover:text-cyber-cyan" href={`mailto:${c.email}`}>{c.email}</a> : <span className="text-gray-600">—</span>}</Td>
                <Td>{c.product_interest.length ? c.product_interest.join(", ") : "—"}</Td>
                <Td>{c.priority ?? "—"}</Td>
                <Td><span className={STATUS_COLOR[c.status]}>{c.status}</span></Td>
                <Td>
                  <select
                    defaultValue=""
                    onChange={(e) => { if (e.target.value) updateStatus(c.id!, e.target.value as ContactStatus); }}
                    className="h-7 rounded border border-white/10 bg-cyber-black px-2 text-[11px] text-gray-300"
                  >
                    <option value="">set status…</option>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr><td colSpan={9} className="p-6 text-center text-gray-500">No contacts match this filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-3 py-2 font-mono text-[11px]">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 align-top text-gray-300">{children}</td>;
}
function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="inline-flex items-center gap-2 font-mono text-xs text-gray-400">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-8 rounded border border-white/10 bg-cyber-black px-2 text-xs text-gray-200">
        {options.map((o) => <option key={o} value={o}>{o || "—"}</option>)}
      </select>
    </label>
  );
}
