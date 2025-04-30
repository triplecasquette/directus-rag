import type { DefineComponent } from "vue";
import { z } from "zod";
import { HeroSectionSchema } from "~/src/schemas/sections/hero-section.schema";

export const SectionNameSchema = z.enum([
  "cards_group_sections",
  "cta_sections",
  "customers_sections",
  "faq_sections",
  "hero_sections",
  "pricing_sections",
  "customers_section",
  "richtext_sections",
  "tabs_sections",
]);
export type SectionNameType = z.infer<typeof SectionNameSchema>;

export const SectionSchema = HeroSectionSchema;
export type SectionType = z.infer<typeof SectionSchema>;

export const SectionItemSchema = z.object({
  collection: SectionNameSchema,
  item: SectionSchema,
});
export type SectionItemType = z.infer<typeof SectionItemSchema>;

export type SectionMapping = {
  component: DefineComponent<any>;
  schema: z.ZodTypeAny;
};
