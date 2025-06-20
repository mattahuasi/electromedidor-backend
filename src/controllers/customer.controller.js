import { User, Customer } from "../models/User.js";
import bcrypt from "bcryptjs";
import { Hardware } from "../models/Hardware.js";

export const createCustomer = async (req, res) => {
  try {
    const { firstName, lastName, ci, phone, email, password } = req.body;

    const userEmail = await Customer.findOne({
      include: [{ model: User, where: { email } }],
    });
    if (userEmail)
      return res.status(400).json({ errors: ["Email already exists"] });

    const userCi = await Customer.findOne({
      include: [{ model: User, where: { ci } }],
    });
    if (userCi) return res.status(400).json({ errors: ["CI already exists"] });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      ci,
      phone,
      email,
      password: passwordHash,
    });

    const newCustomer = await Customer.create({
      userId: newUser.id,
    });

    res.json({
      id: newCustomer.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      ci: newUser.ci,
      phone: newUser.phone,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [
        {
          model: User,
          attributes: [
            "firstName",
            "lastName",
            "ci",
            "phone",
            "email",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    const data = customers.map((customer) => ({
      id: customer.id,
      firstName: customer.user.firstName,
      lastName: customer.user.lastName,
      ci: customer.user.ci,
      phone: customer.user.phone,
      email: customer.user.email,
      createdAt: customer.user.createdAt,
      updatedAt: customer.user.updatedAt,
    }));

    res.json(data);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "ci", "phone", "email"],
        },
      ],
    });
    if (!customer) return res.status(404).json({ errors: ["User not found"] });

    res.json({
      id: customer.id,
      firstName: customer.user.firstName,
      lastName: customer.user.lastName,
      ci: customer.user.ci,
      phone: customer.user.phone,
      email: customer.user.email,
      createdAt: customer.user.createdAt,
      updatedAt: customer.user.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, ci, phone, email } = req.body;

    const customer = await Customer.findByPk(id, {
      attributes: ["id", "userId"],
    });
    if (!customer) return res.status(404).json({ errors: ["User not found"] });

    const userEmail = await User.findOne({ where: { email } });
    if (userEmail && customer.userId != userEmail.id)
      return res.status(400).json({ errors: ["Email already exists"] });

    const userCi = await User.findOne({ where: { ci } });
    if (userCi && customer.userId != userCi.id)
      return res.status(400).json({ errors: ["CI already exists"] });

    const user = await User.findByPk(customer.userId);
    user.firstName = firstName;
    user.lastName = lastName;
    if (user.ci != ci) user.ci = ci;
    user.phone = phone;
    user.email = email;

    await user.save();

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id, {
      include: [{ model: User }, { model: Hardware }],
    });
    if (!customer) return res.status(404).json({ errors: ["User not found"] });

    await Promise.all([
      customer.hardware.map(async (hardware) => {
        await hardware.destroy();
      }),
      await customer.destroy(),
      await customer.user.destroy(),
    ]);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getCustomerHardware = async (req, res) => {
  try {
    const customer = await Customer.findOne({ where: { userId: req.user.id } });
    if (!customer) return res.status(404).json({ errors: ["User not found"] });

    const hardware = await Hardware.findAll({
      where: { customerId: customer.id },
      order: [["id", "ASC"]],
    });

    res.json(hardware);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};
