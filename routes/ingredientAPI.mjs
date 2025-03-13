import express from "express";
import sequelize from "../data/db.js";
import { DataTypes } from "sequelize";
import Ingredient from "../models/ingredients.js";

const router = express.Router();

import SkinType from "../models/skinType.js";
import IngredientSkinCompatibility from "../models/ingredientSkinCompatibility.js";

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
            `SELECT i.name, isc.rating, i.description
             FROM ingredients i
             JOIN ingredient_skin_compatibility isc ON i.id = isc.ingredient_id
             WHERE isc.skin_type_id = :skinTypeId
             ORDER BY isc.rating DESC`,
            {
                replacements: { skinTypeId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/check", async (req, res) => {
    const { ingredients } = req.body;
    if (!ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ message: "Invalid ingredient list" });
    }

    try {
        const results = await Promise.all(ingredients.map(async (ingredient) => {
            const ing = await Ingredient.findOne({ 
                where: sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('name')), 
                    ingredient.toLowerCase()
                )
            });

            if (!ing) return { name: ingredient, compatibility: "Unknown", description: "No data found" };

            const compatibilityData = await IngredientSkinCompatibility.findAll({
                where: { ingredient_id: ing.id },
                include: [{ model: SkinType, attributes: ["name"] }]
            });

            return {
                name: ing.name,
                compatibility: compatibilityData.map(c => ({
                    skinType: c.SkinType.name,
                    rating: c.rating
                })),
                description: ing.description
            };
        }));

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
