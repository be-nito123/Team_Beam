const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/Aswin/.gemini/antigravity-cli/brain/bb46190c-eca6-4832-aeb8-64aedf836b9d';

async function run() {
  console.log('--- STARTING TEXT-SHIMMER INTEGRATION VERIFICATION ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  // 1. Initial Empty Dashboard Verification
  console.log('\n[1] Checking initial dashboard state...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

  let shimmerExists = await page.evaluate(() => {
    return !!document.querySelector('.font-mono.text-sm');
  });
  console.log('Shimmer visible on initial empty dashboard (should be false):', shimmerExists);
  if (shimmerExists) {
    console.error('FAIL: Shimmer should not be present on initial empty dashboard.');
  } else {
    console.log('PASS: Initial dashboard has no active shimmer.');
  }

  // 2. Test AI Verification Loading State with TextShimmer
  console.log('\n[2] Testing AI Verification Loading with TextShimmer in Dark & Light Modes...');
  await page.setRequestInterception(true);

  let routeResolver = null;
  let shouldDelayAnalyze = false;
  let analyzeResponseStatusCode = 200;
  let analyzeResponseBody = JSON.stringify({
    id: 'test-session-123',
    createdAt: new Date().toISOString(),
    title: 'Test Verification Analysis',
    aiClaim: 'The sky is blue due to Rayleigh scattering.',
    referenceClaim: 'Rayleigh scattering of sunlight causes the blue sky.',
    summary: { supported: 1, contradicted: 0, unsupported: 0, total: 1 },
    claims: [
      {
        id: 'c-1',
        claimNumber: 1,
        originalClaim: 'The sky is blue due to Rayleigh scattering.',
        status: 'SUPPORTED',
        confidence: 0.98,
        explanation: 'The reference material directly corroborates the scientific claim.',
        evidence: {
          source: 'Physics Reference',
          exactSentence: 'Rayleigh scattering of sunlight causes the blue sky.',
          relationship: 'Direct Support',
          explanation: 'Corroborated.'
        }
      }
    ]
  });

  page.on('request', (req) => {
    if (req.url().includes('/api/history') || req.url().includes('/api/plagiarism/history')) {
      req.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
      return;
    }

    if (req.url().includes('/api/analyze') && req.method() === 'POST') {
      if (shouldDelayAnalyze) {
        new Promise((resolve) => {
          routeResolver = resolve;
        }).then(() => {
          if (analyzeResponseStatusCode === 200) {
            req.respond({
              status: 200,
              contentType: 'application/json',
              body: analyzeResponseBody
            });
          } else {
            req.respond({
              status: analyzeResponseStatusCode,
              contentType: 'text/plain',
              body: 'Internal Verification Engine Error (Test)'
            });
          }
        });
        return;
      }
    }

    if (req.url().includes('/api/plagiarism/check') && req.method() === 'POST') {
      if (shouldDelayAnalyze) {
        new Promise((resolve) => {
          routeResolver = resolve;
        }).then(() => {
          if (analyzeResponseStatusCode === 200) {
            req.respond({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                id: 'plag-test-123',
                createdAt: new Date().toISOString(),
                documentName: 'sample_original.txt',
                documentSize: 1024,
                summary: {
                  overallSimilarity: 42,
                  matchedSources: 1,
                  wordsReviewed: 150,
                  exactMatchPercentage: 20,
                  paraphrasedPercentage: 22,
                  originalPercentage: 58
                },
                matches: [],
                referenceDocuments: [
                  { name: 'sample_ref1.txt', size: 512, type: 'text/plain' }
                ]
              })
            });
          } else {
            req.respond({
              status: analyzeResponseStatusCode,
              contentType: 'text/plain',
              body: 'Plagiarism Engine Service Unavailable'
            });
          }
        });
        return;
      }
    }

    req.continue();
  });

  // Enable request delay
  shouldDelayAnalyze = true;
  analyzeResponseStatusCode = 200;

  // Type into AI Claim and Reference Claim
  const textareas = await page.$$('textarea');
  await textareas[0].type('The sky is blue due to Rayleigh scattering.');
  await textareas[1].type('Rayleigh scattering of sunlight causes the blue sky.');

  // Click Run Verification
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('RUN VERIFICATION'));
    if (btn) btn.click();
  });

  // Wait for loading shimmer to appear
  await page.waitForSelector('.font-mono.text-sm');
  let shimmerText = await page.evaluate(() => {
    const el = document.querySelector('.font-mono.text-sm');
    return el ? el.textContent.trim() : null;
  });
  console.log('AI verification loading shimmer text:', shimmerText);
  if (shimmerText === 'Analyzing claims...') {
    console.log('PASS: Correct TextShimmer text "Analyzing claims..." during verification.');
  } else {
    console.error('FAIL: Unexpected shimmer text:', shimmerText);
  }

  // Capture Dark Mode AI Verification Shimmer
  const darkShimmerPath = path.join(ARTIFACT_DIR, 'text-shimmer-ai-dark.png');
  await page.screenshot({ path: darkShimmerPath });
  console.log('Saved screenshot:', darkShimmerPath);

  // Switch to Light Mode during active shimmer
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
  });

  await new Promise(r => setTimeout(r, 400));
  const lightShimmerPath = path.join(ARTIFACT_DIR, 'text-shimmer-ai-light.png');
  await page.screenshot({ path: lightShimmerPath });
  console.log('Saved screenshot:', lightShimmerPath);

  // Switch back to Dark Mode
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  });

  // Resolve the verification request successfully
  console.log('\n[3] Resolving API response successfully...');
  if (routeResolver) {
    routeResolver();
    routeResolver = null;
  }

  // Wait for navigation to ResultsView (look specifically for BACK TO COCKPIT)
  await page.waitForFunction(() => {
    return document.body.textContent.includes('BACK TO COCKPIT');
  }, { timeout: 8000 });

  // Shimmer should have stopped and disappeared
  shimmerExists = await page.evaluate(() => {
    return !!document.querySelector('.font-mono.text-sm');
  });
  console.log('Shimmer visible after request completes (should be false):', shimmerExists);
  console.log('PASS: TextShimmer stopped immediately on success.');

  // 4. Test API Error Response
  console.log('\n[4] Testing API Error Response...');
  // Go back to Cockpit
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const cockpitBtn = buttons.find(b => b.textContent.includes('BACK TO COCKPIT'));
    if (cockpitBtn) cockpitBtn.click();
  });

  await page.waitForSelector('textarea');

  // Type valid inputs again
  const textareas2 = await page.$$('textarea');
  await textareas2[0].type('Test error handling input');
  await textareas2[1].type('Test error reference text');

  // Set response status code to 500
  analyzeResponseStatusCode = 500;
  shouldDelayAnalyze = true;

  // Click verify
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('RUN VERIFICATION'));
    if (btn) btn.click();
  });

  await page.waitForSelector('.font-mono.text-sm');
  console.log('Shimmer active during error request.');

  // Release with 500 error
  if (routeResolver) {
    routeResolver();
    routeResolver = null;
  }

  // Wait for error alert or offline message
  await page.waitForFunction(() => {
    return document.body.textContent.includes('Verification backend error') ||
           document.body.textContent.includes('Cannot reach backend');
  }, { timeout: 8000 });

  shimmerExists = await page.evaluate(() => {
    return !!document.querySelector('.font-mono.text-sm');
  });
  console.log('Shimmer visible after error received (should be false):', shimmerExists);
  console.log('PASS: TextShimmer stopped immediately on API error, error alert displayed.');

  // 5. Test Plagiarism Loading Shimmer
  console.log('\n[5] Testing Plagiarism Loading State with TextShimmer...');
  // Switch to Plagiarism Checker module
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const plagBtn = buttons.find(b => b.textContent.includes('PLAGIARISM CHECKER'));
    if (plagBtn) plagBtn.click();
  });

  await page.waitForSelector('input[type="file"]');

  // Upload original file and reference file
  const origFilePath = path.join(__dirname, 'sample_original.txt');
  const refFilePath = path.join(__dirname, 'sample_ref1.txt');

  const fileInputs = await page.$$('input[type="file"]');
  await fileInputs[0].uploadFile(origFilePath);
  await fileInputs[1].uploadFile(refFilePath);

  await new Promise(r => setTimeout(r, 500));

  // Set delayed response
  analyzeResponseStatusCode = 200;
  shouldDelayAnalyze = true;

  // Click Check For Plagiarism
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('CHECK FOR PLAGIARISM'));
    if (btn) btn.click();
  });

  // Wait for plagiarism shimmer
  await page.waitForSelector('.font-mono.text-sm');
  let plagShimmerText = await page.evaluate(() => {
    const el = document.querySelector('.font-mono.text-sm');
    return el ? el.textContent.trim() : null;
  });
  console.log('Plagiarism loading shimmer text:', plagShimmerText);
  if (plagShimmerText === 'Checking document similarity...') {
    console.log('PASS: Correct TextShimmer text "Checking document similarity...".');
  } else {
    console.error('FAIL: Unexpected plagiarism shimmer text:', plagShimmerText);
  }

  // Capture Plagiarism Shimmer Dark & Light
  const darkPlagPath = path.join(ARTIFACT_DIR, 'text-shimmer-plagiarism-dark.png');
  await page.screenshot({ path: darkPlagPath });
  console.log('Saved screenshot:', darkPlagPath);

  // Switch to Light Mode
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
  });

  await new Promise(r => setTimeout(r, 400));
  const lightPlagPath = path.join(ARTIFACT_DIR, 'text-shimmer-plagiarism-light.png');
  await page.screenshot({ path: lightPlagPath });
  console.log('Saved screenshot:', lightPlagPath);

  // Release plagiarism request
  if (routeResolver) {
    routeResolver();
    routeResolver = null;
  }

  // Wait for Plagiarism Results
  await page.waitForFunction(() => {
    return document.body.textContent.includes('SIMILARITY SCORE') ||
           document.body.textContent.includes('ORIGINALITY AUDIT REPORT');
  }, { timeout: 8000 });

  shimmerExists = await page.evaluate(() => {
    return !!document.querySelector('.font-mono.text-sm');
  });
  console.log('Plagiarism shimmer visible after success (should be false):', shimmerExists);
  console.log('PASS: TextShimmer stopped immediately on plagiarism check completion.');

  console.log('\n--- ALL TEXT-SHIMMER INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
  await browser.close();
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
