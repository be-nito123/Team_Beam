const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = path.resolve('C:/Users/Aswin/.gemini/antigravity-cli/brain/bb46190c-eca6-4832-aeb8-64aedf836b9d');

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. 1920x1080 - Dashboard View
  console.log('Capturing 1920x1080 Dashboard...');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.waitForSelector('textarea');
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'veritrace-1920x1080-dashboard.png'),
    fullPage: false,
  });

  // 2. Click a recent analysis in the sidebar to open Results view
  console.log('Opening Results View...');
  const recentButtons = await page.$$('aside button');
  // Find button with vt-analysis or click the first item in recent analyses
  const sessionItem = await page.$('aside .group.flex-col');
  if (sessionItem) {
    await sessionItem.click();
    await new Promise((r) => setTimeout(r, 800));
  }

  // 1440x900 - Results View with AnimatedBackground tabs
  console.log('Capturing 1440x900 Results...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'veritrace-1440x900-results.png'),
    fullPage: false,
  });

  // 3. Open Evidence Explorer Modal
  console.log('Opening Evidence Explorer Modal...');
  const explorerButtons = await page.$$('button');
  for (const btn of explorerButtons) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('EVIDENCE EXPLORER')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  // 1366x768 - Evidence Explorer Modal
  console.log('Capturing 1366x768 Evidence Explorer...');
  await page.setViewport({ width: 1366, height: 768 });
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'veritrace-1366x768-evidence-explorer.png'),
    fullPage: false,
  });

  // Close modal
  const closeBtn = await page.$('button[aria-label="Close modal"]');
  if (closeBtn) await closeBtn.click();
  await new Promise((r) => setTimeout(r, 400));

  // 4. History View
  console.log('Navigating to History View...');
  for (const btn of await page.$$('aside button')) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('HISTORY')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  // 768x1024 - Tablet Portrait (History)
  console.log('Capturing 768x1024 Tablet...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'veritrace-768x1024-history.png'),
    fullPage: false,
  });

  // 5. Navigate back to Dashboard on Mobile (390x844)
  console.log('Navigating to Dashboard on Mobile (390x844)...');
  await page.setViewport({ width: 390, height: 844 });
  for (const btn of await page.$$('button')) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('+ NEW VERIFICATION')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'veritrace-390x844-mobile-dashboard.png'),
    fullPage: false,
  });

  // Open mobile drawer
  const menuBtn = await page.$('button[aria-label="Open sidebar"]');
  if (menuBtn) {
    await menuBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'veritrace-390x844-mobile-drawer.png'),
      fullPage: false,
    });
  }

  await browser.close();
  console.log('All screenshots captured successfully.');
}

run().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
