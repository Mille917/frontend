import axios from "axios";
import { useUserStore } from "~~/stores/user";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  // 👇 Affiche l’adresse actuelle pour vérifier
  console.log("🌍 API Base URL:", baseURL);

  // ✅ Instance Axios reliée à ton AdonisJS
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 🔒 Ajoute automatiquement le token du user
  api.interceptors.request.use((request) => {
    const userStore = useUserStore();
    if (userStore.token) {
      request.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return request;
  });

  // 🚨 Gestion d’erreurs visible
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("❌ API ERROR:", error);
      throw error;
    }
  );

  // ✅ Injection dans Nuxt
  nuxtApp.provide("api", api);
});
