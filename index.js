// index.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // تأكد مثبت node-fetch

const app = express();
const PORT = process.env.PORT || 8080;

// السماح بكل الطلبات من أي مصدر
app.use(cors());
app.use(express.json());

// Route للتأكد من تشغيل السيرفر
app.get('/', (req, res) => {
  res.send('Flutter API Proxy is running');
});

// البروكسي للـ GET API
app.get('/proxy', async (req, res) => {
  const endpoint = req.query.endpoint;
  if (!endpoint) return res.status(400).json({ error: 'Endpoint is required' });

  const targetUrl = `http://manarabdelhameed-001-site1.qtempurl.com/api${endpoint}`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch the target API' });
  }
});

// البروكسي للـ POST API
app.post('/proxy', async (req, res) => {
  const { endpoint, body } = req.body;
  if (!endpoint) return res.status(400).json({ error: 'Endpoint is required in body' });

  const targetUrl = `http://manarabdelhameed-001-site1.qtempurl.com/api${endpoint}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch the target API' });
  }
});

// بروكسي للصور (لتجاوز مشاكل CORS)
app.get('/proxy/image', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Image URL is required' });

  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.set('Content-Type', contentType);
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
