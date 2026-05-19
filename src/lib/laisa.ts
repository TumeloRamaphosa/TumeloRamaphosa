import type { Brand } from "@/lib/brand";

// Unified LAISA platform theme — the same brand at night.
// Warm-charcoal dark per DESIGN.md ("my business runs itself"):
// evergreen primary, signal green, muted sand accent.
export const LAISA: Brand = {
  key: "laisa",
  name: "LAISA",
  tagline: "One operating system — SafeSight (eye) + Aesthetics, unified",
  bg: "#16140f",
  card: "#1e1b15",
  border: "rgba(242,238,230,0.12)",
  primary: "#2e6b54",
  primaryDark: "#3fbe85",
  accent: "#d4b574",
  muted: "#a39a87",
  text: "#f2eee6",
};

export type Unit = "all" | "eye" | "aesthetics";

export const UNITS: { key: Unit; label: string }[] = [
  { key: "all", label: "All — combined" },
  { key: "eye", label: "SafeSight · Eye" },
  { key: "aesthetics", label: "LAISA · Aesthetics" },
];
