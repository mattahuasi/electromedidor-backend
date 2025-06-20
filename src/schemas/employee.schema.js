import { z } from "zod";

export const employeeSchema = z.object({
  firstName: z
    .string({
      required_error: "El nombre es obligatorio",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(4, { message: "El nombre debe tener 4 caracteres o más" })
    .max(40, { message: "El nombre debe tener 40 caracteres o menos" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/, {
      message: "El nombre solo debe contener letras y espacios",
    }),
  lastName: z
    .string({
      required_error: "El apellido es obligatorio",
      invalid_type_error: "El apellido debe ser una cadena de texto",
    })
    .min(4, { message: "El apellido debe tener 4 caracteres o más" })
    .max(40, { message: "El apellido debe tener 40 caracteres o menos" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/, {
      message: "El apellido solo debe contener letras y espacios",
    }),
  ci: z
    .string({
      required_error: "La cédula de identidad es obligatoria",
      invalid_type_error: "La cédula de identidad debe ser una cadena de texto",
    })
    .min(5, { message: "La cédula de identidad debe tener 5 caracteres o más" })
    .max(15, {
      message: "La cédula de identidad debe tener 15 caracteres o menos",
    }),
  phone: z
    .string({
      required_error: "El número de teléfono es obligatorio",
      invalid_type_error: "El número de teléfono debe ser una cadena de texto",
    })
    .min(5, { message: "El número de teléfono debe tener 5 caracteres o más" })
    .max(15, {
      message: "El número de teléfono debe tener 15 caracteres o menos",
    }),
  email: z
    .string({
      required_error: "El correo electrónico es obligatorio",
      invalid_type_error: "El correo electrónico debe ser una cadena de texto",
    })
    .email({ message: "Dirección de correo electrónico no válida" }),
  password: z
    .string({
      required_error: "La contraseña es obligatoria",
      invalid_type_error: "La contraseña debe ser una cadena de texto",
    })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .max(20, { message: "La contraseña no debe exceder los 20 caracteres" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,20}$/, {
      message:
        "La contraseña debe incluir al menos una letra mayúscula, una letra minúscula y un número (por ejemplo: 'Abc123')",
    }),
  admin: z.boolean({
    required_error: "El estado de administrador es obligatorio",
    invalid_type_error: "El estado de administrador debe ser un booleano",
  }),
});
