const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

app.get("/api/hello", (req, res) => {
  res.json({ greeting: "Hello from Express" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
