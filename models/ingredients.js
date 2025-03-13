import { DataTypes } from "sequelize";
import sequelize from "../data/db.js";

const Ingredient = sequelize.define("Ingredient", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    compatibility: {
        type: DataTypes.JSON,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

export default Ingredient;
