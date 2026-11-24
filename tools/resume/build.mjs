// Prints tools/resume/resume.html to public/resume.pdf with headless Chrome or Edge.
// Run with: npm run resume
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "resume.html");
const output = resolve(here, "../../public/resume.pdf");

const browsers = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const browser = browsers.find((path) => existsSync(path));
if (!browser) {
  console.error("No Chrome or Edge found; set CHROME_PATH to one.");
  process.exit(1);
}

execFileSync(browser, [
  "--headless",
  "--disable-gpu",
  "--no-pdf-header-footer",
  `--print-to-pdf=${output}`,
  pathToFileURL(source).href,
]);
console.log(`Resume printed to ${output}`);
