import { DataTypes } from "sequelize";
import sequelize from "../data/db.js";
import SkinType from "./skinType.js";
import Ingredient from "./ingredients.js";

const IngredientSkinCompatibility = sequelize.define("IngredientSkinCompatibility", {
    ingredient_id: { type: DataTypes.INTEGER, references: { model: "ingredients", key: "id" } },
    skin_type_id: { type: DataTypes.INTEGER, references: { model: "skin_types", key: "id" } },
    rating: { type: DataTypes.STRING, allowNull: false },
}, { tableName: "ingredient_skin_compatibility", timestamps: false });

IngredientSkinCompatibility.belongsTo(SkinType, { foreignKey: "skin_type_id" });
IngredientSkinCompatibility.belongsTo(Ingredient, { foreignKey: "ingredient_id" });

export default IngredientSkinCompatibility;
