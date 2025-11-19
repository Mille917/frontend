<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "~~/stores/user";

const { $api } = useNuxtApp();
const userStore = useUserStore();

const experiences = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

/* ✅ Charger les expériences */
const loadExperiences = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await $api.get("/experiences", {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
    experiences.value = data;
  } catch (err: any) {
    console.error("Erreur chargement expériences:", err);
    error.value =
      err.response?.data?.message || "Erreur lors du chargement des expériences.";
  } finally {
    loading.value = false;
  }
};

/* ✅ Supprimer une expérience */
const deleteExperience = async (id: number) => {
  if (!confirm("Supprimer cette expérience ?")) return;
  try {
    await $api.delete(`/experiences/${id}`, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
    loadExperiences();
  } catch (err: any) {
    console.error("Erreur suppression expérience:", err);
    alert("Erreur lors de la suppression.");
  }
};

onMounted(() => loadExperiences());
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-24 px-6">
    <!-- ✅ En-tête -->
    <div
      class="flex flex-col sm:flex-row justify-between items-center mb-8 max-w-6xl mx-auto gap-4"
    >
      <h1
        class="text-3xl font-bold text-blue-900 flex items-center gap-2 text-center sm:text-left"
      >
        <i class="fas fa-briefcase text-blue-600"></i> Expériences
      </h1>

      <NuxtLink
        to="/admin/experiences/new"
        class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow"
      >
        <i class="fas fa-plus"></i> Ajouter
      </NuxtLink>
    </div>

    <!-- ✅ États -->
    <div
      v-if="loading"
      class="text-center text-gray-500 animate-pulse flex justify-center items-center gap-2"
    >
      <i class="fa-solid fa-spinner fa-spin"></i>
      Chargement des expériences...
    </div>

    <p
      v-if="error"
      class="text-red-600 text-center font-medium flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-triangle-exclamation"></i>
      {{ error }}
    </p>

    <!-- ✅ Liste -->
    <div
      v-if="!loading && !error && experiences.length > 0"
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
    >
      <div
        v-for="exp in experiences"
        :key="exp.id"
        class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border border-gray-200"
      >
        <h2 class="text-xl font-semibold text-blue-800 mb-1">
          {{ exp.title }}
        </h2>
        <p class="text-gray-600 font-medium mb-2">
          <i class="fa-solid fa-building mr-2 text-gray-400"></i>
          {{ exp.company }}
        </p>
        <p>
          <i class="fa-solid fa-briefcase mr-2 text-gray-400"></i>
          {{ exp.position }}
        </p>
        <p>
          <i class="fa-solid fa-location-dot mr-2 text-gray-400"></i>
          {{ exp.location }}
        </p>
        <p class="text-sm text-gray-500 mb-3">
          <i class="fa-regular fa-calendar mr-1 text-blue-500"></i>
          {{ exp.startDate }} → {{ exp.endDate || "Aujourd’hui" }}
        </p>
        <p class="text-sm text-gray-700 line-clamp-3">{{ exp.description }}</p>

        <div class="flex justify-between mt-4">
          <NuxtLink
            :to="`/admin/experiences/${exp.id}`"
            class="text-yellow-600 hover:text-yellow-700"
            title="Modifier"
          >
            <i class="fas fa-edit"></i>
          </NuxtLink>
          <button
            @click="deleteExperience(exp.id)"
            class="text-red-600 hover:text-red-700"
            title="Supprimer"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ Aucun résultat -->
    <p
      v-if="!loading && experiences.length === 0 && !error"
      class="text-center text-gray-500 mt-8 flex items-center justify-center gap-2"
    >
      <i class="fa-regular fa-circle-xmark"></i>
      Aucune expérience enregistrée.
    </p>

    <!-- ✅ Retour -->
    <NuxtLink
      to="/admin/dashboard"
      class="block text-center text-blue-600 mt-10 hover:underline flex items-center justify-center gap-2"
    >
      <i class="fas fa-arrow-left"></i> Retour au tableau de bord
    </NuxtLink>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
