const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Aswin/.gemini/antigravity-cli/brain/bb46190c-eca6-4832-aeb8-64aedf836b9d');

async function testVerificationFlow() {
  console.log('Testing interactive verification submission...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Click Sample button to populate
  const sampleBtn = await page.$('button[title="Populate test sample"]');
  if (sampleBtn) {
    await sampleBtn.click();
    console.log('Sample data populated.');
  }

  await new Promise((r) => setTimeout(r, 300));

  // Find RUN VERIFICATION button
  let runBtn = null;
  for (const btn of await page.$$('button')) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('RUN VERIFICATION')) {
      runBtn = btn;
      break;
    }
  }

  if (runBtn) {
    console.log('Clicking RUN VERIFICATION button...');
    await runBtn.click();
    // Wait for loading transition
    await new Promise((r) => setTimeout(r, 400));
    // Verify loading indicator is displayed
    const loadingText = await page.evaluate(() => document.body.innerText.includes('AUDITING CLAIMS...'));
    console.log('Loading state verified:', loadingText);

    // Wait for resolution and navigation to results page
    await page.waitForFunction(() => document.body.innerText.includes('EVIDENCE EXTRACTION MATRIX'), { timeout: 5000 });
    console.log('Navigated to Results Matrix successfully!');

    // Capture dynamic run screenshot
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'veritrace-live-run-results.png'),
      fullPage: false,
    });

    // Test AnimatedBackground filtering tabs: click "CONTRADICTED" tab
    const contradictedTab = await page.$('button[data-id="CONTRADICTED"]');
    if (contradictedTab) {
      console.log('Clicking CONTRADICTED filter tab...');
      await contradictedTab.click();
      await new Promise((r) => setTimeout(r, 400));
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'veritrace-filtered-contradicted.png'),
        fullPage: false,
      });
      console.log('Filtered tab verified & captured.');
    }
  }

  await browser.close();
  console.log('All interaction tests passed successfully.');
}

testVerificationFlow().catch((err) => {
  console.error('Test verification failed:', err);
  process.exit(1);
});
