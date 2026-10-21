import { createInterface } from "node:readline";
import { Writable } from "node:stream";

/**
 * Line prompts on stderr. A hidden prompt stops echoing keystrokes so a password never shows on screen; piped input
 * (non-TTY) is read line by line, because readline/promises loses piped lines between questions.
 */
export function createPrompter() {
  let muted = false;
  const output = new Writable({
    write(chunk, encoding, done) {
      if (!muted) process.stderr.write(chunk, encoding);
      done();
    },
  });
  const rl = createInterface({ input: process.stdin, output, terminal: Boolean(process.stdin.isTTY) });
  const lines = rl[Symbol.asyncIterator]();

  async function ask(prompt, { hidden = false } = {}) {
    process.stderr.write(prompt);
    muted = hidden;
    const { value, done } = await lines.next();
    muted = false;
    if (hidden) process.stderr.write("\n");
    return done ? "" : value;
  }

  return { ask, close: () => rl.close() };
}
