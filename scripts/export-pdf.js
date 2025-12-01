const puppeteer = require('puppeteer');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '../pdf-exports');
const fs = require('fs');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper function to wait (replaces deprecated page.waitForTimeout)
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function captureSlides() {
  console.log('🚀 Starting PDF export...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set viewport to desktop size (16:9 ratio)
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2
  });

  // Navigate to the presentation
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

  // Wait for content to load
  await page.waitForSelector('.presentation', { timeout: 10000 });

  // Hide navigation elements
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .navigation-area,
      .slide-counter,
      .keyboard-hint-container,
      .presentation-header {
        display: none !important;
      }
      .slide-container {
        padding-bottom: var(--space-8) !important;
      }
    `;
    document.head.appendChild(style);
  });

  // Get total number of main slides
  const mainSlideCount = await page.evaluate(() => {
    return document.querySelectorAll('.slide-indicators .indicator').length;
  });

  console.log(`📄 Found ${mainSlideCount} main slides`);

  // Capture main presentation
  console.log('📸 Capturing main presentation...');
  const mainPdfPages = [];

  for (let i = 0; i < mainSlideCount; i++) {
    console.log(`  Slide ${i + 1}/${mainSlideCount}`);

    // Wait for slide animation to complete
    await wait(500);

    // Capture the slide
    const slideBuffer = await page.pdf({
      width: '1920px',
      height: '1080px',
      printBackground: true,
      preferCSSPageSize: false
    });

    mainPdfPages.push(slideBuffer);

    // Navigate to next slide (except on last slide)
    if (i < mainSlideCount - 1) {
      await page.keyboard.press('ArrowRight');
      await wait(600);
    }
  }

  // Save main presentation
  const mainPdfPath = path.join(OUTPUT_DIR, 'monolit-presentation.pdf');

  // Merge PDF pages
  const PDFDocument = require('pdf-lib').PDFDocument;
  const mainPdfDoc = await PDFDocument.create();

  for (const buffer of mainPdfPages) {
    const pdfDoc = await PDFDocument.load(buffer);
    const [page] = await mainPdfDoc.copyPages(pdfDoc, [0]);
    mainPdfDoc.addPage(page);
  }

  const mainPdfBytes = await mainPdfDoc.save();
  fs.writeFileSync(mainPdfPath, mainPdfBytes);
  console.log(`✅ Main presentation saved: ${mainPdfPath}`);

  // Check if there are deep dive slides
  // Navigate to Market Size slide (slide 5, index 5)
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.presentation');

  // Hide navigation again
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .navigation-area,
      .slide-counter,
      .keyboard-hint-container,
      .presentation-header {
        display: none !important;
      }
      .slide-container {
        padding-bottom: var(--space-8) !important;
      }
    `;
    document.head.appendChild(style);
  });

  // Navigate to Market Size slide (index 5)
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('ArrowRight');
    await wait(400);
  }

  // Check if down arrow exists (has deep dive)
  const hasDeepDive = await page.evaluate(() => {
    const downButton = Array.from(document.querySelectorAll('.nav-button'))
      .find(btn => btn.querySelector('.arrow')?.textContent === '↓');
    return !!downButton;
  });

  if (hasDeepDive) {
    console.log('\n📊 Found deep dive slides');

    // Enter deep dive mode
    await page.keyboard.press('ArrowDown');
    await wait(800);

    // Get deep dive slide count
    const deepDiveSlideCount = await page.evaluate(() => {
      return document.querySelectorAll('.slide-indicators .indicator').length;
    });

    console.log(`📄 Found ${deepDiveSlideCount} deep dive slides`);
    console.log('📸 Capturing deep dive presentation...');

    const deepDivePdfPages = [];

    for (let i = 0; i < deepDiveSlideCount; i++) {
      console.log(`  Deep Dive Slide ${i + 1}/${deepDiveSlideCount}`);

      await wait(500);

      const slideBuffer = await page.pdf({
        width: '1920px',
        height: '1080px',
        printBackground: true,
        preferCSSPageSize: false
      });

      deepDivePdfPages.push(slideBuffer);

      if (i < deepDiveSlideCount - 1) {
        await page.keyboard.press('ArrowRight');
        await wait(600);
      }
    }

    // Save deep dive presentation
    const deepDivePdfPath = path.join(OUTPUT_DIR, 'monolit-market-size-deep-dive.pdf');
    const deepDivePdfDoc = await PDFDocument.create();

    for (const buffer of deepDivePdfPages) {
      const pdfDoc = await PDFDocument.load(buffer);
      const [page] = await deepDivePdfDoc.copyPages(pdfDoc, [0]);
      deepDivePdfDoc.addPage(page);
    }

    const deepDivePdfBytes = await deepDivePdfDoc.save();
    fs.writeFileSync(deepDivePdfPath, deepDivePdfBytes);
    console.log(`✅ Deep dive presentation saved: ${deepDivePdfPath}`);
  }

  await browser.close();

  console.log('\n🎉 PDF export complete!');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

// Run the script
captureSlides().catch(error => {
  console.error('❌ Error during PDF export:', error);
  process.exit(1);
});
