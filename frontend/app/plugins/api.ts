import axios from "axios";
import { useUserStore } from "~~/stores/user";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  // 👇 Affiche l’adresse actuelle pour vérifier
  console.log("🌍 API Base URL:", baseURL);

  // ✅ Instance Axios reliée à ton AdonisJS
  // Note: don't set a global Content-Type header so multipart/form-data
  // requests (FormData) can set their own boundary correctly.
  const api = axios.create({
    baseURL,
  });

  // 🔒 Ajoute automatiquement le token du user
  api.interceptors.request.use((request) => {
    const userStore = useUserStore();
    if (userStore.token) {
      request.headers.Authorization = `Bearer ${userStore.token}`;
    }

    // Ensure correct Content-Type header: if sending FormData, let axios
    // set the multipart boundary. Otherwise default to JSON.
    if (request.data && !(request.data instanceof FormData)) {
      request.headers["Content-Type"] = "application/json";
    } else {
      // remove Content-Type so browser/axios can set boundary for FormData
      if (request.headers && request.headers["Content-Type"]) {
        delete request.headers["Content-Type"];
      }
    }

    return request;
  });

  // 🚨 Gestion d’erreurs visible
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("❌ API ERROR:", error);
      throw error;
    },
  );

  // ✅ Injection dans Nuxt
  return {
    provide: {
      api,
    },
  };
});
