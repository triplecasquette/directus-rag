import type { ButtonVariant, colorType } from "../schemas/ui.types";
import { backgroundColor, borderColor, textColor } from "./colors";

export const getVariantStyle = (variant: ButtonVariant): string => {
  switch (variant) {
    case "outlined":
      return "-translate-x-1 -translate-y-1 border bg-white group-hover/button:translate-x-0 group-hover/button:translate-y-0 transition-transform duration-300 ease-in-out";
    case "text":
      return "font-athletics text-[16px] font-bold leading-6 text-left";
    default:
      return "";
  }
};

export const getColorStyle = (
  variant: ButtonVariant,
  color: colorType,
  disabled: boolean,
): string => {
  if (disabled) return "";

  switch (variant) {
    case "outlined":
      return color === "white"
        ? `${borderColor(color)} ${textColor(color)}`
        : `bg-white ${borderColor(color)} ${textColor(color)}`;
    case "filled":
      return `${backgroundColor(color)} ${textColor("white")}`;
    case "text":
      return `${textColor(color)}`;
    default:
      return "";
  }
};

export const getDisabledStyle = (variant: ButtonVariant): string => {
  switch (variant) {
    case "outlined":
      return "border-[#CCC] text-[#CCC]";
    case "filled":
      return "bg-[#CCC] text-white";
    case "text":
      return "text-[#CCC]";
    default:
      return "";
  }
};
