import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Customer } from "./User.js";
import { Hardware } from "./Hardware.js";

export const Bill = sequelize.define("bills", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
  },
  consumption: {
    type: DataTypes.FLOAT,
  },
  cost: {
    type: DataTypes.FLOAT,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Customer.hasMany(Bill, {
  foreignKey: "customerId",
  sourceKey: "id",
});

Bill.belongsTo(Customer, {
  foreignKey: "customerId",
  targetKey: "id",
  allowNull: false,
  unique: true,
});

Hardware.hasMany(Bill, {
  foreignKey: "hardwareId",
  sourceKey: "id",
});

Bill.belongsTo(Hardware, {
  foreignKey: "hardwareId",
  targetKey: "id",
  allowNull: false,
  unique: true,
});
