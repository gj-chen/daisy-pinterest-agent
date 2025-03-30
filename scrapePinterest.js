const puppeteer = require('puppeteer');

async function scrapePinterest(query) {
  console.log(`🔍 Starting Pinterest scrape for query: "${query}"`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;

  try {
    console.log(`🌐 Navigating to: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    console.log('⏳ Waiting for pin selector to appear...');
    await page.waitForSelector('div[data-test-id="pin"]', { timeout: 10000 });

    console.log('✅ Pin selector found. Extracting results...');
    const results = await page.evaluate(() => {
      const pins = document.querySelectorAll('div[data-test-id="pin"]');
      return Array.from(pins).slice(0, 5).map(pin => {
        const img = pin.querySelector('img');
        const anchor = pin.closest('a');
        return {
          url: img?.src || null,
          alt: img?.alt || null,
          link: anchor?.href || null
        };
      }).filter(p => p.url && p.link);
    });

    console.log(`✅ Scraped ${results.length} image(s)`);
    await browser.close();
    return results;
  } catch (err) {
    console.error('❌ Scrape failed:', err.message);
    console.error(err.stack);
    await browser.close();
    return [];
  }
}

module.exports = scrapePinterest;
