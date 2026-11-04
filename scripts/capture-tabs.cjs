const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Aswin/.gemini/antigravity-cli/brain/bb46190c-eca6-4832-aeb8-64aedf836b9d');

const TABS = [
  { id: 'ALL SESSIONS', filename: 'all-sessions' },
  { id: 'HAS CONTRADICTIONS', filename: 'has-contradictions' },
  { id: '100% SUPPORTED', filename: '100-supported' },
  { id: 'HAS UNSUPPORTED', filename: 'has-unsupported' },
];

async function run() {
  console.log('Launching browser to capture all 4 tabs in both themes...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // Navigate to HISTORY in sidebar
  console.log('Navigating to HISTORY page...');
  for (const b of await page.$$('aside button')) {
    const text = await page.evaluate((el) => el.innerText, b);
    if (text && text.includes('HISTORY')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 500));

  // Ensure Dark mode first
  let currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  if (currentTheme !== 'dark') {
    const themeBtn = await page.$('button[aria-label="Toggle theme"]');
    if (themeBtn) await themeBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  // === DARK MODE: 4 TABS ===
  console.log('--- CAPTURING DARK MODE TABS ---');
  for (const tab of TABS) {
    console.log(`Clicking ${tab.id} in Dark Mode...`);
    const button = await page.$(`button[data-id="${tab.id}"]`);
    if (button) {
      await button.click();
      // Wait for spring animation duration (300ms + buffer)
      await new Promise((r) => setTimeout(r, 400));
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, `tab-dark-${tab.filename}.png`),
        fullPage: false,
      });
      console.log(`Captured tab-dark-${tab.filename}.png`);
    } else {
      console.error(`Could not find button for tab ${tab.id}`);
    }
  }

  // Switch to Light Mode
  console.log('Switching to Light Mode...');
  const themeBtn = await page.$('button[aria-label="Toggle theme"]');
  if (themeBtn) {
    await themeBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  // === LIGHT MODE: 4 TABS ===
  console.log('--- CAPTURING LIGHT MODE TABS ---');
  for (const tab of TABS) {
    console.log(`Clicking ${tab.id} in Light Mode...`);
    const button = await page.$(`button[data-id="${tab.id}"]`);
    if (button) {
      await button.click();
      await new Promise((r) => setTimeout(r, 400));
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, `tab-light-${tab.filename}.png`),
        fullPage: false,
      });
      console.log(`Captured tab-light-${tab.filename}.png`);
    } else {
      console.error(`Could not find button for tab ${tab.id}`);
    }
  }

  // Verify persistence after refresh on a specific tab
  console.log('Verifying filter tab persistence across reload...');
  const activeBefore = await page.evaluate(() => {
    const activeBtn = document.querySelector('button[aria-selected="true"]');
    return activeBtn ? activeBtn.getAttribute('data-id') : null;
  });
  console.log('Active tab before reload:', activeBefore);

  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));

  const activeAfter = await page.evaluate(() => {
    const activeBtn = document.querySelector('button[aria-selected="true"]');
    return activeBtn ? activeBtn.getAttribute('data-id') : null;
  });
  console.log('Active tab after reload:', activeAfter);

  if (activeBefore !== activeAfter) {
    throw new Error(`Tab did not persist across reload! Before: ${activeBefore}, After: ${activeAfter}`);
  }
  console.log('Filter persistence verified successfully!');

  await browser.close();
  console.log('All 8 screenshots and tests completed successfully!');
}

run().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
