import { User, Employee, Customer } from "../models/User.js";
import { createdAccessToken } from "../libs/jwt.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, ci, phone, email, password } = req.body;

    const userEmail = await User.findOne({ where: { email } });
    if (userEmail)
      return res.status(400).json({ errors: ["User already exists"] });

    const userCi = await User.findOne({ where: { ci } });
    if (userCi)
      return res.status(400).json({ errors: ["User already exists"] });

    const PasswordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      ci,
      phone,
      email,
      password: PasswordHash,
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
    });
  } catch (error) {
    res.status(500).json({ errors: [error.message] });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await User.findOne({
      where: { email },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "ci",
        "phone",
        "email",
        "password",
      ],
      include: [
        {
          model: Employee,
          where: { staff: true },
          attributes: ["id", "staff", "admin"],
          required: false,
        },
        {
          model: Customer,
          attributes: ["id"],
          required: false,
        },
      ],
    });
    if (!userFound) return res.status(404).json({ errors: ["User not found"] });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(404).json({ errors: ["Password incorrect"] });

    if (userFound.employee) {
      const token = await createdAccessToken({ id: userFound.id });

      return res.json({
        user: {
          id: userFound.id,
          firstName: userFound.firstName,
          lastName: userFound.lastName,
          ci: userFound.ci,
          phone: userFound.phone,
          email: userFound.email,
          staff: userFound.employee.staff,
          admin: userFound.employee.admin,
        },
        token: token,
      });
    } else if (userFound.customer) {
      const token = await createdAccessToken({ id: userFound.id });

      return res.json({
        user: {
          id: userFound.id,
          firstName: userFound.firstName,
          lastName: userFound.lastName,
          ci: userFound.ci,
          phone: userFound.phone,
          email: userFound.email,
        },
        token: token,
      });
    }
  } catch (error) {
    res.status(500).json({ errors: [error.message] });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });

  return res.sendStatus(200);
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ errors: ["Unauthorized"] });

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
      if (err) return res.status(401).json({ errors: ["Unauthorized"] });

      const userFound = await User.findOne({
        where: { id: user.id },
        attributes: ["id", "firstName", "lastName", "ci", "phone", "email"],
        include: [
          {
            model: Employee,
            where: { staff: true },
            attributes: ["id", "staff", "admin"],
            required: false,
          },
          {
            model: Customer,
            attributes: ["id"],
            required: false,
          },
        ],
      });
      if (!userFound) return res.status(404).json({ errors: ["Unauthorized"] });

      if (userFound.employee) {
        return res.json({
          user: {
            id: userFound.id,
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            ci: userFound.ci,
            phone: userFound.phone,
            email: userFound.email,
            staff: userFound.employee.staff,
            admin: userFound.employee.admin,
          },
        });
      } else if (userFound.customer) {
        return res.json({
          user: {
            id: userFound.id,
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            ci: userFound.ci,
            phone: userFound.phone,
            email: userFound.email,
          },
        });
      }
    });
  } catch (error) {
    res.status(500).json({ errors: [error.message] });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, ci, phone, email } = req.body;

    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "firstName", "lastName", "ci", "phone", "email"],
    });

    user.firstName = firstName;
    user.lastName = lastName;
    user.ci = ci;
    user.phone = phone;
    user.email = email;

    await user.save();

    const userFound = await User.findOne({
      where: { id: user.id },
      attributes: ["id", "firstName", "lastName", "ci", "phone", "email"],
      include: [
        {
          model: Employee,
          attributes: ["id", "staff", "admin"],
          required: false,
        },
        {
          model: Customer,
          attributes: ["id"],
          required: false,
        },
      ],
    });

    if (userFound.employee) {
      return res.json({
        user: {
          id: userFound.id,
          firstName: userFound.firstName,
          lastName: userFound.lastName,
          ci: userFound.ci,
          phone: userFound.phone,
          email: userFound.email,
          staff: userFound.employee.staff,
          admin: userFound.employee.admin,
        },
      });
    } else if (userFound.customer) {
      return res.json({
        user: {
          id: userFound.id,
          firstName: userFound.firstName,
          lastName: userFound.lastName,
          ci: userFound.ci,
          phone: userFound.phone,
          email: userFound.email,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ errors: [error.message] });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, repeatPassword } = req.body;

    if (newPassword !== repeatPassword)
      return res.status(400).json({ errors: ["Passwords don't match"] });

    const userFound = await User.findOne({
      where: { id: req.user.id },
    });
    if (!userFound) return res.status(404).json({ errors: ["User not found"] });

    const isMatch = await bcrypt.compare(oldPassword, userFound.password);

    if (!isMatch)
      return res.status(403).json({ errors: ["Password incorrect"] });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    userFound.password = passwordHash;

    await userFound.save();

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ errors: [error.message] });
  }
};
