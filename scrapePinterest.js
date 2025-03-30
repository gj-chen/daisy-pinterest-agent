import puppeteer from 'puppeteer';

export async function scrapePinterest(keyword) {
  console.log(`[scrapePinterest] Launching Puppeteer for keyword: ${keyword}`);

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    console.log(`[scrapePinterest] Chromium path: ${puppeteer.executablePath()}`);
  } catch (launchError) {
    console.error(`[scrapePinterest] Failed to launch browser:`, launchError);
    throw new Error('Failed to launch Puppeteer');
  }

  try {
    const page = await browser.newPage();
    console.log(`[scrapePinterest] Opened new page`);

    const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(keyword)}`;
    console.log(`[scrapePinterest] Navigating to: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Example selector – you may need to adjust this
    const imageUrls = await page.evaluate(() =>
      Array.from(document.querySelectorAll('img'))
        .map((img) => img.src)
        .filter((src) => src && src.startsWith('https'))
    );

    console.log(`[scrapePinterest] Found ${imageUrls.length} images`);
    return imageUrls.slice(0, 20); // return top 20 results
  } catch (scrapeError) {
    console.error(`[scrapePinterest] Error scraping Pinterest:`, scrapeError);
    throw new Error('Failed to scrape Pinterest');
  } finally {
    if (browser) {
      await browser.close();
      console.log(`[scrapePinterest] Browser closed`);
    }
  }
}