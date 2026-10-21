// Line-level editing of a dotenv file that keeps comments and unrelated variables as they are.

const ASSIGNMENT = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/;

/**
 * Formats a value so the Next.js env loader reads it back unchanged: it expands "$NAME" references and, inside
 * double quotes, turns "\n" into a line break, which is how a PEM key fits on one line.
 */
export function formatValue(value) {
  const escaped = value.replace(/\\/g, "\\\\").replace(/\$/g, "\\$").replace(/"/g, '\\"').replace(/\r?\n/g, "\\n");
  return `"${escaped}"`;
}

/** Splits the file into entries; a double-quoted value may span lines, as a pasted PEM key often does. */
function entries(text) {
  const lines = text.split(/\r?\n/);
  const result = [];
  for (let i = 0; i < lines.length; i += 1) {
    const key = ASSIGNMENT.exec(lines[i])?.[1] ?? null;
    let end = i;
    const rest = key ? lines[i].slice(lines[i].indexOf("=") + 1).trimStart() : "";
    if (key && rest.startsWith('"') && !/(^|[^\\])"\s*(#.*)?$/.test(rest.slice(1))) {
      while (end + 1 < lines.length && !/(^|[^\\])"\s*(#.*)?$/.test(lines[end + 1])) end += 1;
      end = Math.min(end + 1, lines.length - 1);
    }
    result.push({ key, lines: lines.slice(i, end + 1) });
    i = end;
  }
  return result;
}

export function removeKeys(text, keys) {
  const removed = [];
  const kept = entries(text).filter((entry) => {
    if (entry.key && keys.includes(entry.key)) {
      if (!removed.includes(entry.key)) removed.push(entry.key);
      return false;
    }
    return true;
  });
  return { text: kept.flatMap((entry) => entry.lines).join("\n"), removed };
}

/** Replaces each key's first assignment, drops later duplicates, and appends keys the file did not have. */
export function upsertEnv(text, values) {
  const pending = new Map(Object.entries(values));
  const seen = new Set();
  const out = [];
  for (const entry of entries(text)) {
    if (entry.key && entry.key in values) {
      if (!seen.has(entry.key)) out.push(`${entry.key}=${formatValue(values[entry.key])}`);
      seen.add(entry.key);
      pending.delete(entry.key);
    } else {
      out.push(...entry.lines);
    }
  }
  while (out.length && out[out.length - 1].trim() === "") out.pop();
  for (const [key, value] of pending) out.push(`${key}=${formatValue(value)}`);
  return `${out.join("\n")}\n`;
}
