import { z } from "zod";

export const billSchema = z.object({
  date: z.date({
    required_error: "La fecha es obligatoria",
    invalid_type_error: "La fecha debe ser de tipo fecha",
  }),
  consumption: z.number({
    required_error: "El consumo es obligatorio",
    invalid_type_error: "El consumo debe ser un número",
  }),
  cost: z.number({
    required_error: "El costo es obligatorio",
    invalid_type_error: "El costo debe ser un número",
  }),
  status: z.boolean({
    required_error: "El estado es obligatorio",
    invalid_type_error: "El estado debe ser un booleano",
  }),
  customerId: z.number({
    required_error: "El cliente es obligatorio",
    invalid_type_error: "El cliente debe ser un número",
  }),
  hardwareId: z.number({
    required_error: "El hardware es obligatorio",
    invalid_type_error: "El hardware debe ser un número",
  }),
});
