<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();

const skillId = route.params.id;

const form = ref({
  name: "",
  category: "",
  level: 50,
});

const loading = ref(true);
const error = ref<string | null>(null);

/* ✅ Charger la compétence existante */
const loadSkill = async () => {
  try {
    const { data } = await $api.get(`/skills/${skillId}`);
    form.value = {
      name: data.name,
      category: data.category,
      level: data.level,
    };
  } catch (err: any) {
    console.error("Erreur lors du chargement :", err);
    error.value =
      err.response?.data?.message || "Erreur de chargement de la compétence.";
  } finally {
    loading.value = false;
  }
};

/* ✅ Mettre à jour la compétence */
const updateSkill = async () => {
  loading.value = true;
  error.value = null;

  try {
    await $api.put(`/skills/${skillId}`, form.value);
    router.push("/admin/skills");
  } catch (err: any) {
    console.error("Erreur mise à jour :", err);
    error.value =
      err.response?.data?.message || "Erreur lors de la mise à jour.";
  } finally {
    loading.value = false;
  }
};

/* ✅ Supprimer la compétence */
const deleteSkill = async () => {
  if (!confirm("Supprimer cette compétence ?")) return;

  try {
    await $api.delete(`/admin/skills/${skillId}`);
    router.push("admin/skills");
  } catch (err: any) {
    console.error("Erreur suppression :", err);
    error.value =
      err.response?.data?.message || "Erreur lors de la suppression.";
  }
};

onMounted(loadSkill);
</script>

<template>
  <div class="max-w-lg mx-auto py-24 px-6">
    <h1
      class="text-3xl font-bold text-blue-900 mb-8 flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-pen-to-square text-blue-700"></i>
      Modifier une compétence
    </h1>

    <!-- Loader -->
    <div v-if="loading" class="text-center text-gray-500 animate-pulse text-lg">
      <i class="fa-solid fa-spinner fa-spin mr-2"></i>
      Chargement...
    </div>

    <!-- Formulaire -->
    <form
      v-else
      @submit.prevent="updateSkill"
      class="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-blue-700 space-y-5"
    >
      <!-- Nom -->
      <div>
        <label class="label">
          <i class="fa-solid fa-font mr-2"></i>
          Nom de la compétence
        </label>
        <input
          v-model="form.name"
          class="input"
          placeholder="Ex: Vue.js"
          required
        />
      </div>

      <!-- Catégorie -->
      <div>
        <label class="label">
          <i class="fa-solid fa-folder-tree mr-2"></i>
          Catégorie
        </label>
        <input
          v-model="form.category"
          class="input"
          placeholder="Ex: Frontend / Backend / Outils"
          required
        />
      </div>

      <!-- Niveau -->
      <div>
        <label class="label">
          <i class="fa-solid fa-signal mr-2"></i>
          Niveau : {{ form.level }}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          v-model="form.level"
          class="w-full accent-blue-600"
        />
      </div>

      <!-- Erreur -->
      <p
        v-if="error"
        class="text-red-600 text-center font-medium flex items-center justify-center gap-2"
      >
        <i class="fa-solid fa-triangle-exclamation"></i>
        {{ error }}
      </p>
      <!-- Boutons d’action -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          class="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          <i class="fa-solid fa-floppy-disk"></i>
          Sauvegarder
        </button>

        <button
          type="button"
          @click="deleteSkill"
          class="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          <i class="fa-solid fa-trash-can"></i>
          Supprimer
        </button>
      </div>

      <!-- Retour -->
      <NuxtLink
        to="/admin/skills"
        class="block text-center text-blue-600 mt-6 hover:underline items-center justify-center gap-2"
      >
        <i class="fa-solid fa-arrow-left"></i>
        Retour
      </NuxtLink>
    </form>
  </div>
</template>
