// index.js
const express = require('express');
const fetch = require('node-fetch'); // تأكد إنك مثبت node-fetch
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// تمكين CORS لكل الطلبات
app.use(cors());

// لفك JSON من body إذا هتعمل POST
app.use(express.json());

// Route أساسي للتأكد إن السيرفر شغال
app.get('/', (req, res) => {
  res.send('Flutter API Proxy is running');
});

// مثال على بروكسي GET لأي API خارجي
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url; // هتبعت URL في query string ?url=...
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL is required as query parameter' });
  }

  try {
    const response = await fetch(targetUrl);
    const data = await response.json(); // أو response.text() حسب API
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch the target URL' });
  }
});

// مثال POST proxy
app.post('/proxy', async (req, res) => {
  const { url, body } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required in body' });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch the target URL' });
  }
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
