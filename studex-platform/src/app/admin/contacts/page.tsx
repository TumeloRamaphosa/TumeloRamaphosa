// /admin/contacts — CRM dashboard. Server-renders the filtered table
// then hands off interactivity to ContactsTable.
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import ContactsTable from "./ContactsTable";
import type { Contact } from "@/lib/contacts";

type Search = { tier?: string; country?: string; status?: string; product?: string; has_email?: string; search?: string };

export default async function ContactsPage({ searchParams }: { searchParams: Promise<Search> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const sb = getServiceSupabase();
  const sp = await searchParams;

  let contacts: Contact[] = [];
  let total = 0;
  let summary: Record<string, number> = {};
  let dbError: string | null = null;

  if (!sb) {
    dbError = "Supabase env vars not set. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local.";
  } else {
    let q = sb.from("contacts").select("*", { count: "exact" });
    if (sp.tier) q = q.eq("tier", sp.tier);
    if (sp.country) q = q.eq("country", sp.country);
    if (sp.status) q = q.eq("status", sp.status);
    if (sp.product) q = q.contains("product_interest", [sp.product]);
    if (sp.has_email === "1") q = q.not("email", "is", null);
    if (sp.search) q = q.or(`name.ilike.%${sp.search}%,email.ilike.%${sp.search}%,website.ilike.%${sp.search}%`);

    const { data, count, error } = await q
      .order("priority", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(0, 199);
    if (error) {
      dbError = error.message;
    } else {
      contacts = (data || []) as Contact[];
      total = count || 0;

      // Summary tiles
      const { data: all } = await sb.from("contacts").select("tier,country,status,email");
      const rows = all || [];
      summary = {
        total: rows.length,
        with_email: rows.filter((r) => r.email).length,
        ready: rows.filter((r) => r.status === "ready").length,
        contacted: rows.filter((r) => r.status === "contacted").length,
        tier_a: rows.filter((r) => r.tier === "A").length,
        tier_b: rows.filter((r) => r.tier === "B").length,
      };
    }
  }

  return (
    <main className="min-h-screen bg-cyber-black px-4 py-10 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-black">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-orange to-cyber-pink">STUDEX</span>{" "}
              <span className="text-cyber-cyan">Contacts CRM</span>
            </h1>
            <p className="font-mono text-sm text-gray-500 mt-1">
              B2B prospects, newsletter signups, and customers.
            </p>
          </div>
          <form action="/admin/login" method="post" className="inline">
            <a href="/" className="font-mono text-xs text-gray-500 hover:text-cyber-cyan">&larr; site</a>
          </form>
        </header>

        {dbError && (
          <div className="mb-6 p-4 rounded-lg border border-red-500/40 bg-red-500/10 font-mono text-sm text-red-300">
            {dbError}
          </div>
        )}

        {!dbError && (
          <>
            <SummaryTiles summary={summary} />
            <ContactsTable contacts={contacts} total={total} search={sp} />
          </>
        )}
      </div>
    </main>
  );
}

function SummaryTiles({ summary }: { summary: Record<string, number> }) {
  const tiles = [
    { label: "Total contacts", value: summary.total ?? 0, color: "text-cyber-cyan" },
    { label: "With email", value: summary.with_email ?? 0, color: "text-cyber-green" },
    { label: "Ready", value: summary.ready ?? 0, color: "text-cyber-orange" },
    { label: "Contacted", value: summary.contacted ?? 0, color: "text-cyber-pink" },
    { label: "Tier A", value: summary.tier_a ?? 0, color: "text-cyber-magenta" },
    { label: "Tier B", value: summary.tier_b ?? 0, color: "text-cyber-purple" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-xl border border-white/10 bg-cyber-dark/40 p-4">
          <div className={`font-display text-2xl font-black ${t.color}`}>{t.value}</div>
          <div className="font-mono text-[11px] text-gray-500 uppercase tracking-wider mt-1">{t.label}</div>
        </div>
      ))}
    </div>
  );
}
