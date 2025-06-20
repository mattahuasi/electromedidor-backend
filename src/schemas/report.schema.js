import { z } from "zod";

// Esquema de validación para el informe
export const reportSchema = z.object({
  title: z
    .string({
      required_error: "El título es obligatorio",
      invalid_type_error: "El título debe ser una cadena de texto",
    })
    .min(4, { message: "El título debe tener 4 caracteres o más" })
    .max(100, { message: "El título debe tener 100 caracteres o menos" }),
  detail: z
    .string({
      required_error: "El detalle es obligatorio",
      invalid_type_error: "El detalle debe ser una cadena de texto",
    })
    .min(10, { message: "El detalle debe tener 10 caracteres o más" }),
  content: z
    .string({
      required_error: "El contenido es obligatorio",
      invalid_type_error: "El contenido debe ser una cadena de texto",
    })
    .min(20, { message: "El contenido debe tener 20 caracteres o más" }),
  type: z
    .string({
      required_error: "El tipo es obligatorio",
      invalid_type_error: "El tipo debe ser una cadena de texto",
    })
    .min(4, { message: "El tipo debe tener 4 caracteres o más" }),
  begin: z.date({
    required_error: "La fecha de inicio es obligatoria",
    invalid_type_error: "La fecha de inicio debe ser de tipo fecha",
  }),
  end: z.date({
    required_error: "La fecha de fin es obligatoria",
    invalid_type_error: "La fecha de fin debe ser de tipo fecha",
  }),
});
