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
        return res.status(400).json({ message: "Missing required query parameter: skinType" });
    }

    try {
        const skinTypeRecord = await SkinType.findOne({ where: { name: skinType } });
        if (!skinTypeRecord) return res.status(404).json({ message: "Skin type not found" });

        const skinTypeId = skinTypeRecord.id;

        const results = await sequelize.query(
            `SELECT i.name, 
                    i.description, 
                    i.compatibility->> :skinType AS rating 
             FROM ingredients i 
             WHERE LOWER(i.name) IN (${cleanIngredients.map(() => "?").join(",")})`,
            {
                replacements: { skinType: skinType.toLowerCase(), ...cleanIngredients },
                type: sequelize.QueryTypes.SELECT
            }
        );
        

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/check", async (req, res) => {
    const { ingredients, skinType } = req.body;
    if (!ingredients || !Array.isArray(ingredients) || !skinType) {
        return res.status(400).json({ message: "Invalid ingredient list or missing skinType" });
    }

    try {
        const cleanIngredients = ingredients.map(i => i.trim().toLowerCase());

        console.log("🔥 Checking database for ingredients:", cleanIngredients);

        const skinTypeRecord = await SkinType.findOne({ 
            where: sequelize.where(
                sequelize.fn('LOWER', sequelize.col('name')), 
                skinType.toLowerCase()
            )
        });

        if (!skinTypeRecord) {
            console.error("❌ Skin type not found in database!");
            return res.status(404).json({ message: "Skin type not found" });
        }

        const finalQuery = `
            SELECT i.name, isc.rating, i.description
            FROM ingredients i
            JOIN ingredient_skin_compatibility isc ON i.id = isc.ingredient_id
            JOIN skin_types st ON isc.skin_type_id = st.id
            WHERE LOWER(st.name) = ? 
            AND LOWER(i.name) IN (${cleanIngredients.map(() => "?").join(",")})
            ORDER BY isc.rating DESC
        `;

        const results = await sequelize.query(finalQuery, {
            replacements: [skinType.toLowerCase(), ...cleanIngredients],
            type: sequelize.QueryTypes.SELECT
        });
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});




export default router;
