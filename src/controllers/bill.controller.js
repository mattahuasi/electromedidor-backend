import { Bill } from "../models/Bill.js";
import { Hardware } from "../models/Hardware.js";
import { Reading } from "../models/Reading.js";
import { Op } from "sequelize";

export const createBill = async (req, res) => {
  try {
    const { date, consumption, cost, status, customerId, hardwareId } =
      req.body;

    const newBill = await Bill.create({
      date,
      consumption,
      cost,
      status,
      customerId,
      hardwareId,
    });

    res.json(newBill);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getBills = async (req, res) => {
  try {
    const bills = await Bill.findAll();

    const data = bills.map((bill) => ({
      id: bill.id,
      date: bill.date,
      consumption: bill.consumption,
      cost: bill.cost,
      status: bill.status,
      customerId: bill.customerId,
      hardwareId: bill.hardwareId,
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt,
    }));

    res.json(data);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getBill = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findByPk(id);
    if (!bill) return res.status(404).json({ errors: ["Bill not found"] });

    res.json(bill);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const bill = await Bill.findByPk(id);
    if (!bill) return res.status(404).json({ errors: ["Bill not found"] });

    bill.status = status;

    await bill.save();

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findByPk(id);
    if (!bill) return res.status(404).json({ errors: ["Bill not found"] });

    await bill.destroy();

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const generateBills = async (req, res) => {
  try {
    const hardware = await Hardware.findAll({
      attributes: ["id", "area", "customerId"],
    });
    if (!hardware)
      return res.status(404).json({ errors: ["Hardware not found"] });

    hardware.forEach((element) => {
      generateBillById(element.id);
    });

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const generateBill = async (req, res) => {
  try {
    const { id } = req.params;

    const hardware = await Hardware.findByPk(id, {
      attributes: ["id", "area", "customerId"],
    });
    if (!hardware)
      return res.status(404).json({ errors: ["Hardware not found"] });

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const bill = await Bill.findOne({
      where: {
        hardwareId: hardware.id,
        createdAt: {
          [Op.and]: [
            { [Op.gte]: new Date(year, month - 1, 1) },
            { [Op.lt]: new Date(year, month, 1) },
          ],
        },
      },
    });
    if (bill) return res.status(400).json({ errors: ["Bill already exist"] });

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);

    const consumption = await Reading.sum("consumption", {
      where: {
        hardwareId: hardware.id,
        createdAt: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth],
        },
        consumption: { [Op.not]: null },
      },
    });

    let cost = 0;
    if (hardware.area) cost = consumption * 0.63;
    else cost = consumption * 1.59;

    const newBill = await Bill.create({
      date: new Date(),
      consumption: consumption.toFixed(2),
      cost: cost.toFixed(2),
      status: false,
      customerId: hardware.customerId,
      hardwareId: hardware.id,
    });

    res.json(newBill);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const generateBillById = async (id) => {
  try {
    const hardware = await Hardware.findByPk(id, {
      attributes: ["id", "area", "customerId"],
    });
    if (!hardware) return "Hardware not found";

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const bill = await Bill.findOne({
      where: {
        hardwareId: hardware.id,
        createdAt: {
          [Op.and]: [
            { [Op.gte]: new Date(year, month - 1, 1) },
            { [Op.lt]: new Date(year, month, 1) },
          ],
        },
      },
    });
    if (bill) return "Bill already exist";

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);

    const consumption = await Reading.sum("consumption", {
      where: {
        hardwareId: hardware.id,
        createdAt: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth],
        },
        consumption: { [Op.not]: null },
      },
    });

    let cost = 0;
    if (hardware.area) cost = consumption * 0.63;
    else cost = consumption * 1.59;

    const newBill = await Bill.create({
      date: new Date(),
      consumption: consumption ? consumption.toFixed(2) : 0,
      cost: cost ? cost.toFixed(2) : 0,
      status: false,
      customerId: hardware.customerId,
      hardwareId: hardware.id,
    });

    return newBill;
  } catch (error) {
    return console.log("Errors" + error.message);
  }
};
