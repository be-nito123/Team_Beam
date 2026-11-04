const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Ensure Dark Mode
  let currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  if (currentTheme !== 'dark') {
    const themeBtn = await page.$('button[aria-label="Toggle theme"]');
    if (themeBtn) await themeBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  // Navigate to history first
  const buttons = await page.$$('aside button');
  for (const b of buttons) {
    const text = await page.evaluate((el) => el.innerText, b);
    if (text && text.includes('HISTORY')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 500));

  // Click the first session card to open ResultsView
  const sessionCard = await page.$('.grid > div');
  if (sessionCard) {
    console.log('Clicking session card to open ResultsView...');
    await sessionCard.click();
    await new Promise((r) => setTimeout(r, 600));
  }

  // Verify we are on ResultsView
  const hasResults = await page.evaluate(() => document.body.innerText.includes('FILTER CLAIMS:'));
  console.log('Results page loaded:', hasResults);

  // Inspect the 4 filter tabs
  const inspectTabs = async (label) => {
    const tabData = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button[data-id]'));
      return btns.map((b) => {
        const computed = window.getComputedStyle(b);
        const span = b.querySelector('span');
        const spanComputed = span ? window.getComputedStyle(span) : null;
        return {
          id: b.getAttribute('data-id'),
          text: b.innerText.replace(/\n/g, ' '),
          classes: b.className,
          dataActive: b.getAttribute('data-active'),
          dataHighlighted: b.getAttribute('data-highlighted'),
          computedColor: computed.color,
          computedBg: computed.backgroundColor,
          spanColor: spanComputed ? spanComputed.color : null,
        };
      });
    });
    console.log(`\n=== TAB DATA: ${label} ===`);
    console.log(JSON.stringify(tabData, null, 2));
  };

  await inspectTabs('INITIAL STATE (ALL selected)');

  // Hover over SUPPORTED (when ALL is selected)
  console.log('\nHovering over SUPPORTED tab (while ALL is selected)...');
  const suppBtn = await page.$('button[data-id="SUPPORTED"]');
  const suppBox = await suppBtn.boundingBox();
  await page.mouse.move(suppBox.x + suppBox.width / 2, suppBox.y + suppBox.height / 2);
  await new Promise((r) => setTimeout(r, 300));
  await inspectTabs('HOVER ON SUPPORTED (ALL is selected, SUPPORTED is hovered)');

  // Now CLICK SUPPORTED tab!
  console.log('\nClicking SUPPORTED tab...');
  await suppBtn.click();
  await new Promise((r) => setTimeout(r, 400));
  // Move mouse away
  await page.mouse.move(10, 10);
  await new Promise((r) => setTimeout(r, 300));
  await inspectTabs('AFTER CLICKING SUPPORTED (SUPPORTED is active, ALL is inactive)');

  await browser.close();
})();
