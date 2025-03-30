import express from 'express';
import cors from 'cors';
import { scrapePinterest } from './scrapePinterest.js';

const app = express();
app.use(cors());

app.get('/search-pinterest', async (req, res) => {
  const query = req.query.q;
  console.log(`[server] Received search request for: ${query}`);

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter ?q=' });
  }

  try {
    const results = await scrapePinterest(query);
    res.json({ images: results });
  } catch (error) {
    console.error(`[server] Error during Pinterest scrape:`, error);
    res.status(500).json({ error: 'Failed to fetch Pinterest images' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[server] Pinterest agent listening on port ${PORT}`);
});
