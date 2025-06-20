import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  ci: {
    type: DataTypes.STRING,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
});

export const Employee = sequelize.define("employees", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  staff: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export const Customer = sequelize.define(
  "customers",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
);

User.hasOne(Employee, {
  foreignKey: "userId",
  sourceKey: "id",
});

Employee.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  allowNull: false,
  unique: true,
});

User.hasOne(Customer, {
  foreignKey: "userId",
  sourceKey: "id",
});

Customer.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  allowNull: false,
  unique: true,
});
