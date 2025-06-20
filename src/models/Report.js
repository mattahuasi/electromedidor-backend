import { DataTypes, NOW } from "sequelize";
import { sequelize } from "../database/database.js";
import { Hardware } from "./Hardware.js";

export const Report = sequelize.define("reports", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  detail: {
    type: DataTypes.TEXT,
  },
  content: {
    type: DataTypes.TEXT,
  },
  type: {
    type: DataTypes.STRING,
  },
  begin: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  end: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Hardware.hasMany(Report, {
  foreignKey: "hardwareId",
  sourceKey: "id",
});

Report.belongsTo(Hardware, {
  foreignKey: "hardwareId",
  targetKey: "id",
  allowNull: false,
  unique: true,
});
