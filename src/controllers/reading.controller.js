import { Hardware } from "../models/Hardware.js";
import { Reading } from "../models/Reading.js";
import { dateFormat, deleteRepiteDate } from "../libs/utils.js";
import { Op } from "sequelize";

export const getReadings = async (req, res) => {
  try {
    const { id } = req.params;

    const hardware = await Hardware.findByPk(id, {
      include: [{ model: Reading }],
    });
    if (!hardware)
      return res.status(404).json({ errors: ["Hardware not found"] });

    const readings = hardware.readings.map((reading) => ({
      id: reading.id,
      power: reading.power,
      voltage: reading.voltage,
      current: reading.current,
      powerFactor: reading.powerFactor,
      consumption: reading.consumption,
      hardwareId: hardware.id,
      createdAt: reading.createdAt,
    }));

    res.json(readings);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getReadingsDates = async (req, res) => {
  try {
    const { id } = req.params;

    const hardware = await Hardware.findByPk(id);
    if (!hardware)
      return res.status(404).json({ errors: ["Hardware not found"] });

    const readings = await Reading.findAll({
      where: {
        hardwareId: hardware.id,
      },
      order: [["id", "ASC"]],
    });

    const datesFormat = readings.map((reading) =>
      dateFormat(reading.createdAt)
    );

    const consumption = readings.map((reading) => ({
      id: reading.id,
      consumption: reading.consumption,
      createdAt: reading.createdAt,
    }));

    const deleteRepiteDates = deleteRepiteDate(datesFormat);

    const dates = deleteRepiteDates.map((date) => ({
      date,
    }));

    res.json({
      dates: dates,
      consumption: consumption,
    });
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getLastReadings = async (req, res) => {
  try {
    const { id } = req.params;

    const hardware = await Hardware.findByPk(id, {
      include: [{ model: Reading }],
    });
    if (!hardware)
      return res.status(404).json({ errors: ["Hardware not found"] });

    const sortedReadings = hardware.readings.sort(
      (a, b) => b.createdAt - a.createdAt
    );

    const lastReadings = sortedReadings.slice(0, 10);

    const readings = lastReadings.map((reading) => ({
      id: reading.id,
      power: reading.power,
      voltage: reading.voltage,
      current: reading.current,
      powerFactor: reading.powerFactor,
      consumption: reading.consumption,
      hardwareId: hardware.id,
      createdAt: reading.createdAt,
    }));

    res.json(readings);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getReadingsDay = async (req, res) => {
  try {
    const { id, date } = req.params;

    const hardware = await Hardware.findByPk(id);
    if (!hardware)
      return res.status(404).json({ errors: ["Hardware not found"] });

    let readings;

    if (date && new Date(date).toString() !== "Invalid Date") {
      readings = await Reading.findAll({
        where: {
          hardwareId: hardware.id,
          createdAt: {
            [Op.gte]: new Date(date), // Greater than or equal to the start of the day
            [Op.lt]: new Date(date + "T23:59:59.999Z"), // Less than the end of the day
          },
        },
      });
    } else {
      readings = await Reading.findAll({
        where: { hardwareId: hardware.id },
      });
    }

    if (!readings || readings.length === 0)
      return res
        .status(404)
        .json({ errors: ["No readings found for the specified date"] });

    return res.json(readings);
  } catch (error) {
    return res.status(500).json({ errors: [error.message] });
  }
};

// export const getReadingsDay = async (req, res) => {
//   try {
//     const { id, from, to } = req.params;

//     const hardware = await Hardware.findByPk(id);
//     if (!hardware)
//       return res.status(404).json({ errors: ["Hardware not found"] });

//     if (
//       from &&
//       to &&
//       new Date(from).toString() !== "Invalid Date" &&
//       new Date(to).toString() !== "Invalid Date"
//     ) {
//       const readings = await Reading.findAll({
//         where: {
//           hardwareId: hardware.id,
//           createdAt: { [Op.between]: [new Date(from), new Date(to)] },
//         },
//       });
//       if (!readings)
//         return res
//           .status(404)
//           .json({ errors: ["Hardware does not have reading"] });

//       return res.json(readings);
//     } else {
//       const readings = await Reading.findAll({
//         where: { hardwareId: hardware.id },
//       });
//       if (!readings)
//         return res
//           .status(404)
//           .json({ errors: ["Hardware does not have reading"] });

//       return res.json(readings);
//     }
//   } catch (error) {
//     return res.status(500).json({ errors: [error] });
//   }
// };

export const deleteReadings = async (req, res) => {
  try {
    const { id } = req.params;

    const hardware = await Hardware.findByPk(id, {
      include: [{ model: Reading }],
    });
    if (!hardware)
      return res.status(404).json({ errors: ["Hardware not found"] });

    hardware.reading.map(async (reading) => {
      await reading.destroy();
    });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const createReadingMQTT = async (name, reading) => {
  try {
    const hardware = await Hardware.findOne({ where: { name } });

    if (!hardware) return console.log("Hardwares doesn't exist");

    if (hardware.key) {
      const power = parseFloat(reading.potencia);
      const voltage = parseFloat(reading.voltaje);
      const current = parseFloat(reading.corriente);
      const powerFactor = parseFloat(reading.factorPotencia);
      const consumption = parseFloat(reading.consumo);

      const newReading = await Reading.create({
        power,
        voltage,
        current,
        powerFactor,
        consumption,
        hardwareId: hardware.id,
      });
    }
  } catch (error) {
    console.log("Error: " + error);
  }
};
