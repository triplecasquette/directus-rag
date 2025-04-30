import type { DirectusUserType } from "~/composables/directus/author/autor.schema";

// TEXT
export const toPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.match(/(.{1,2})/g)?.join(" ");
};

export const capitalize = (string: string): string => {
  return string[0].toUpperCase() + string.slice(1);
};

export const capitalizeSentence = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const truncate = (str: string, n: number) => {
  return str.length > n
    ? str
        .slice(0, n - 3)
        .split(" ")
        .slice(0, -1)
        .join(" ") + "..."
    : str;
};

export const replaceAccents = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const slugify = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/(^-+)|(-+$)/g, "");
};

export const unslugify = (slug: string): string => {
  const slugWithSpaces = slug.replace(/-/g, " ");

  const formattedSlug =
    slugWithSpaces.charAt(0).toUpperCase() + slugWithSpaces.slice(1);

  return formattedSlug;
};

// CODE
export const shimmer = (w: number, h: number) => {
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#202560; stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#585C87; stop-opacity:1" />
                </linearGradient>
              </defs>
              <rect width="${w}" height="${h}" fill="url(#gradient)" />
            </svg>`;
};

export const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const sliceHtml = (html: string, length: number) => {
  const texteSansBalises = html.replace(/<[^>]*>/g, "");

  if (texteSansBalises.length > length) {
    const slice = texteSansBalises.slice(0, length);
    return `<p>${slice.slice(0, Math.min(slice.length, slice.lastIndexOf(" ")))} [...]</p>`;
  } else return html;
};

export const calculateObjectPosition = (
  focal_point_x: number,
  focal_point_y: number,
  width: number,
  height: number,
): string => {
  const posX = ((focal_point_x / width) * 100).toFixed(2) + "%";
  const posY = ((focal_point_y / height) * 100).toFixed(2) + "%";
  return `${posX} ${posY}`;
};

export const sanitizeSVG = (svg: string) => {
  return svg.replace(/fill="[^"]*"/g, 'fill="currentColor"');
};

export const stripHTML = (html: string): string => {
  return html ? html.replace(/<[^>]*>/g, "") : "";
};

export const displayFullName = (directusUser: DirectusUserType) => {
  return directusUser.first_name + " " + directusUser.last_name;
};

export const safeQuerySelector = (hash: string): Element | null =>
  document.querySelector(CSS.escape(hash));
