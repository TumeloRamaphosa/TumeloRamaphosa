// Minimal RFC4180-ish CSV parser. Handles quoted fields, escaped quotes,
// CRLF/LF line endings. No external dependency.

export type Row = Record<string, string>;

export function parseCSV(text: string): Row[] {
  const rows = splitRows(text);
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  const out: Row[] = [];
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    if (cells.length === 1 && cells[0] === "") continue;
    const row: Row = {};
    headers.forEach((h, j) => (row[h] = (cells[j] ?? "").trim()));
    out.push(row);
  }
  return out;
}

function splitRows(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += c;
      }
      continue;
    }
    if (c === '"' && cell === "") {
      inQuotes = true;
      continue;
    }
    if (c === ",") {
      cur.push(cell);
      cell = "";
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      cur.push(cell);
      rows.push(cur);
      cur = [];
      cell = "";
      continue;
    }
    cell += c;
  }
  if (cell !== "" || cur.length > 0) {
    cur.push(cell);
    rows.push(cur);
  }
  return rows;
}
