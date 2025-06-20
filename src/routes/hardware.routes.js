import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { hardwareSchema } from "../schemas/hardware.schema.js";
import {
  createHardware,
  getHardware,
  getOneHardware,
  updateHardware,
  deleteHardware,
  getHardwareDebt,
} from "../controllers/hardware.controller.js";

const router = new Router();

router.post(
  "/hardware",
  authRequired,
  validateSchema(hardwareSchema),
  createHardware
);
router.get("/hardware", authRequired, getHardware);
router.get("/hardware/debt", getHardwareDebt);
router.get("/hardware/:id", authRequired, getOneHardware);
router.put("/hardware/:id", authRequired, updateHardware);
router.delete("/hardware/:id", authRequired, deleteHardware);

export default router;
