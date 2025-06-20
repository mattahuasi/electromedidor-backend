import { sequelize } from "./database/database.js";
import mqttHandler from "./libs/mqttHandler.js";
import app from "./app.js";
import "./models/User.js";
import "./models/Hardware.js";
import "./models/Reading.js";
import "./models/Bill.js";
import "./models/Report.js";
import "dotenv/config";

async function main() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Connection has been established successfully.");

    app.listen(app.get("port"), () => {
      console.log(`Server listening on port ${app.get("port")}.`);
    });

    const mqttClient = new mqttHandler();
    mqttClient.connect();
  } catch (error) {
    console.log("Error during initialization:" + error);
  }
}

main();
