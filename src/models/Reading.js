import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Hardware } from "./Hardware.js";

export const Reading = sequelize.define("readings", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  power: {
    type: DataTypes.FLOAT,
  },
  voltage: {
    type: DataTypes.FLOAT,
  },
  current: {
    type: DataTypes.FLOAT,
  },
  powerFactor: {
    type: DataTypes.FLOAT,
  },
  consumption: {
    type: DataTypes.FLOAT,
  },
});

Hardware.hasMany(Reading, {
  foreignKey: "hardwareId",
  sourceKey: "id",
});

Reading.belongsTo(Hardware, {
  foreignKey: "hardwareId",
  targetKey: "id",
  allowNull: false,
  unique: true,
});
