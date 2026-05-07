// Standalone Node script — runs Puppeteer outside the Bun runtime to avoid
// the proxy-agent / debug ESM-CJS interop bug that breaks Puppeteer under Bun.
//
// Usage: node scripts/capture-page.mjs <url> <outFilePath>
// Stdout: { "pageHeight": <number> } on the last line.

import puppeteer from "puppeteer";

const url = process.argv[2];
const outFile = process.argv[3];

if (!url || !outFile) {
  console.error("usage: capture-page.mjs <url> <outFile>");
  process.exit(1);
}

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 800, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
  // Let fonts and animations settle
  await new Promise((r) => setTimeout(r, 800));

  const pageHeight = await page.evaluate(() =>
    Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    ),
  );

  await page.screenshot({ path: outFile, fullPage: true, type: "png" });

  // Output the metadata as JSON on the final line
  console.log(JSON.stringify({ pageHeight }));
} finally {
  await browser.close();
}
