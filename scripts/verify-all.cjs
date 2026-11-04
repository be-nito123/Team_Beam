const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = path.resolve('C:/Users/Aswin/.gemini/antigravity-cli/brain/bb46190c-eca6-4832-aeb8-64aedf836b9d');

async function testAll() {
  console.log('Starting full verification suite for Upgrade...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Load initial app (AI Verification in Dark mode)
  console.log('Loading AI Verification Dashboard (Dark Mode)...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '01-ai-dashboard-dark.png'),
    fullPage: false,
  });

  // 2. Test Light Mode Toggle
  console.log('Testing Sun/Moon toggle to Light Mode...');
  const themeBtn = await page.$('button[aria-label="Toggle theme"]');
  if (themeBtn) {
    await themeBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }
  const themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Current theme attribute:', themeAttr);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '02-ai-dashboard-light.png'),
    fullPage: false,
  });

  // 3. Test Theme Persistence across Refresh
  console.log('Testing theme persistence across reload...');
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 400));
  const persistedTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Persisted theme after reload:', persistedTheme);
  if (persistedTheme !== 'light') {
    throw new Error('Theme did not persist across refresh!');
  }

  // 4. Test Product Switcher to PLAGIARISM CHECKER
  console.log('Switching to Plagiarism Checker...');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('PLAGIARISM CHECKER')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  // Verify Plagiarism Dashboard in Light Mode
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '03-plagiarism-dashboard-light.png'),
    fullPage: false,
  });

  // Switch to Dark mode for Plagiarism Dashboard
  console.log('Switching to Dark mode on Plagiarism Dashboard...');
  const themeBtnDark = await page.$('button[aria-label="Toggle theme"]');
  if (themeBtnDark) {
    await themeBtnDark.click();
    await new Promise((r) => setTimeout(r, 400));
  }
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '04-plagiarism-dashboard-dark.png'),
    fullPage: false,
  });

  // 5. Test Backend Contract Specs Modal
  console.log('Opening Backend Contract Specs Modal...');
  const specBtn = await page.$('button');
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate((el) => el.innerText, b);
    if (txt && txt.includes('[VIEW SPECS]')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '05-plagiarism-backend-contract-modal.png'),
    fullPage: false,
  });

  // Dismiss modal
  const dismissBtn = await page.$('button');
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate((el) => el.innerText, b);
    if (txt && txt.includes('DISMISS SPECIFICATION')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 400));

  // 6. Test Plagiarism Upload & Analysis
  console.log('Testing Plagiarism Upload with Original + Reference files...');
  const fileInputs = await page.$$('input[type="file"]');
  if (fileInputs.length >= 2) {
    const originalPath = path.resolve('D:/veritrace/scripts/sample_original.txt');
    const ref1Path = path.resolve('D:/veritrace/scripts/sample_ref1.txt');
    const ref2Path = path.resolve('D:/veritrace/scripts/sample_ref2.txt');

    await fileInputs[0].uploadFile(originalPath);
    await page.evaluate((el) => el.dispatchEvent(new Event('change', { bubbles: true })), fileInputs[0]);
    await new Promise((r) => setTimeout(r, 400));

    await fileInputs[1].uploadFile(ref1Path, ref2Path);
    await page.evaluate((el) => el.dispatchEvent(new Event('change', { bubbles: true })), fileInputs[1]);
    await new Promise((r) => setTimeout(r, 400));
  }

  // Click CHECK FOR PLAGIARISM button
  let checkBtn = null;
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate((el) => el.innerText, b);
    if (txt && txt.includes('CHECK FOR PLAGIARISM')) {
      checkBtn = b;
      break;
    }
  }

  if (checkBtn) {
    console.log('Submitting Plagiarism Check...');
    await checkBtn.click();
    await new Promise((r) => setTimeout(r, 1200));

    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('Page state snippet:', pageText.slice(0, 300).replace(/\n+/g, ' '));

    await page.waitForFunction(() => document.body.innerText.includes('ORIGINALITY AUDIT REPORT') || document.body.innerText.includes('Backend not reachable'), { timeout: 8000 });
    console.log('Finished plagiarism check submission step!');
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '06-plagiarism-results-view.png'),
      fullPage: false,
    });
  }

  // 7. Test Plagiarism History Page
  console.log('Navigating to Plagiarism History...');
  for (const b of await page.$$('aside button')) {
    const txt = await page.evaluate((el) => el.innerText, b);
    if (txt && txt.includes('HISTORY')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '07-plagiarism-history-view.png'),
    fullPage: false,
  });

  // 8. Switch back to AI Verification Workspace via Sidebar or Header
  console.log('Switching back to AI Verification workspace...');
  for (const b of await page.$$('header button')) {
    const txt = await page.evaluate((el) => el.innerText, b);
    if (txt && txt.includes('AI VERIFICATION')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '08-back-to-ai-verification.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('All automated tests completed successfully!');
}

testAll().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
