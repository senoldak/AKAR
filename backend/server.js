import express from 'express';
import cors from 'cors';
import { 
  initDb, 
  getLatestPrices, 
  getCityPrices, 
  getHistoricalPrices, 
  getSummaryStats, 
  getCitiesList 
} from './db.js';
import { fetchLiveFuelPrices, fetchHistoricalArchive } from './scraper.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database on server start
await initDb();

// Automatically trigger initial live scrape check
fetchLiveFuelPrices().catch(err => console.error('Initial scrape error:', err));

// API Endpoints

// 1. Get latest prices per city
app.get('/api/prices/latest', async (req, res) => {
  try {
    const data = await getLatestPrices();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get price details for a specific city and its districts
app.get('/api/prices/city/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    const data = await getCityPrices(cityName);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get historical price trends
app.get('/api/prices/historical', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const data = await getHistoricalPrices(days);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get overall market summary & statistics
app.get('/api/summary', async (req, res) => {
  try {
    const data = await getSummaryStats();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get list of all available cities
app.get('/api/cities', async (req, res) => {
  try {
    const data = await getCitiesList();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Manual trigger for scraping live prices
app.post('/api/scrape', async (req, res) => {
  try {
    const result = await fetchLiveFuelPrices();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Trigger fetching full historical archive from Petrol Ofisi
app.post('/api/scrape-history', async (req, res) => {
  try {
    const { startDate, endDate } = req.body || {};
    const records = await fetchHistoricalArchive(startDate || '2023-01-01', endDate || '2026-07-30');
    res.json({ success: true, count: records.length, sample: records.slice(0, 5) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Backend Express server is running on http://localhost:${PORT}`);
});
