const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.all("/*", async (req, res) => {
  const url = `http://manarabdelhameed-001-site1.qtempurl.com${req.path}`;
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" && req.body ? JSON.stringify(req.body) : undefined,
    });

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
      res.set("Content-Type", "application/json");
    } else {
      data = await response.text();
    }

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    res.send(data);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
