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
      apiBase: "http://localhost:3333",
    },
  },
  vite: { 
    plugins: [tsconfigPaths(),
      tailwindcss(),
    ], },
});
