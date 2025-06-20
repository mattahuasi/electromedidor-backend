import { User, Employee } from "../models/User.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";

export const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, ci, phone, email, password, staff, admin } =
      req.body;

    const userEmail = await Employee.findOne({
      include: [{ model: User, where: { email } }],
    });
    if (userEmail)
      return res.status(400).json({ errors: ["Email already exists"] });

    const userCi = await Employee.findOne({
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

    const myUser = await User.findByPk(req.user.id, {
      include: [{ model: Employee }],
    });
    if (myUser.employee.admin) {
      const newEmployee = await Employee.create({
        staff,
        admin,
        userId: newUser.id,
      });

      return res.json({
        id: newEmployee.id,
        staff: newEmployee.staff,
        admin: newEmployee.admin,
        user: newUser,
      });
    } else {
      const newEmployee = await Employee.create({
        staff: false,
        admin: false,
        userId: newUser.id,
      });

      return res.json({
        id: newEmployee.id,
        staff: newEmployee.staff,
        admin: newEmployee.admin,
        user: newUser,
      });
    }
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const myUser = await User.findByPk(req.user.id, {
      include: [{ model: Employee }],
    });

    if (myUser.employee.admin) {
      const employees = await Employee.findAll({
        where: { id: { [Op.ne]: req.user.id } },
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName", "ci", "phone", "email"],
          },
        ],
        order: [["id", "ASC"]],
      });

      const data = employees.map((employee) => ({
        id: employee.id,
        firstName: employee.user.firstName,
        lastName: employee.user.lastName,
        ci: employee.user.ci,
        phone: employee.user.phone,
        email: employee.user.email,
        staff: employee.staff,
        admin: employee.admin,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
      }));

      return res.json(data);
    } else {
      const employees = await Employee.findAll({
        where: { id: { [Op.ne]: req.user.id }, staff: true, admin: false },
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName", "ci", "phone", "email"],
          },
        ],
        order: [["id", "ASC"]],
      });

      const data = employees.map((employee) => ({
        id: employee.id,
        firstName: employee.user.firstName,
        lastName: employee.user.lastName,
        ci: employee.user.ci,
        phone: employee.user.phone,
        email: employee.user.email,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
      }));

      return res.json(data);
    }
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "ci", "phone", "email"],
        },
      ],
    });
    if (!employee) return res.status(404).json({ errors: ["User not found"] });

    res.json({
      id: employee.id,
      firstName: employee.user.firstName,
      lastName: employee.user.lastName,
      ci: employee.user.ci,
      phone: employee.user.phone,
      email: employee.user.email,
      staff: employee.staff,
      admin: employee.admin,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, ci, phone, email, staff, admin } = req.body;

    const employee = await Employee.findByPk(id, {
      attributes: ["id", "staff", "admin", "userId"],
    });
    if (!employee) return res.status(404).json({ errors: ["User not found"] });

    const userEmail = await Employee.findOne({
      include: [{ model: User, where: { email } }],
    });
    if (userEmail && employee.userId != userEmail.userId)
      return res.status(400).json({ errors: ["Email already exists"] });

    const userCi = await Employee.findOne({
      include: [{ model: User, where: { ci } }],
    });
    if (userCi && employee.userId != userCi.userId)
      return res.status(400).json({ errors: ["CI already exists"] });

    const user = await User.findByPk(employee.userId);
    user.firstName = firstName;
    user.lastName = lastName;
    if (user.ci != ci) user.ci = ci;
    user.phone = phone;
    user.email = email;

    const myUser = await User.findByPk(req.user.id, {
      include: [{ model: Employee }],
    });

    if (myUser.employee.admin) {
      employee.staff = staff;
      employee.admin = admin;
    }

    await Promise.all([user.save(), employee.save()]);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);
    if (!employee) return res.status(404).json({ errors: ["User not found"] });

    const user = await User.findByPk(employee.userId);

    await Promise.all([await employee.destroy(), await user.destroy()]);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};
