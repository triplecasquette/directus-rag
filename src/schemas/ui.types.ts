import { z } from "zod";

// ** BOUTONS
export const ButtonVariantSchema = z.enum(["outlined", "filled", "text"]);
export type ButtonVariant = z.infer<typeof ButtonVariantSchema>;

// ** COULEURS
export const colorsSchema = z.enum([
  "white",
  "pink",
  "pink-light",
  "blue",
  "blue-light",
  "body-blue",
  "body-white",
  "body-grey",
  "border",
  "border-grey",
]);
export type colorType = z.infer<typeof colorsSchema>;

// ** COULEURS
export const colorsNameSchema = z.enum([
  "Rose",
  "Bleu",
  "Rose Clair",
  "Bleu Clair",
  "Fond Bleu",
  "Fond Clair",
  "Fond Gris",
  "Bord",
  "Bord Gris",
]);

export const serverColorSchema = z.object({
  name: colorsNameSchema,
  value: colorsSchema,
  code: z.string(),
  website: z.string().optional(),
});
export type serverColorType = z.infer<typeof serverColorSchema>;
