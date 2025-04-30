import { z } from "zod";
import { ButtonVariantSchema, serverColorSchema } from "./ui.types";

export const ButtonSchema = z.object({
  id: z.string().optional().nullable(),
  label: z.string(),
  variant: ButtonVariantSchema,
  color: serverColorSchema,
  size: z.enum(["big", "small"]),
  url: z.string().optional(),
  is_target_blank: z.boolean().optional(),
});

export type ButtonType = z.infer<typeof ButtonSchema>;
