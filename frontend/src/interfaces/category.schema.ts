import { z } from "zod";

export const schemaAddCategory = z.object({
  name: z
    .string()
    .min(1, "Este campo es requerido")
    .trim()
    .max(50, "Debe ser menos de 50 caracteres"),
});
