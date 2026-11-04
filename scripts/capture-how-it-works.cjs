const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Aswin/.gemini/antigravity-cli/brain/bb46190c-eca6-4832-aeb8-64aedf836b9d');

async function capture() {
  console.log('Capturing updated dashboard with How VeriTrace Works section...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Desktop view
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // Scroll down slightly or take full page screenshot to show the new section
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'veritrace-how-it-works-desktop.png'),
    fullPage: true,
  });

  // Mobile view (390x844)
  await page.setViewport({ width: 390, height: 844 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'veritrace-how-it-works-mobile.png'),
    fullPage: true,
  });

  await browser.close();
  console.log('Capture completed successfully.');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
