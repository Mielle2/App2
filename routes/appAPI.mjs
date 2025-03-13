import express from "express";
import Ingredient from "../models/ingredients.js";

const apiRouter = express.Router();
apiRouter.use(express.json());

apiRouter.post("/check", async (req, res) => {
    const { ingredients, skinType } = req.body;
    if (!ingredients || !skinType) return res.status(400).json({ message: "Missing data" });

    const results = await Promise.all(ingredients.map(async (ingredient) => {
        const ing = await Ingredient.findOne({ where: { name: ingredient } });
        if (!ing) return { name: ingredient, compatibility: "Unknown", description: "No data found" };

        return {
            name: ing.name,
            compatibility: ing.compatibility[skinType] || "Unknown",
            description: ing.description
        };
    }));

    res.json(results);
});

export default apiRouter;
