<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "~~/stores/user";

const { $api } = useNuxtApp();
const userStore = useUserStore();

const projects = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

/* ✅ Charger les projets */
const loadProjects = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await $api.get("/projects", {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
    projects.value = data;
  } catch (err: any) {
    console.error("Erreur chargement projets:", err);
    error.value =
      err.response?.data?.message || "Erreur lors du chargement des projets.";
  } finally {
    loading.value = false;
  }
};

/* ✅ Supprimer un projet */
const deleteProject = async (id: number) => {
  if (!confirm("Supprimer ce projet ?")) return;
  try {
    await $api.delete(`/projects/${id}`, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
    loadProjects();
  } catch (err: any) {
    console.error("Erreur suppression projet:", err);
    alert(
      err.response?.data?.message || "Erreur lors de la suppression du projet."
    );
  }
};

onMounted(() => loadProjects());
</script>

<template>
  <div class="max-w-6xl mx-auto py-20 px-6">
    <!-- ✅ En-tête -->
    <div
      class="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4"
    >
      <h1
        class="text-3xl font-bold text-blue-900 flex items-center gap-2 text-center sm:text-left"
      >
        <i class="fa-solid fa-folder-open text-blue-700"></i>
        Gestion des Projets
      </h1>

      <NuxtLink
        to="/admin/projects/new"
        class="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
      >
        <i class="fa-solid fa-plus"></i>
        Nouveau Projet
      </NuxtLink>
    </div>

    <!-- ✅ États -->
    <p
      v-if="loading"
      class="text-center text-gray-500 animate-pulse flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-spinner fa-spin"></i>
      Chargement des projets...
    </p>

    <p
      v-if="error"
      class="text-center text-red-500 font-medium flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-triangle-exclamation"></i>
      {{ error }}
    </p>

    <!-- ✅ Liste des projets -->
    <div
      v-if="projects.length > 0"
      class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="p in projects"
        :key="p.id"
        class="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-200 flex flex-col"
      >
        <img
          :src="p.imageUrl || '/placeholder.jpg'"
          alt="image du projet"
          class="h-48 w-full object-cover rounded-t-xl"
        />

        <div class="flex flex-col flex-1 p-5">
          <h3 class="font-semibold text-lg text-gray-900 truncate mb-2">
            {{ p.title }}
          </h3>
          <div
            class="text-gray-600 text-sm line-clamp-3"
            v-html="p.description"
          ></div>

          <div class="flex justify-between items-center pt-3 mt-3">
            <NuxtLink
              :to="`/admin/projects/${p.id}`"
              class="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center gap-1 transition"
            >
              <i class="fa-solid fa-pen-to-square"></i> Modifier
            </NuxtLink>

            <button
              @click="deleteProject(p.id)"
              class="text-red-700 hover:text-red-500 text-sm font-medium flex items-center gap-1 transition"
            >
              <i class="fa-solid fa-trash-can"></i> Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Aucun projet -->
    <p
      v-if="!loading && projects.length === 0 && !error"
      class="text-center text-gray-500 mt-8 flex items-center justify-center gap-2"
    >
      <i class="fa-regular fa-circle-xmark"></i>
      Aucun projet enregistré.
    </p>

    <!-- ✅ Retour -->
    <NuxtLink
      to="/admin/dashboard"
      class="block text-center text-blue-600 mt-10 hover:underline flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-arrow-left"></i>
      Retour au tableau de bord
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
