import type { Brand } from "@/lib/brand";

// Unified LAISA platform theme — one dashboard, both business units.
// Cinematic dark + medical teal/emerald (guided by ui-ux-pro-max
// "Medical Clinic" palette, taken premium/dark for the presentation).
export const LAISA: Brand = {
  key: "laisa",
  name: "LAISA",
  tagline: "One operating system — SafeSight (eye) + Aesthetics, unified",
  bg: "#070b10",
  card: "#0e1620",
  border: "#1d2b38",
  primary: "#22D3EE",
  primaryDark: "#0891B2",
  accent: "#34D399",
  muted: "#7d93a6",
  text: "#eef5f8",
};

export type Unit = "all" | "eye" | "aesthetics";

export const UNITS: { key: Unit; label: string }[] = [
  { key: "all", label: "All — combined" },
  { key: "eye", label: "SafeSight · Eye" },
  { key: "aesthetics", label: "LAISA · Aesthetics" },
];
