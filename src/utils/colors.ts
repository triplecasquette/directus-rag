import type { colorType } from "../schemas/ui.types";

export const textColor = (color: colorType): string => {
  const colorMapping: Record<colorType, string> = {
    white: 'text-white',
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    'accent-shiny': 'text-accent-shiny',
    dark: 'text-dark',
    grey: 'text-grey',
  };

    return colorMapping[color] || "";
};

export const backgroundColor = (color: colorType): string => {
  const colorMapping: Record<colorType, string> = {
    white: 'bg-white',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    'accent-shiny': 'bg-accent-shiny',
    dark: 'bg-dark',
    grey: 'bg-grey',
  };

  return colorMapping[color] || "";
};

export const borderColor = (color: colorType): string => {
  const colorMapping: Record<colorType, string> = {
    white: 'border-white',
    primary: 'border-primary',
    secondary: 'border-secondary',
    accent: 'border-accent',
    'accent-shiny': 'border-accent-shiny',
    dark: 'border-dark',
    grey: 'border-grey',
  };

  return colorMapping[color] || "";
};

export const svgColor = (color: colorType): string => {
  const colorMapping: Record<colorType, string> = {
    white: '#FFF',
    primary: 'rgb(149, 133, 255)',
    secondary: '#6644FF',
    accent: '#FF99DD',
    'accent-shiny': 'rgb(254, 104, 201)',
    dark: '#111827',
    grey: '#1F2937',
  };

  return colorMapping[color] || "";
};
