// Contact types + normalisation. Used by the import script, API routes, and admin UI.

export type ContactTier = "A" | "B" | "C" | "D";
export type ContactStatus =
  | "lead" | "ready" | "contacted" | "responded"
  | "customer" | "rejected" | "unsubscribed" | "bounced";

export interface Contact {
  id?: string;
  name: string;
  email: string | null;
  website: string | null;
  business_type: string | null;
  tier: ContactTier | null;
  region: string | null;
  country: string | null;
  product_interest: string[];
  priority: number | null;
  biltong_score: number | null;
  website_score: number | null;
  status: ContactStatus;
  notes: string | null;
  tags: string[];
  source: string[];
  listmonk_subscriber_id?: number | null;
  contacted_at?: string | null;
  last_opened_at?: string | null;
  last_clicked_at?: string | null;
}

// Map flexible CSV header names to canonical fields.
const HEADER_MAP: Record<string, keyof RawContact> = {
  name: "name", business: "name", company: "name",
  email: "email", "e-mail": "email",
  website: "website", url: "website", site: "website",
  type: "business_type", "business type": "business_type",
  category: "tier", tier: "tier",
  region: "region", province: "region",
  country: "country",
  product: "product", products: "product", "product interest": "product",
  priority: "priority",
  biltong_score: "biltong_score", "biltong score": "biltong_score",
  website_score: "website_score", "website score": "website_score",
  status: "status_in",
  notes: "notes", comment: "notes", comments: "notes",
};

type RawContact = {
  name?: string;
  email?: string;
  website?: string;
  business_type?: string;
  tier?: string;
  region?: string;
  country?: string;
  product?: string;
  priority?: string;
  biltong_score?: string;
  website_score?: string;
  status_in?: string;
  notes?: string;
};

const VALID_TIERS = new Set<ContactTier>(["A", "B", "C", "D"]);

export function normalizeRow(row: Record<string, string>, source: string): Contact | null {
  const raw: RawContact = {};
  for (const [k, v] of Object.entries(row)) {
    const key = HEADER_MAP[k.trim().toLowerCase()];
    if (key && v) raw[key] = v;
  }
  let name = (raw.name || "").trim();
  // Fall back to website host if no explicit name (e.g. scraped JSON of {website, email}).
  if (!name && raw.website) {
    try { name = new URL(/^https?:/i.test(raw.website) ? raw.website : "https://" + raw.website).host.replace(/^www\./, ""); } catch {}
  }
  if (!name) return null;

  const email = normalizeEmail(raw.email);
  const website = normalizeWebsite(raw.website);
  const tierUpper = (raw.tier || "").trim().toUpperCase().charAt(0) as ContactTier;
  const tier = VALID_TIERS.has(tierUpper) ? tierUpper : null;

  // status_in: "ready" / "pending" / "scraped" -> our status enum
  let status: ContactStatus = "lead";
  const statusRaw = (raw.status_in || "").trim().toLowerCase();
  if (statusRaw === "ready") status = "ready";
  else if (statusRaw === "contacted") status = "contacted";

  return {
    name,
    email,
    website,
    business_type: (raw.business_type || "").trim() || null,
    tier,
    region: (raw.region || "").trim() || null,
    country: (raw.country || "").trim() || null,
    product_interest: parseProducts(raw.product),
    priority: toInt(raw.priority),
    biltong_score: toInt(raw.biltong_score),
    website_score: toInt(raw.website_score),
    status,
    notes: (raw.notes || "").trim() || null,
    tags: [],
    source: [source],
  };
}

export function normalizeEmail(v?: string): string | null {
  if (!v) return null;
  const trimmed = v.trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
  return trimmed;
}

export function normalizeWebsite(v?: string): string | null {
  if (!v) return null;
  let s = v.trim();
  if (!s || s.toUpperCase() === "N/A") return null;
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try {
    const u = new URL(s);
    return u.protocol + "//" + u.host.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

function parseProducts(v?: string): string[] {
  if (!v) return [];
  return v
    .split(/[+,/]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toInt(v?: string): number | null {
  if (!v) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

// Stable dedup key: prefer email; otherwise name+host.
export function dedupKey(c: Pick<Contact, "name" | "email" | "website">): string {
  if (c.email) return `e:${c.email}`;
  try {
    const host = c.website ? new URL(c.website).host : "";
    return `nw:${c.name.toLowerCase()}|${host}`;
  } catch {
    return `n:${c.name.toLowerCase()}`;
  }
}

// Merge two records of the same contact across files. Prefer non-empty values,
// union arrays, max numeric scores, "best" status (ready beats lead).
const STATUS_RANK: Record<ContactStatus, number> = {
  lead: 0, ready: 1, contacted: 2, responded: 3,
  customer: 4, rejected: 5, unsubscribed: 6, bounced: 7,
};

export function mergeContacts(a: Contact, b: Contact): Contact {
  const pickStr = (x: string | null, y: string | null) => x || y;
  const pickNum = (x: number | null, y: number | null) =>
    x == null ? y : y == null ? x : Math.max(x, y);
  return {
    name: a.name.length >= b.name.length ? a.name : b.name,
    email: a.email || b.email,
    website: a.website || b.website,
    business_type: pickStr(a.business_type, b.business_type),
    tier: pickStr(a.tier, b.tier) as ContactTier | null,
    region: pickStr(a.region, b.region),
    country: pickStr(a.country, b.country),
    product_interest: Array.from(new Set([...a.product_interest, ...b.product_interest])),
    priority: pickNum(a.priority, b.priority),
    biltong_score: pickNum(a.biltong_score, b.biltong_score),
    website_score: pickNum(a.website_score, b.website_score),
    status:
      STATUS_RANK[a.status] >= STATUS_RANK[b.status] ? a.status : b.status,
    notes: a.notes && b.notes && a.notes !== b.notes
      ? `${a.notes}\n${b.notes}` : a.notes || b.notes,
    tags: Array.from(new Set([...a.tags, ...b.tags])),
    source: Array.from(new Set([...a.source, ...b.source])),
  };
}

// Map a contact to the Listmonk lists it belongs in (by env var name).
// Returns env-var keys (e.g. LISTMONK_LIST_TIER_A); caller resolves to numeric IDs.
export function listmonkSegments(c: Contact): string[] {
  const segs = new Set<string>();
  if (c.tier === "A") segs.add("LISTMONK_LIST_TIER_A");
  if (c.tier === "B") segs.add("LISTMONK_LIST_TIER_B");
  if (c.country?.toUpperCase() === "SA") segs.add("LISTMONK_LIST_SA");
  if (c.country && c.country.toUpperCase() !== "SA") segs.add("LISTMONK_LIST_AFRICA");
  if (c.product_interest.some((p) => /biltong/i.test(p))) segs.add("LISTMONK_LIST_MEAT");
  return [...segs];
}
