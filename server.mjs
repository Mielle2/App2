import express from "express";
import cors from "cors";
import sequelize from "./data/db.js";
import ingredientAPI from "./routes/ingredientAPI.mjs";
//import { startSession, updateSession } from "./middleware/session.mjs";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
//app.use(startSession);

app.use("/api", ingredientAPI);

app.get("/", (req, res, next) => res.send("Backend API kjører!"));

//app.use(updateSession);

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server kjører på port ${port}`);
    });
}).catch(err => console.error("Databasefeil:", err));