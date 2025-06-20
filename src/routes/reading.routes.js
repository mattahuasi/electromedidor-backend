import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { adminRequired } from "../middlewares/validateAdmin.js";
import {
  getReadings,
  getReadingsDates,
  getLastReadings,
  getReadingsDay,
  deleteReadings,
} from "../controllers/reading.controller.js";

const router = new Router();

router.get("/readings/:id", authRequired, getReadings);
router.get("/readings/dates/:id", authRequired, getReadingsDates);
router.get("/readings/last/:id", authRequired, getLastReadings);
router.get("/readings/:id/:date", authRequired, getReadingsDay);
router.delete("/readings/:id", authRequired, adminRequired, deleteReadings);

export default router;
