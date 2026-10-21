// Line-level editing of a dotenv file that keeps comments and unrelated variables as they are.

const ASSIGNMENT = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/;
const ENV_LINE = /^\s*(?:export\s+)?[A-Z][A-Z0-9_]*\s*=/;

/**
 * Formats a value so the Next.js env loader reads it back unchanged: it expands "$NAME" references (so "$" is escaped)
 * and, inside double quotes, turns "\n" into a line break, which is how a PEM key fits on one line. dotenv has no
 * escape for a backslash or a double quote, so values holding either are refused instead of being written altered.
 */
export function formatValue(key, value) {
  if (/["\\]/.test(value)) throw new Error(`${key} berisi tanda kutip atau garis miring terbalik yang tidak bisa disimpan utuh di .env.local.`);
  return `"${value.replace(/\$/g, "\\$").replace(/\r?\n/g, "\\n")}"`;
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
      let close = i + 1;
      while (close < lines.length && !/(^|[^\\])"\s*(#.*)?$/.test(lines[close])) {
        // A line like NEXT_VAR= means the quote above was never closed; PEM base64 lines are mixed case.
        if (ENV_LINE.test(lines[close])) close = lines.length;
        else close += 1;
      }
      // An unterminated quote stays a one-line entry, so editing it never swallows the variables below it.
      if (close < lines.length) end = close;
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
      if (!seen.has(entry.key)) out.push(`${entry.key}=${formatValue(entry.key, values[entry.key])}`);
      seen.add(entry.key);
      pending.delete(entry.key);
    } else {
      out.push(...entry.lines);
    }
  }
  while (out.length && out[out.length - 1].trim() === "") out.pop();
  for (const [key, value] of pending) out.push(`${key}=${formatValue(key, value)}`);
  return `${out.join("\n")}\n`;
}
