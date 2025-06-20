import Sequelize from "sequelize";
import "dotenv/config";

// export const sequelize = new Sequelize(
//   process.env.DB_DATABASE,
//   process.env.DB_USERNAME,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: process.env.DB_CONNECTION,
//     timezone: process.env.DB_TIMEZONE,
//   }
// );

// export const sequelize = new Sequelize(process.env.DB_URL, {
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });

export const sequelize = new Sequelize(process.env.DB_URL);

sequelize.options.logging = false;
