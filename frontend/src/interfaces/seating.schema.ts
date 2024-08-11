import { z } from "zod";

export const schemaAddSeating = z.object({
  description: z
    .string()
    .min(1, "Este campo es requerido")
    .max(255, "Debe ser menos de 255 caracteres"),
  debit: z
    .string()
    .min(1, "Este campo es requerido")
    .max(40, "Debe ser menos de 40 caracteres"),
  credit: z
    .string()
    .min(1, "Este campo es requerido")
    .max(40, "Debe ser menos de 40 caracteres"),
  detail: z
    .string()
    .min(1, "Este campo es requerido")
    .max(255, "Debe ser menos de 255 caracteres"),
  date: z
    .string()
    .min(1, "Campo requerido")
    .max(80, "Debe ser menos de 80 caracteres"),
  numDoc: z
    .string()
    .min(1, "Campo requerido")
    .max(40, "Debe ser menos de 40 caracteres"),
  asn: z
    .string()
    .min(1, "Campo requerido")
    .max(40, "Debe ser menos de 40 caracteres"),
  categoryId: z
    .string()
    .min(1, "Este campo es requerido")
    .max(80, "Debe ser menos de 80 caracteres"),
});
