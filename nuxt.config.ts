import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/src/assets/main.css', "~/src/assets/fonts.css", "~/src/assets/prism-shades-of-purple.css"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  typescript: {
    strict: true
  },
})
