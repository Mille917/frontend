<script setup lang="ts">
import { ref, onMounted } from "vue";

const { $api } = useNuxtApp();
const skills = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const { data } = await $api.get("/skills");
    skills.value = data;
  } catch (err: any) {
    console.error("Erreur:", err);
    error.value = err.response?.data?.message || "Erreur de chargement.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-20 px-6">
    <!-- 🔹 Titre principal -->
    <div class="text-center mb-16">
      <h1
        class="text-4xl font-extrabold text-blue-900 flex items-center justify-center gap-3"
      >
        <i class="fa-solid fa-laptop-code text-indigo-600"></i>
        Mes Compétences
      </h1>
      <p class="text-gray-500 mt-3 max-w-2xl mx-auto">
        Un aperçu des technologies et domaines dans lesquels j’excelle — du code
        à la conception, avec passion et précision.
      </p>
    </div>

    <!-- 🔹 Loader -->
    <div
      v-if="loading"
      class="text-center text-gray-500 animate-pulse flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-spinner fa-spin text-indigo-600"></i>
      <span>Chargement des compétences...</span>
    </div>

    <!-- 🔹 Erreur -->
    <div
      v-if="error"
      class="text-red-500 text-center font-medium flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
    </div>

    <!-- 🔹 Liste des compétences -->
    <div
      v-if="skills.length > 0"
      class="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
    >
      <div
        v-for="skill in skills"
        :key="skill.id"
        class="group bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all p-6 relative overflow-hidden"
      >
        <!-- Déco en fond -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition"
        ></div>

        <!-- En-tête compétence -->
        <div class="flex items-center gap-3 mb-3 relative z-10">
          <div
            class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition"
          >
            <i class="fa-solid fa-code"></i>
          </div>
          <h2
            class="text-lg font-semibold text-indigo-800 group-hover:text-indigo-900 transition"
          >
            {{ skill.name }}
          </h2>
        </div>

        <!-- Catégorie -->
        <p
          class="text-sm text-gray-500 mb-4 relative z-10 flex items-center gap-2"
        >
          <i class="fa-solid fa-layer-group text-indigo-500"></i>
          {{ skill.category || "Autres" }}
        </p>

        <!-- Barre de progression -->
        <div class="relative z-10">
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              class="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-700 ease-out"
              :style="{ width: skill.level + '%' }"
            ></div>
          </div>

          <p class="mt-2 text-right text-sm text-gray-600 font-medium">
            {{ skill.level }}%
          </p>
        </div>
      </div>
    </div>

    <!-- 🔹 Aucun résultat -->
    <p
      v-if="!loading && skills.length === 0 && !error"
      class="text-gray-500 text-center mt-10 flex items-center justify-center gap-2"
    >
      <i class="fa-regular fa-circle-xmark text-gray-400"></i>
      Aucune compétence enregistrée pour le moment.
    </p>
  </div>
</template>

<style scoped>
/* Animation douce pour l’apparition des cartes */
.group {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
