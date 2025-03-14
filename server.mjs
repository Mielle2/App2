import express from "express";
import cors from "cors";
import sequelize from "./data/db.js";
import ingredientAPI from "./routes/ingredientAPI.mjs";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api", ingredientAPI);

app.get("/", (req, res) => res.send("Backend API kjører!"));

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server kjører på port ${port}`);
    });
}).catch(err => console.error("Databasefeil:", err));