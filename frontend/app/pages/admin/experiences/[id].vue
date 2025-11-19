<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "~~/stores/user";

const { $api } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const form = ref({
  position: "", 
  company: "",
  location:"",
  description: "",
  start_date: "",
  end_date: "",
});

const isCurrent = ref(false); // ✅ case "Jusqu’à ce jour"
const loading = ref(true);
const error = ref<string | null>(null);
const success = ref(false);

/* ✅ Charger une expérience */
const fetchExperience = async () => {
  try {
    const { data } = await $api.get(`/experiences/${route.params.id}`, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });

    form.value = data;
    // si end_date est null, alors expérience en cours
    isCurrent.value = !data.end_date;
  } catch (err: any) {
    console.error("Erreur chargement expérience:", err);
    error.value =
      err.response?.data?.message ||
      "Erreur lors du chargement de l’expérience.";
  } finally {
    loading.value = false;
  }
};

/* ✅ Mettre à jour */
const updateExperience = async () => {
  loading.value = true;
  error.value = null;
  success.value = false;

  // Si "Toujours en poste" activé → on vide end_date
  if (isCurrent.value) {
    form.value.end_date = null;
  }

  try {
    await $api.put(`/experiences/${route.params.id}`, form.value, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
    success.value = true;
    setTimeout(() => router.push("/admin/experiences"), 1200);
  } catch (err: any) {
    console.error("Erreur mise à jour expérience:", err);
    error.value =
      err.response?.data?.message ||
      "Erreur lors de la mise à jour de l’expérience.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchExperience);
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-24 px-6">
    <div
      class="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <h1 class="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
        <i class="fas fa-edit text-blue-600"></i>
        Modifier l’expérience
      </h1>

      <div
        v-if="loading"
        class="text-center text-gray-500 flex items-center justify-center gap-2"
      >
        <i class="fa-solid fa-spinner fa-spin"></i>
        Chargement...
      </div>

      <form
        v-if="!loading"
        @submit.prevent="updateExperience"
        class="space-y-5"
      >
        <input
          v-model="form.position"
          placeholder="Poste"
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
          placeholder="Description"
          class="input"
          rows="4"
        ></textarea>

        <!-- ✅ Dates -->
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
          <label for="isCurrent" class="text-gray-700 dark:text-gray-300">
            Toujours en poste (jusqu’à ce jour)
          </label>
        </div>

        <p v-if="error" class="text-red-600 text-center">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-center">
          ✅ Expérience mise à jour avec succès !
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
            {{ loading ? "Mise à jour..." : "Sauvegarder" }}
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

