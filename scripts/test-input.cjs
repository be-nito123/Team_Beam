const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:5173');
  for (const b of await page.$$('button')) {
    const t = await page.evaluate((el) => el.innerText, b);
    if (t.includes('PLAGIARISM CHECKER')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  const inputs = await page.$$('input[type="file"]');
  await inputs[0].uploadFile('D:/veritrace/scripts/sample_original.txt');
  await page.evaluate((el) => el.dispatchEvent(new Event('change', { bubbles: true })), inputs[0]);
  await new Promise((r) => setTimeout(r, 400));

  await inputs[1].uploadFile('D:/veritrace/scripts/sample_ref1.txt');
  await page.evaluate((el) => el.dispatchEvent(new Event('change', { bubbles: true })), inputs[1]);
  await new Promise((r) => setTimeout(r, 400));

  let checkBtn = null;
  for (const b of await page.$$('button')) {
    const t = await page.evaluate((el) => el.innerText, b);
    if (t.includes('CHECK FOR PLAGIARISM')) {
      checkBtn = b;
      break;
    }
  }

  if (checkBtn) {
    console.log('Clicking button...');
    await checkBtn.click();
  }

  await new Promise((r) => setTimeout(r, 2000));
  const text = await page.evaluate(() => document.body.innerText);
  console.log('=== PAGE TEXT ===\n' + text);

  await browser.close();
})();
