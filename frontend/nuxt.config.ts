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
  ],

  components: {
    dirs: ["~/components", "~/components/ui", "~/components/layouts"],
  },
  runtimeConfig: {
    public: {
      // apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://127.0.0.1:3333/api", // URL de l'API backend
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://portfolioraissa.fly.dev",
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
