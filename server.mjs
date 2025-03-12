import express from "express";
import cors from "cors";
import sequelize from "./data/db.js";
import Ingredient from "./models/Ingredient.js";

server.set("port", port);

const server = express();
server.use(express.json());
server.use(express.static("public"));
server.use(cors());

server.post("/check", async (req, res) => {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: "Ugyldig ingrediensliste" });
    }

    const results = await Promise.all(ingredients.map(async (name) => {
        const ingredient = await Ingredient.findOne({ where: { name } });
        return ingredient ? 
            { name, compatibility: ingredient.compatibility, description: ingredient.description } :
            { name, compatibility: "Ukjent", description: "Ingen informasjon funnet." };
    }));

    res.json(results);
});

const port = process.env.port || 8000;
server.listen(port, async () => {
    console.log(`Server kjører på port ${port}`);
    await sequelize.sync();
});

server.listen(server.get("port"), function () {
    console.log("server running", server.get("port"));
  });
