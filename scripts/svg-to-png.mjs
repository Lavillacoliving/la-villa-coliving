// Rasterise un SVG en PNG via Puppeteer (rendu fidèle des polices).
// Usage : node scripts/svg-to-png.mjs <input.svg> <output.png> [width] [height]
import fs from "fs";
import puppeteer from "puppeteer";

const [, , input, output, w = "1200", h = "630"] = process.argv;
const width = Number(w), height = Number(h);
const svg = fs.readFileSync(input, "utf8");

const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: 2 }); // 2× = net sur les réseaux
await page.setContent(
  `<!doctype html><html><head><style>*{margin:0;padding:0}html,body{width:${width}px;height:${height}px}</style></head><body>${svg}</body></html>`,
  { waitUntil: "networkidle0" }
);
await page.screenshot({ path: output, clip: { x: 0, y: 0, width, height } });
await browser.close();
console.log(`PNG écrit : ${output} (${width}×${height} @2×)`);
