import type { colorType } from "../schemas/ui.types";

export const textColor = (color: colorType): string => {
  const colorMapping: Record<colorType, string> = {
    white: "text-white",
    pink: "text-pink",
    "pink-light": "text-pink-light",
    blue: "text-blue",
    "blue-light": "text-blue-light",
    "body-blue": "text-body-blue",
    "body-white": "text-body-white",
    "body-grey": "text-body-grey",
    border: "text-border",
    "border-grey": "text-border-grey",
  };

  return colorMapping[color] || "";
};

export const backgroundColor = (color: colorType): string => {
  const colorMapping: Record<colorType, string> = {
    white: "bg-white",
    pink: "bg-pink",
    "pink-light": "bg-pink-light",
    blue: "bg-blue",
    "blue-light": "bg-blue-light",
    "body-blue": "bg-body-blue",
    "body-white": "bg-body-white",
    "body-grey": "bg-body-grey",
    border: "bg-border",
    "border-grey": "bg-border-grey",
  };

  return colorMapping[color] || "";
};

export const borderColor = (color: colorType): string => {
  const colorMapping: Record<colorType, string> = {
    white: "border-white",
    pink: "border-pink",
    "pink-light": "border-pink-light",
    blue: "border-blue",
    "blue-light": "border-blue-light",
    "body-blue": "border-body-blue",
    "body-white": "border-body-white",
    "body-grey": "border-body-grey",
    border: "border-border",
    "border-grey": "border-border-grey",
  };

  return colorMapping[color] || "";
};

export const svgColor = (color: colorType): string => {
  const colorMapping: Record<colorType, string> = {
    white: "#FFF",
    pink: "#F35987",
    "pink-light": "#FEF2F5",
    blue: "#202560",
    "blue-light": "#8F92AF",
    "body-blue": "#585C87",
    "body-white": "#C7C8D7",
    "body-grey": "#F6F6F9",
    border: "#e0e0e0",
    "border-grey": "#DBDCE5",
  };

  return colorMapping[color] || "";
};
