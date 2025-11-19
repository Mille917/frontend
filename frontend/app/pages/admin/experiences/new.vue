<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~~/stores/user";

const { $api } = useNuxtApp();
const router = useRouter();
const userStore = useUserStore();

const form = ref({
  position: "", // 🔄 si tu as remplacé title par position
  company: "",
  description: "",
  location: "",
  start_date: "",
  end_date: "",
});

const isCurrent = ref(false); // ✅ "Toujours en poste"
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

/* ✅ Enregistrer une expérience */
const saveExperience = async () => {
  loading.value = true;
  error.value = null;
  success.value = false;

  // si "Toujours en poste" est coché → on retire end_date
  if (isCurrent.value) {
    form.value.end_date = null;
  }

  try {
    await $api.post("/experiences", form.value, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
    success.value = true;

    // rediriger après un court délai
    setTimeout(() => router.push("/admin/experiences"), 1200);
  } catch (err: any) {
    console.error("Erreur création expérience :", err);
    error.value =
      err.response?.data?.message ||
      "Erreur lors de la création de l’expérience.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-24 px-6">
    <div
      class="max-w-3xl mx-auto bg-white  p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <h1 class="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
        <i class="fas fa-plus-circle text-blue-600"></i>
        Nouvelle expérience
      </h1>

      <form @submit.prevent="saveExperience" class="space-y-5">
        <input
          v-model="form.position"
          placeholder="Poste occupé"
          class="input"
          required
        />
        <input
          v-model="form.company"
          placeholder="Entreprise"
          class="input"
          required
        />
         <input
          v-model="form.location"
          placeholder="Lieu"
          class="input"
          required
        />
        <textarea
          v-model="form.description"
          placeholder="Description du poste"
          class="input"
          rows="4"
        ></textarea>

        <!-- 🗓️ Dates -->
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label class="block text-sm text-gray-600 mb-1">Début</label>
            <input
              type="date"
              v-model="form.start_date"
              class="input w-full"
              required
            />
          </div>

          <div class="flex-1">
            <label class="block text-sm text-gray-600 mb-1">Fin</label>
            <input
              type="date"
              v-model="form.end_date"
              class="input w-full"
              :disabled="isCurrent"
            />
          </div>
        </div>

        <!-- ✅ Case à cocher “Toujours en poste” -->
        <div class="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="isCurrent"
            v-model="isCurrent"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="isCurrent" class="text-gray-700">
            Toujours en poste (jusqu’à ce jour)
          </label>
        </div>

        <!-- ✅ Messages -->
        <p v-if="error" class="text-red-600 text-center">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-center">
          ✅ Expérience ajoutée avec succès !
        </p>

        <div class="flex justify-end gap-3 mt-6">
          <NuxtLink
            to="/admin/experiences"
            class="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Annuler
          </NuxtLink>
          <button
            type="submit"
            class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70"
            :disabled="loading"
          >
            <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-floppy-disk"></i>
            {{ loading ? "Enregistrement..." : "Sauvegarder" }}
          </button>
        </div>
      </form>
    </div>

    <NuxtLink
      to="/admin/dashboard"
      class="block text-center text-blue-600 mt-8 hover:underline flex items-center justify-center gap-2"
    >
      <i class="fas fa-arrow-left"></i> Retour au tableau de bord
    </NuxtLink>
  </div>
</template>


