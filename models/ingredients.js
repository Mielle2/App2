import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Ingredient = sequelize.define("Ingredient", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    compatibility: {
        type: DataTypes.STRING, // "Grønn", "Blå", "Gul", "Rød"
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

export default Ingredient;