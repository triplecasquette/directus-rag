import BaseCardsGroupSection from "~/components/organisms/sections/CardsGroup/BaseCardsGroupSection.vue";
import { CardsGroupSchema } from "../schemas/sections/card-group.schema";
import { CtaSectionSchema } from "../schemas/sections/cta-section.schema";
import { CustomerSectionSchema } from "../schemas/sections/customer-section.schema";
import { FaqSectionSchema } from "../schemas/sections/faq-section.schema";
import { HeroSectionSchema } from "../schemas/sections/hero-section.schema";
import { PricingSectionSchema } from "../schemas/sections/pricing-section.schema";
import { TabsPanelSectionSchema } from "../schemas/sections/tabs-panel-section.schema";
import CustomerSection from "~/components/organisms/sections/CustomerSection/CustomerSection.vue";
import FaqSection from "~/components/organisms/sections/Faq/FaqSection.vue";
import BaseHero from "~/components/organisms/sections/Hero/BaseHero.vue";
import PricingSection from "~/components/organisms/sections/Pricing/PricingSection.vue";
import { RichTextSectionSchema } from "../schemas/sections/richtext-section.schema";
import BaseRichtextSection from "~/components/organisms/sections/Richtext/BaseRichtextSection.vue";
import TabPanelSection from "~/components/organisms/sections/TabPanel/TabPanelSection.vue";
import BaseCta from "~/components/organisms/sections/CtaSections/BaseCta.vue";

export const sectionComponentsMap = {
  cards_group_sections: {
    component: BaseCardsGroupSection,
    schema: CardsGroupSchema,
  },
  cta_sections: {
    component: BaseCta,
    schema: CtaSectionSchema,
  },
  customers_sections: {
    component: CustomerSection,
    schema: CustomerSectionSchema,
  },
  faq_sections: {
    component: FaqSection,
    schema: FaqSectionSchema,
  },
  hero_sections: {
    component: BaseHero,
    schema: HeroSectionSchema,
  },
  pricing_sections: {
    component: PricingSection,
    schema: PricingSectionSchema,
  },
  customers_section: {
    component: CustomerSection,
    schema: CustomerSectionSchema,
  },
  richtext_sections: {
    component: BaseRichtextSection,
    schema: RichTextSectionSchema,
  },
  tabs_sections: {
    component: TabPanelSection,
    schema: TabsPanelSectionSchema,
  },
} as const;
