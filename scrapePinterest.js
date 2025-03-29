const puppeteer = require('puppeteer-core');

async function scrapePinterest(query) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome', // use Render or Railway's built-in Chrome
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;

  try {
    console.log(`🔍 Searching Pinterest for: "${query}"`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    await page.waitForSelector('div[data-test-id="pin"]', { timeout: 10000 });

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

    await browser.close();
    return results;
  } catch (err) {
    console.error('❌ Scraping failed:', err);
    await browser.close();
    return [];
  }
}

module.exports = scrapePinterest;
