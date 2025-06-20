import { Hardware } from "../models/Hardware.js";
import { Reading } from "../models/Reading.js";
import { Bill } from "../models/Bill.js";

export const createHardware = async (req, res) => {
  try {
    const { name, address, key, area, customerId } = req.body;

    const hardware = await Hardware.findOne({ where: { name } });
    if (hardware)
      return res.status(400).json({ errors: ["Hardware already exists"] });

    const newHardware = await Hardware.create({
      name,
      address,
      key,
      area,
      customerId: customerId,
    });

    res.json(newHardware);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getHardware = async (req, res) => {
  try {
    const hardware = await Hardware.findAll({
      order: [["id", "ASC"]],
    });

    const data = hardware.map((item) => ({
      id: item.id,
      name: item.name,
      address: item.address,
      key: item.key,
      area: item.area,
      customerId: item.customerId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    res.json(data);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getOneHardware = async (req, res) => {
  try {
    const { id } = req.params;

    const hardware = await Hardware.findByPk(id);
    if (!hardware) return res.status(404).json("Hardware not found");

    res.json(hardware);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const updateHardware = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, key, area, customerId } = req.body;

    const hardware = await Hardware.findByPk(id);
    if (!hardware) return res.status(404).json("Hardware not found");

    const nameHardware = await Hardware.findOne({ where: { name } });
    if (nameHardware && hardware.id != nameHardware.id)
      return res.status(400).json({ errors: ["Hardware already exists"] });

    if (name != hardware.name) hardware.name = name;
    hardware.address = address;
    hardware.key = key;
    hardware.area = area;
    hardware.customerId = customerId;

    await hardware.save();

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const deleteHardware = async (req, res) => {
  try {
    const { id } = req.params;

    const hardware = await Hardware.findByPk(id, {
      include: [{ model: Reading }],
    });
    if (!hardware)
      return res.status(404).json({ errors: ["Hardware not found"] });

    await Promise.all([
      hardware.reading.map(async (reading) => {
        await reading.destroy();
      }),
      await hardware.destroy(),
    ]);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getHardwareMQTT = async () => {
  try {
    const hardware = await Hardware.findAll();

    return hardware;
  } catch (error) {
    return error;
  }
};

export const updateHardwareKeyMQTT = async (name, arg) => {
  try {
    const hardware = await Hardware.findOne({ where: { name } });
    if (!hardware) return console.log("Hardware doesn't exist");

    if (arg === 1) hardware.key = true;
    else if (arg === 0) hardware.key = false;

    await hardware.save();
  } catch (error) {
    return error;
  }
};

export const getHardwareDebt = async (req, res) => {
  try {
    const hardware = await Hardware.findAll({
      order: [["id", "ASC"]],
      include: { model: Bill, where: { status: false } },
    });

    let debtors = [];
    hardware.forEach((element) => {
      if (element.bills.length >= 3) debtors.push(element);
    });

    const data = debtors.map((hardware) => ({
      id: hardware.id,
      name: hardware.name,
      address: hardware.address,
      key: hardware.key,
      area: hardware.area,
      customerId: hardware.customerId,
      debt: hardware.bills.length,
    }));

    res.json(data);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};
