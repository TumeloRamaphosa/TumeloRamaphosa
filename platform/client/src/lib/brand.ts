// Per-client brand themes. SafeSight = ophthalmology (clinical navy/teal).
// LAISA Aesthetics = aesthetics clinic (warm aubergine/rose-gold).
export type Brand = {
  key: "safesight" | "laisa";
  name: string;
  tagline: string;
  bg: string;
  card: string;
  border: string;
  primary: string;
  primaryDark: string;
  accent: string;
  muted: string;
  text: string;
};

export const BRANDS: Record<Brand["key"], Brand> = {
  safesight: {
    key: "safesight",
    name: "SafeSight",
    tagline: "Ophthalmology — diagnostics, surgery & laser vision correction",
    bg: "#0a1628",
    card: "#0d1f3c",
    border: "#1a3a5c",
    primary: "#0ABFBC",
    primaryDark: "#078d8b",
    accent: "#E8B86D",
    muted: "#8aa0c0",
    text: "#ffffff",
  },
  laisa: {
    key: "laisa",
    name: "LAISA Aesthetics",
    tagline: "Aesthetics, dermatology, longevity & age management",
    bg: "#17121a",
    card: "#221a26",
    border: "#3a2e40",
    primary: "#E0A6A0",
    primaryDark: "#c98882",
    accent: "#C9A24B",
    muted: "#b9a6bf",
    text: "#f6eef3",
  },
};
