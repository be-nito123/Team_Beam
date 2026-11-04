const puppeteer = require('puppeteer');
const path = require('path');
const ARTIFACT_DIR = 'C:/Users/Aswin/.gemini/antigravity-cli/brain/bb46190c-eca6-4832-aeb8-64aedf836b9d';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Navigate to history
  const buttons = await page.$$('aside button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.innerText, b);
    if (text && text.includes('HISTORY')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));

  // Hover over HAS CONTRADICTIONS in dark mode
  const btn = await page.$('button[data-id="HAS CONTRADICTIONS"]');
  const box = await btn.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tab-dark-hover.png') });
  console.log('Saved tab-dark-hover.png');

  // Switch to light mode
  const themeBtn = await page.$('button[aria-label="Toggle theme"]');
  await themeBtn.click();
  await new Promise(r => setTimeout(r, 400));

  // Hover over HAS CONTRADICTIONS in light mode
  const btnLight = await page.$('button[data-id="HAS CONTRADICTIONS"]');
  const boxLight = await btnLight.boundingBox();
  await page.mouse.move(boxLight.x + boxLight.width / 2, boxLight.y + boxLight.height / 2);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tab-light-hover.png') });
  console.log('Saved tab-light-hover.png');

  await browser.close();
})();
