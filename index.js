const express = require('express');
const cors = require('cors');
const scrapePinterest = require('./scrapePinterest');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/search-pinterest', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  try {
    const results = await scrapePinterest(query);
    res.json({ results });
  } catch (err) {
    console.error('❌ Error in /search-pinterest:', err);
    res.status(500).json({ error: 'Failed to scrape' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Daisy Pinterest Agent running on port ${PORT}`);
});
