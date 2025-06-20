import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import {
  register,
  login,
  logout,
  verifyToken,
  updateProfile,
  updatePassword,
} from "../controllers/auth.controller.js";

const router = new Router();

router.post("/auth/register", validateSchema(registerSchema), register);
router.post("/auth/login", validateSchema(loginSchema), login);
router.post("/auth/logout", authRequired, logout);
router.get("/auth/verify", verifyToken);
router.put("/auth/update/profile", authRequired, updateProfile);
router.put("/auth/update/password", authRequired, updatePassword);

export default router;
