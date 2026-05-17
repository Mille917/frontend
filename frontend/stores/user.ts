import { defineStore } from "pinia";
import { useNuxtApp } from "nuxt/app";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as { id: number; fullName: string; email: string } | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
    someState: "hello pinia",
  }),

  // ✅ Active la persistance du store (nécessite le plugin client persist)
  persist: true,

  actions: {
    // --- 🔐 Connexion ---
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const { $api } = useNuxtApp();
        const response = await $api.post("/auth/login", { email, password });

        this.token = response.data.token;
        this.user = response.data.user;
      } catch (err: unknown) {
        const e = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        this.error =
          e.response?.data?.message ?? e.message ?? "Erreur de connexion";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // --- 🧑‍💻 Inscription ---
    async register(fullName: string, email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const { $api } = useNuxtApp();
        const response = await $api.post("/auth/register", {
          fullName,
          email,
          password,
        });

        this.token = response.data.token;
        this.user = response.data.user;
      } catch (err: unknown) {
        const e = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        this.error =
          e.response?.data?.message ??
          e.message ??
          "Erreur lors de l’inscription";
      } finally {
        this.loading = false;
      }
    },

    // --- 🚪 Déconnexion ---
    logout() {
      this.user = null;
      this.token = null;
    },
  },
});
