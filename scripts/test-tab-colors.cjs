const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Aswin/.gemini/antigravity-cli/brain/bb46190c-eca6-4832-aeb8-64aedf836b9d');

const TABS = [
  { id: 'ALL SESSIONS', filename: 'all-sessions' },
  { id: 'HAS CONTRADICTIONS', filename: 'has-contradictions' },
  { id: '100% SUPPORTED', filename: '100-supported' },
  { id: 'HAS UNSUPPORTED', filename: 'has-unsupported' },
];

function rgbToHex(rgb) {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb;
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

async function run() {
  console.log('Launching browser to rigorously verify tab colors in Dark and Light themes...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // Navigate to HISTORY in sidebar
  const buttons = await page.$$('aside button');
  for (const b of buttons) {
    const text = await page.evaluate((el) => el.innerText, b);
    if (text && text.includes('HISTORY')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  // 1. Force Dark Mode
  let currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  if (currentTheme !== 'dark') {
    const themeBtn = await page.$('button[aria-label="Toggle theme"]');
    if (themeBtn) await themeBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log('\n================ DARK MODE VERIFICATION ================');
  // First, verify tab "ALL SESSIONS" active colors & inactive tabs colors
  const darkStateBeforeHover = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button[data-id]')).map((b) => ({
      id: b.getAttribute('data-id'),
      isActive: b.getAttribute('data-active'),
      color: window.getComputedStyle(b).color,
    }));
  });

  console.log('Dark mode idle tab colors:');
  for (const t of darkStateBeforeHover) {
    console.log(`  Tab [${t.id}] - Active: ${t.isActive} - Color: ${t.color} (${rgbToHex(t.color)})`);
  }

  // Hover test on inactive tab: HAS CONTRADICTIONS
  console.log('\nTesting hover on inactive tab [HAS CONTRADICTIONS] in Dark Mode...');
  const contraBtn = await page.$('button[data-id="HAS CONTRADICTIONS"]');
  const box = await contraBtn.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  // Wait for 250ms CSS transition
  await new Promise((r) => setTimeout(r, 350));

  const darkHoverColor = await page.evaluate(() => {
    const b = document.querySelector('button[data-id="HAS CONTRADICTIONS"]');
    return window.getComputedStyle(b).color;
  });
  console.log(`  Hovered [HAS CONTRADICTIONS] color: ${darkHoverColor} (${rgbToHex(darkHoverColor)}) [Expected: #ECE4B4]`);

  // Active tab must still have #080808 and champagne background
  const darkActiveDuringHover = await page.evaluate(() => {
    const b = document.querySelector('button[data-id="ALL SESSIONS"]');
    return {
      color: window.getComputedStyle(b).color,
      isActive: b.getAttribute('data-active'),
    };
  });
  console.log(`  Active [ALL SESSIONS] during hover: ${darkActiveDuringHover.color} (${rgbToHex(darkActiveDuringHover.color)}) [Expected: #080808]`);

  // Move mouse away to body top-left
  console.log('\nMoving mouse away to verify color resets to inactive...');
  await page.mouse.move(10, 10);
  await new Promise((r) => setTimeout(r, 350));

  const darkResetColor = await page.evaluate(() => {
    const b = document.querySelector('button[data-id="HAS CONTRADICTIONS"]');
    return window.getComputedStyle(b).color;
  });
  console.log(`  Reset [HAS CONTRADICTIONS] color: ${darkResetColor} (${rgbToHex(darkResetColor)}) [Expected: #FFFFFF]`);

  // Capture all 4 tabs in dark mode
  for (const tab of TABS) {
    const btn = await page.$(`button[data-id="${tab.id}"]`);
    await btn.click();
    await new Promise((r) => setTimeout(r, 400));
    // Move mouse away to ensure no hover artifact
    await page.mouse.move(10, 10);
    await new Promise((r) => setTimeout(r, 200));

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, `tab-dark-${tab.filename}.png`),
    });
    console.log(`Saved screenshot: tab-dark-${tab.filename}.png`);
  }

  // 2. Switch to Light Mode
  console.log('\n================ LIGHT MODE VERIFICATION ================');
  const themeBtn = await page.$('button[aria-label="Toggle theme"]');
  if (themeBtn) {
    await themeBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  // Reset to ALL SESSIONS
  const allSessionsBtn = await page.$('button[data-id="ALL SESSIONS"]');
  await allSessionsBtn.click();
  await page.mouse.move(10, 10);
  await new Promise((r) => setTimeout(r, 400));

  const lightStateBeforeHover = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button[data-id]')).map((b) => ({
      id: b.getAttribute('data-id'),
      isActive: b.getAttribute('data-active'),
      color: window.getComputedStyle(b).color,
    }));
  });

  console.log('Light mode idle tab colors:');
  for (const t of lightStateBeforeHover) {
    console.log(`  Tab [${t.id}] - Active: ${t.isActive} - Color: ${t.color} (${rgbToHex(t.color)})`);
  }

  // Hover test on inactive tab: HAS CONTRADICTIONS in Light mode
  console.log('\nTesting hover on inactive tab [HAS CONTRADICTIONS] in Light Mode...');
  const contraBtnLight = await page.$('button[data-id="HAS CONTRADICTIONS"]');
  const boxLight = await contraBtnLight.boundingBox();
  await page.mouse.move(boxLight.x + boxLight.width / 2, boxLight.y + boxLight.height / 2);
  await new Promise((r) => setTimeout(r, 350));

  const lightHoverColor = await page.evaluate(() => {
    const b = document.querySelector('button[data-id="HAS CONTRADICTIONS"]');
    return window.getComputedStyle(b).color;
  });
  console.log(`  Hovered [HAS CONTRADICTIONS] color: ${lightHoverColor} (${rgbToHex(lightHoverColor)}) [Expected: #82774D]`);

  // Move mouse away
  console.log('\nMoving mouse away to verify color resets to inactive in Light Mode...');
  await page.mouse.move(10, 10);
  await new Promise((r) => setTimeout(r, 350));

  const lightResetColor = await page.evaluate(() => {
    const b = document.querySelector('button[data-id="HAS CONTRADICTIONS"]');
    return window.getComputedStyle(b).color;
  });
  console.log(`  Reset [HAS CONTRADICTIONS] color: ${lightResetColor} (${rgbToHex(lightResetColor)}) [Expected: #171710]`);

  // Capture all 4 tabs in light mode
  for (const tab of TABS) {
    const btn = await page.$(`button[data-id="${tab.id}"]`);
    await btn.click();
    await new Promise((r) => setTimeout(r, 400));
    await page.mouse.move(10, 10);
    await new Promise((r) => setTimeout(r, 200));

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, `tab-light-${tab.filename}.png`),
    });
    console.log(`Saved screenshot: tab-light-${tab.filename}.png`);
  }

  console.log('\nALL CHECKS COMPLETE!');
  await browser.close();
}

run().catch((err) => {
  console.error('Error during tab color test:', err);
  process.exit(1);
});
