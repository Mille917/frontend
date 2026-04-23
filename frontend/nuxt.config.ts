import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  colorMode: {
    preference: "system",
    fallback: "light",
  },
  css: ["@/assets/css/main.css"],

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
  ],

  i18n: {
    locales: [
      { code: "fr", file: "fr.json", name: "Français" },
      { code: "en", file: "en.json", name: "English" },
      { code: "ln", file: "ln.json", name: "Lingala" },
    ],
    defaultLocale: "fr",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      alwaysRedirect: true,
    },
    lazy: true,
    langDir: "app/locales/",
  },

  components: {
    dirs: ["~/components", "~/components/ui", "~/components/layouts"],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://127.0.0.1:3333/api", // URL de l'API backend
      // apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://portfolioraissa.fly.dev",
    },
  },

  vite: {
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
      require("@tailwindcss/typography"),
    ],
  },
});
