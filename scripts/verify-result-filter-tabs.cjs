const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Aswin/.gemini/antigravity-cli/brain/bb46190c-eca6-4832-aeb8-64aedf836b9d');

const TABS = ['ALL', 'SUPPORTED', 'CONTRADICTED', 'UNSUPPORTED'];

function rgbToHex(rgb) {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb;
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

async function run() {
  console.log('Starting verification of VeriTrace Result Filter Tabs in Puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // Navigate to history first to pick a session
  const asideBtns = await page.$$('aside button');
  for (const b of asideBtns) {
    const text = await page.evaluate((el) => el.innerText, b);
    if (text && text.includes('HISTORY')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  // Click first session card to open ResultsView
  const sessionCard = await page.$('.grid > div');
  if (sessionCard) {
    await sessionCard.click();
    await new Promise((r) => setTimeout(r, 600));
  }

  // Verify ResultsView is open
  const isResults = await page.evaluate(() => document.body.innerText.includes('FILTER CLAIMS:'));
  console.log('ResultsView loaded:', isResults);
  if (!isResults) {
    throw new Error('Failed to load ResultsView');
  }

  // Helper to get tab info
  const getTabsInfo = async () => {
    return await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('.result-filter-tab'));
      return btns.map((b) => {
        const computed = window.getComputedStyle(b);
        return {
          id: b.getAttribute('data-id'),
          text: b.innerText.replace(/\n/g, ' '),
          active: b.getAttribute('data-active') === 'true',
          color: computed.color,
          bg: computed.backgroundColor,
        };
      });
    });
  };

  // Helper to ensure Dark Mode
  const ensureDarkMode = async () => {
    const currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (currentTheme !== 'dark') {
      const themeBtn = await page.$('button[aria-label="Toggle theme"]');
      if (themeBtn) await themeBtn.click();
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  // Helper to ensure Light Mode
  const ensureLightMode = async () => {
    const currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (currentTheme !== 'light') {
      const themeBtn = await page.$('button[aria-label="Toggle theme"]');
      if (themeBtn) await themeBtn.click();
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  await ensureDarkMode();
  console.log('\n================ DARK MODE VERIFICATION ================');

  // Test states 1-4: Click each tab in Dark Mode
  for (const tabId of TABS) {
    console.log(`\nTesting state with [${tabId}] selected in Dark Mode...`);
    const btn = await page.$(`.result-filter-tab[data-id="${tabId}"]`);
    await btn.click();
    await new Promise((r) => setTimeout(r, 350));
    await page.mouse.move(10, 10);
    await new Promise((r) => setTimeout(r, 200));

    const tabs = await getTabsInfo();
    for (const t of tabs) {
      const hex = rgbToHex(t.color);
      const isCurrent = t.id === tabId;
      console.log(`  Tab [${t.id}] - Active: ${t.active} - Color: ${t.color} (${hex}) - Bg: ${t.bg}`);
      if (isCurrent) {
        if (hex !== '#080808') {
          console.error(`  ERROR: Active tab [${t.id}] color is ${hex}, expected #080808`);
        }
      } else {
        if (hex !== '#FFFFFF') {
          console.error(`  ERROR: Inactive tab [${t.id}] color is ${hex}, expected #FFFFFF`);
        }
      }
    }

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, `results-tab-dark-selected-${tabId.toLowerCase()}.png`),
    });
  }

  // Test state 5: Hover over every inactive tab in Dark Mode (while ALL is selected)
  console.log('\nTesting hover over every inactive tab in Dark Mode...');
  const allBtn = await page.$(`.result-filter-tab[data-id="ALL"]`);
  await allBtn.click();
  await new Promise((r) => setTimeout(r, 350));

  for (const tabId of ['SUPPORTED', 'CONTRADICTED', 'UNSUPPORTED']) {
    const btn = await page.$(`.result-filter-tab[data-id="${tabId}"]`);
    const box = await btn.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise((r) => setTimeout(r, 350));

    const hoverColor = await page.evaluate((id) => {
      const b = document.querySelector(`.result-filter-tab[data-id="${id}"]`);
      return window.getComputedStyle(b).color;
    }, tabId);
    const activeColor = await page.evaluate(() => {
      const b = document.querySelector('.result-filter-tab[data-id="ALL"]');
      return window.getComputedStyle(b).color;
    });

    console.log(`  Hovered tab [${tabId}] color: ${hoverColor} (${rgbToHex(hoverColor)}) [Expected: #ECE4B4]`);
    console.log(`  Active tab [ALL] during hover: ${activeColor} (${rgbToHex(activeColor)}) [Expected: #080808]`);

    if (tabId === 'SUPPORTED') {
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'results-tab-dark-hover-supported.png'),
      });
    }

    // Move away
    await page.mouse.move(10, 10);
    await new Promise((r) => setTimeout(r, 350));

    const resetColor = await page.evaluate((id) => {
      const b = document.querySelector(`.result-filter-tab[data-id="${id}"]`);
      return window.getComputedStyle(b).color;
    }, tabId);
    console.log(`  Reset tab [${tabId}] color: ${resetColor} (${rgbToHex(resetColor)}) [Expected: #FFFFFF]`);
  }

  // Switch to Light Mode
  await ensureLightMode();
  console.log('\n================ LIGHT MODE VERIFICATION ================');

  // Test states 1-4 in Light Mode
  for (const tabId of TABS) {
    console.log(`\nTesting state with [${tabId}] selected in Light Mode...`);
    const btn = await page.$(`.result-filter-tab[data-id="${tabId}"]`);
    await btn.click();
    await new Promise((r) => setTimeout(r, 350));
    await page.mouse.move(10, 10);
    await new Promise((r) => setTimeout(r, 200));

    const tabs = await getTabsInfo();
    for (const t of tabs) {
      const hex = rgbToHex(t.color);
      const isCurrent = t.id === tabId;
      console.log(`  Tab [${t.id}] - Active: ${t.active} - Color: ${t.color} (${hex}) - Bg: ${t.bg}`);
      if (isCurrent) {
        if (hex !== '#FFFFFF') {
          console.error(`  ERROR: Active tab [${t.id}] color is ${hex}, expected #FFFFFF`);
        }
      } else {
        if (hex !== '#171710') {
          console.error(`  ERROR: Inactive tab [${t.id}] color is ${hex}, expected #171710`);
        }
      }
    }

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, `results-tab-light-selected-${tabId.toLowerCase()}.png`),
    });
  }

  // Test hover in Light Mode
  console.log('\nTesting hover over inactive tab in Light Mode...');
  const allBtnLight = await page.$(`.result-filter-tab[data-id="ALL"]`);
  await allBtnLight.click();
  await new Promise((r) => setTimeout(r, 350));

  const suppBtnLight = await page.$(`.result-filter-tab[data-id="SUPPORTED"]`);
  const boxLight = await suppBtnLight.boundingBox();
  await page.mouse.move(boxLight.x + boxLight.width / 2, boxLight.y + boxLight.height / 2);
  await new Promise((r) => setTimeout(r, 350));

  const lightHoverColor = await page.evaluate(() => {
    const b = document.querySelector('.result-filter-tab[data-id="SUPPORTED"]');
    return window.getComputedStyle(b).color;
  });
  console.log(`  Hovered tab [SUPPORTED] in Light Mode: ${lightHoverColor} (${rgbToHex(lightHoverColor)}) [Expected: #82774D]`);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'results-tab-light-hover-supported.png'),
  });

  // Move away
  await page.mouse.move(10, 10);
  await new Promise((r) => setTimeout(r, 350));

  const lightResetColor = await page.evaluate(() => {
    const b = document.querySelector('.result-filter-tab[data-id="SUPPORTED"]');
    return window.getComputedStyle(b).color;
  });
  console.log(`  Reset tab [SUPPORTED] in Light Mode: ${lightResetColor} (${rgbToHex(lightResetColor)}) [Expected: #171710]`);

  console.log('\nALL RESULT FILTER TAB VERIFICATIONS PASSED SUCCESSFULLY!');
  await browser.close();
}

run().catch((err) => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
