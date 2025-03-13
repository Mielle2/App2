import { DataTypes } from "sequelize";
import sequelize from "../data/db.js";

const SkinType = sequelize.define("SkinType", {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { tableName: "skin_types", timestamps: false });

export default SkinType;