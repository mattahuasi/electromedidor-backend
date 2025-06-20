import {
  getHardwareMQTT,
  updateHardwareKeyMQTT,
} from "../controllers/hardware.controller.js";
import { createReadingMQTT } from "../controllers/reading.controller.js";
import mqtt from "mqtt";

class mqttHandler {
  constructor() {
    this.mqttClient = null;
    this.options = {
      host: process.env.MQTT_HOST,
      port: process.env.MQTT_PORT,
      protocol: process.env.MQTT_PROTOCOL,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    };

    this.mqttClient = mqtt.connect(this.options);
  }
  connect() {
    this.mqttClient.on("error", (error) => {
      console.log(error);
      this.mqttClient.end();
    });

    this.mqttClient.on("connect", () => {
      console.log("MQTT client has connected.");
      subscribe();
    });

    const subscribe = async () => {
      const res = await getHardwareMQTT();

      res.forEach((hardware) => {
        const name = hardware.dataValues.name;
        this.mqttClient.subscribe(`server/medidor/${name}`, { qos: 0 });
        this.mqttClient.subscribe(`client/medidor/${name}`, { qos: 0 });
      });
    };

    this.mqttClient.on("message", async function (topic, message) {
      const topicVector = topic.toString().split("/");
      const name = topicVector[2].trim();

      if (message.toString() === "1" || message.toString() === "0") {
        const arg = message.toString() === "1" ? 1 : 0;
        await updateHardwareKeyMQTT(name, arg);
      } else {
        let reading = message.toString();
        reading = JSON.parse(reading);
        await createReadingMQTT(name, reading);
      }
    });

    this.mqttClient.on("close", () => {
      console.log(
        "MQTT client has been disconnected. Attempting to reconnect..."
      );
      this.mqttClient.reconnect();
    });
  }
}

export default mqttHandler;
