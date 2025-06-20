import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { adminRequired } from "../middlewares/validateAdmin.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { billSchema } from "../schemas/bill.schema.js";
import {
  createBill,
  getBills,
  getBill,
  updateBill,
  deleteBill,
  generateBills,
  generateBill,
} from "../controllers/bill.controller.js";

const router = new Router();

router.post("/bills", authRequired, validateSchema(billSchema), createBill);
router.get("/bills", authRequired, getBills);
router.get("/bills/:id", authRequired, getBill);
router.put("/bills/:id", authRequired, adminRequired, updateBill);
router.delete("/bills/:id", authRequired, adminRequired, deleteBill);
router.post("/bills/generate", authRequired, generateBills);
router.post("/bills/generate/:id", authRequired, generateBill);

export default router;
