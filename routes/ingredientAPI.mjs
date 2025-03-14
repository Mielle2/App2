import express from "express";
import sequelize from "../data/db.js";
import { DataTypes } from "sequelize";
import Ingredient from "../models/ingredients.js";
import { Op } from "sequelize";
import SkinType from "../models/skinType.js";
import IngredientSkinCompatibility from "../models/ingredientSkinCompatibility.js";

const router = express.Router();

router.get("/ingredients", async (req, res) => {
  const { skinType } = req.query;

  if (!skinType) {
    return res
      .status(400)
      .json({ message: "Missing required query parameter: skinType" });
  }

  try {
    console.log("🔥 Received skinType:", skinType);

    const skinTypeRecord = await SkinType.findOne({
      where: { name: skinType },
    });
    if (!skinTypeRecord) {
      console.error("❌ Skin type not found!");
      return res.status(404).json({ message: "Skin type not found" });
    }

    console.log("🔥 Found skinType ID:", skinTypeRecord.id);

    const results = await sequelize.query(
      `SELECT i.name, 
                    i.description, 
                    i.compatibility->> :skinType AS rating 
             FROM ingredients i 
             WHERE LOWER(i.name) IN (SELECT LOWER(name) FROM ingredients)`,
      {
        replacements: { skinType: skinType.toLowerCase() },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log("🔥 Database Query Results:", results);
    res.json(results);
  } catch (error) {
    console.error("❌ API Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/check", async (req, res) => {
  const { ingredients, skinType } = req.body;

  if (!ingredients || !Array.isArray(ingredients) || !skinType) {
    return res
      .status(400)
      .json({ message: "Invalid ingredient list or missing skinType" });
  }

  try {
    const cleanIngredients = ingredients.map((i) => i.trim().toLowerCase());

    console.log("🔥 Checking database for ingredients:", cleanIngredients);
    console.log("🔥 SkinType received:", skinType);

    const skinTypeRecord = await SkinType.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("name")),
        skinType.toLowerCase()
      ),
    });

    if (!skinTypeRecord) {
      console.error("❌ Skin type not found in database!");
      return res.status(404).json({ message: "Skin type not found" });
    }

    console.log("🔥 Found skinType ID:", skinTypeRecord.id);

    const placeholders = cleanIngredients.map(() => "?").join(",");
    const finalQuery = `
    SELECT name, 
           description, 
           compatibility->> :skinType AS rating 
    FROM ingredients 
    WHERE LOWER(name) = ANY(ARRAY[:ingredients])
`;

console.log("🔥 Final SQL Query:", finalQuery);
console.log("🔥 Query Parameters:", {
    skinType: skinType.toLowerCase(),
    ingredients: cleanIngredients
});

const results = await sequelize.query(finalQuery, {
    replacements: { skinType: skinType.toLowerCase(), ingredients: cleanIngredients },
    type: sequelize.QueryTypes.SELECT
});


    console.log("🔥 Database Query Results:", results);
    res.json(results);
  } catch (error) {
    console.error("❌ Internal API Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

export default router;
