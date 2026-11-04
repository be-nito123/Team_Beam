const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
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

  const styles = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button[data-id]'));
    return btns.map(b => ({
      id: b.getAttribute('data-id'),
      classes: b.className,
      color: window.getComputedStyle(b).color,
      spanColor: b.querySelector('span') ? window.getComputedStyle(b.querySelector('span')).color : null,
      dataActive: b.getAttribute('data-active'),
      dataHighlighted: b.getAttribute('data-highlighted')
    }));
  });
  console.log(JSON.stringify(styles, null, 2));
  await browser.close();
})();
