import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Customer } from "./User.js";

export const Hardware = sequelize.define("hardware", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
  address: {
    type: DataTypes.TEXT,
  },
  key: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  area: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Customer.hasMany(Hardware, {
  foreignKey: "customerId",
  sourceKey: "id",
});

Hardware.belongsTo(Customer, {
  foreignKey: "customerId",
  targetKey: "id",
  allowNull: false,
  unique: true,
});
