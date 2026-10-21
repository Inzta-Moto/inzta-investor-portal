import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { parseTheme } from "./theme.ts";

test("only light and dark are accepted from the cookie", () => {
  assert.equal(parseTheme("light"), "light");
  assert.equal(parseTheme("dark"), "dark");
  assert.equal(parseTheme("system"), null);
  assert.equal(parseTheme(undefined), null);
});

test("the chosen-dark and device-dark token blocks in globals.css are identical", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const declarations = (block: string) =>
    block
      .split(";")
      .map((line) => line.trim())
      .filter(Boolean)
      .sort();
  const chosen = /:root\[data-theme="dark"\] \{([^}]*)\}/.exec(css)?.[1];
  const device = /:root:not\(\[data-theme="light"\]\) \{([^}]*)\}/.exec(css)?.[1];
  assert.ok(chosen && device, "both dark blocks exist");
  assert.deepEqual(declarations(chosen), declarations(device));
});
