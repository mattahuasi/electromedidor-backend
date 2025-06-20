import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { adminRequired } from "../middlewares/validateAdmin.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { customerSchema } from "../schemas/customer.schema.js";
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerHardware,
} from "../controllers/customer.controller.js";

const router = new Router();

router.post(
  "/customers",
  authRequired,
  validateSchema(customerSchema),
  createCustomer
);
router.get("/customers", authRequired, getCustomers);
router.get("/customers/hardware", authRequired, getCustomerHardware);
router.get("/customers/:id", authRequired, getCustomer);
router.put("/customers/:id", authRequired, updateCustomer);
router.delete("/customers/:id", authRequired, adminRequired, deleteCustomer);

export default router;
