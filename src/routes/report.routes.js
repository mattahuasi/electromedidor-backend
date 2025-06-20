import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { adminRequired } from "../middlewares/validateAdmin.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { reportSchema } from "../schemas/report.schema.js";
import { getReports } from "../controllers/report.controller.js";

const router = new Router();

router.get("/reports", authRequired, getReports);

export default router;
