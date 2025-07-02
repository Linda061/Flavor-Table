const express = require("express");
const router = express.Router();

router.get("/random", async (req, res) => {
  const pool = req.pool;

  try {
    const result = await pool.query("SELECT * FROM recipes ORDER BY RANDOM() LIMIT 1");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching random recipe:", error.message);
    res.status(500).json({ error: "Failed to fetch random recipe" });
  }
});

router.get("/search", async (req, res) => {
  const pool = req.pool;
  const { ingredients } = req.query;
  if (!ingredients) {
    return res.status(400).json({ error: "Ingredients are required" });
  }

  try {
    const ingredientsArray = JSON.parse(ingredients);
    const result = await pool.query(
      "SELECT * FROM recipes WHERE ingredients @> $1::jsonb",
      [JSON.stringify(ingredientsArray)]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error searching recipes:", error.message);
    res.status(500).json({ error: "Failed to search recipes" });
  }
});

router.post("/add", async (req, res) => {
  const pool = req.pool;
  const { recipe_id, user_id } = req.body;

  if (!recipe_id || !user_id) {
    return res.status(400).json({ error: "Recipe ID and User ID are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO favorites (recipe_id, user_id) VALUES ($1, $2) RETURNING *",
      [recipe_id, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding to favorites:", error.message);
    res.status(500).json({ error: "Failed to add to favorites" });
  }
});

router.get("/all", async (req, res) => {
  const pool = req.pool;
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const result = await pool.query(
      "SELECT recipes.* FROM favorites JOIN recipes ON favorites.recipe_id = recipes.id WHERE favorites.user_id = $1",
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No favorite recipes found" });
    }
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favorite recipes:", error.message);
    res.status(500).json({ error: "Failed to fetch favorite recipes" });
  }
});

router.delete("/:id", async (req, res) => {
  const pool = req.pool;
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Recipe ID is required" });
  }

  try {
    const result = await pool.query("DELETE FROM favorites WHERE recipe_id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Recipe not found in favorites" });
    }
    res.status(200).json({ message: "Recipe deleted from favorites" });
  } catch (error) {
    console.error("Error deleting recipe:", error.message);
    res.status(500).json({ error: "Failed to delete recipe from favorites" });
  }
});

module.exports = router;
