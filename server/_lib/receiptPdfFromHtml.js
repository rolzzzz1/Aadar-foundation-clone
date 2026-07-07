/**
 * Render receipt HTML to PDF — matches success-page download quality.
 * Uses puppeteer + @sparticuz/chromium on Vercel, or system Chrome locally.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

function isServerless() {
  return !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
}

function resolveChromePath() {
  if (process.env.CHROME_EXECUTABLE_PATH) {
    return process.env.CHROME_EXECUTABLE_PATH;
  }
  if (process.platform === "win32") {
    const candidates = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      path.join(process.env.LOCALAPPDATA || "", "Google\\Chrome\\Application\\chrome.exe"),
    ];
    for (const p of candidates) {
      if (p && fs.existsSync(p)) return p;
    }
  }
  if (process.platform === "darwin") {
    const p = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    if (fs.existsSync(p)) return p;
  }
  if (process.platform === "linux") {
    const candidates = ["/usr/bin/google-chrome", "/usr/bin/chromium-browser", "/usr/bin/chromium"];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

function cleanupDir(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

async function renderWithPuppeteer(html) {
  const puppeteer = require("puppeteer-core");
  const chromium = require("@sparticuz/chromium");

  chromium.setGraphicsMode = false;

  const browser = await puppeteer.launch({
    args: isServerless() ? chromium.args : ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 794, height: 1123 },
    executablePath: isServerless()
      ? await chromium.executablePath()
      : resolveChromePath() || (await chromium.executablePath()),
    headless: isServerless() ? chromium.headless : true,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

function renderWithChromeCli(html) {
  const chromePath = resolveChromePath();
  if (!chromePath) {
    throw new Error("Chrome not found for PDF rendering");
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "aadar-receipt-"));
  const htmlPath = path.join(tmpDir, "receipt.html");
  const pdfPath = path.join(tmpDir, "receipt.pdf");

  fs.writeFileSync(htmlPath, html, "utf8");
  const fileUrl = `file:///${htmlPath.replace(/\\/g, "/")}`;

  return new Promise((resolve, reject) => {
    const args = [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=8000",
      `--print-to-pdf=${pdfPath}`,
      "--no-pdf-header-footer",
      fileUrl,
    ];

    const proc = spawn(chromePath, args, { stdio: "ignore" });
    proc.on("error", (err) => {
      cleanupDir(tmpDir);
      reject(err);
    });
    proc.on("close", (code) => {
      try {
        if (code !== 0 || !fs.existsSync(pdfPath)) {
          reject(new Error(`Chrome PDF render failed (exit ${code})`));
          return;
        }
        const buffer = fs.readFileSync(pdfPath);
        resolve(buffer);
      } catch (err) {
        reject(err);
      } finally {
        cleanupDir(tmpDir);
      }
    });
  });
}

function canUsePuppeteer() {
  try {
    require.resolve("puppeteer-core");
    require.resolve("@sparticuz/chromium");
    return true;
  } catch {
    return false;
  }
}

/**
 * @returns {Promise<Buffer>}
 */
async function renderHtmlToPdfBuffer(html) {
  if (canUsePuppeteer()) {
    try {
      return await renderWithPuppeteer(html);
    } catch (err) {
      if (!isServerless()) {
        // eslint-disable-next-line no-console
        console.warn("[receipt-pdf] puppeteer failed, trying Chrome CLI:", err.message);
        return renderWithChromeCli(html);
      }
      throw err;
    }
  }

  if (isServerless()) {
    throw new Error("puppeteer-core and @sparticuz/chromium required on serverless");
  }

  return renderWithChromeCli(html);
}

module.exports = {
  renderHtmlToPdfBuffer,
  canUsePuppeteer,
  resolveChromePath,
};
