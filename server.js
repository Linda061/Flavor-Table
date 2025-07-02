require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  req.pool = pool;
  next();
});

const homeRoutes = require("./routes/home");
const recipeRoutes = require("./routes/recipes");

app.use("/", homeRoutes);
app.use("/recipes", recipeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
