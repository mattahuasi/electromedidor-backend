import { z } from "zod";

export const hardwareSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es obligatorio",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(4, { message: "El nombre debe tener 4 caracteres o más" })
    .max(40, { message: "El nombre debe tener 40 caracteres o menos" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "El nombre solo debe contener letras y números, sin espacios",
    }),
  address: z.string({
    required_error: "La dirección es obligatoria",
    invalid_type_error: "La dirección debe ser una cadena de texto",
  }),
  key: z.boolean({
    required_error: "La clave es obligatoria",
    invalid_type_error: "La clave debe ser un booleano",
  }),
  area: z.boolean({
    required_error: "El área es obligatoria",
    invalid_type_error: "El área debe ser un booleano",
  }),
  customerId: z.number({
    required_error: "El cliente es obligatorio",
    invalid_type_error: "El cliente debe ser un número",
  }),
});
