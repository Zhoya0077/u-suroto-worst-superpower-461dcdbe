// Worst Superpower — one line, at most 140 characters.
//
// The entry invents a power whose only use is an instant nobody can use:
// stopping time exactly while sneezing, a moment that is already gone
// before you could do anything with it.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = "I can stop time, but only for the exact instant I sneeze.";

const MAX_CHARS = 140;

function fail(message: string): never {
  throw new Error(`gate failed: ${message}`);
}

function checkEntry(text: string): void {
  if (text.length < 1) fail("entry is empty");
  if (text.length > MAX_CHARS) {
    fail(`entry is ${text.length} characters, over the ${MAX_CHARS} limit`);
  }
  if (text.trim().length === 0) fail("entry is only whitespace");
  if (text.includes("\n") || text.includes("\r")) {
    fail("entry must be a single line");
  }
  // The gate counts characters, so confirm the UTF-8 byte size is sane too:
  // a multi-byte surprise must never silently push the file over the limit.
  const bytes = Buffer.byteLength(text, "utf8");
  if (bytes > MAX_CHARS) {
    fail(`entry is ${bytes} UTF-8 bytes, over the ${MAX_CHARS} limit`);
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
checkEntry(ENTRY);
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "entry.txt");
writeFileSync(outFile, ENTRY, "utf8");
// Read it back: the file on disk must be byte-identical to the gated entry.
const roundTrip = readFileSync(outFile, "utf8");
if (roundTrip !== ENTRY) fail("written entry.txt does not match the gated entry");
console.log(`wrote ${ENTRY.length}-character entry to ${outFile}`);
