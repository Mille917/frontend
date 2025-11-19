<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const stats = ref({
  projects: 0,
  skills: 0,
  experiences: 0,
  messages: 0,
  unreadMessages: 0,
});

const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const { data } = await axios.get("http://localhost:3333/api/dashboard");
    stats.value = data;
  } catch (err) {
    console.error("Erreur Dashboard:", err);
    error.value = "Erreur de chargement du tableau de bord.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 px-4 sm:px-6 py-30">
    <h1 class="text-3xl font-bold text-blue-900 mb-10 text-center">
      <i class="fas fa-chart-line mr-2 text-indigo-600"></i>
      Tableau de Bord Admin
    </h1>

    <!-- Loader -->
    <div v-if="loading" class="text-center text-gray-500 animate-pulse">
      <i class="fas fa-spinner fa-spin mr-2"></i>
      Chargement des statistiques...
    </div>

    <!-- Erreur -->
    <div v-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>

    <!-- Cartes statistiques -->
    <div
      v-if="!loading && !error"
      class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-8"
    >
      <NuxtLink
        to="/admin/projects"
        class="stat-card group border-t-4 border-blue-500 hover:border-blue-700"
      >
        <i
          class="fas fa-folder-open text-blue-500 text-3xl mb-3 group-hover:text-blue-700"
        ></i>
        <h2 class="text-3xl font-bold text-blue-900">{{ stats.projects }}</h2>
        <p class="text-gray-600">Projets</p>
      </NuxtLink>

      <NuxtLink
        to="/admin/skills"
        class="stat-card group border-t-4 border-indigo-500 hover:border-indigo-700"
      >
        <i
          class="fas fa-code text-indigo-500 text-3xl mb-3 group-hover:text-indigo-700"
        ></i>
        <h2 class="text-3xl font-bold text-indigo-900">{{ stats.skills }}</h2>
        <p class="text-gray-600">Compétences</p>
      </NuxtLink>

      <NuxtLink
        to="/admin/experiences"
        class="stat-card group border-t-4 border-purple-500 hover:border-purple-700"
      >
        <i
          class="fas fa-briefcase text-purple-500 text-3xl mb-3 group-hover:text-purple-700"
        ></i>
        <h2 class="text-3xl font-bold text-purple-900">
          {{ stats.experiences }}
        </h2>
        <p class="text-gray-600">Expériences</p>
      </NuxtLink>

      <NuxtLink
        to="/admin/messages"
        class="stat-card group border-t-4 border-green-500 hover:border-green-700"
      >
        <i
          class="fas fa-envelope text-green-500 text-3xl mb-3 group-hover:text-green-700"
        ></i>
        <h2 class="text-3xl font-bold text-green-900">{{ stats.messages }}</h2>
        <p class="text-gray-600">Messages</p>

        <!-- 🔴 Badge messages non lus -->
        <span
          v-if="stats.unreadMessages > 0"
          class="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1 animate-pulse"
        >
          {{ stats.unreadMessages }}
        </span>
      </NuxtLink>
    </div>

    <!-- Actions rapides -->
    <section class="mt-16 max-w-6xl mx-auto text-center">
      <h2 class="text-xl font-semibold text-gray-800 mb-8">
        <i class="fas fa-bolt text-yellow-500 mr-2"></i>
        Actions Rapides
      </h2>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          to="/admin/projects/new"
          class="action-card hover:bg-blue-100"
        >
          <i class="fas fa-plus-circle text-blue-600 text-xl mr-2"></i>
          Ajouter un projet
        </NuxtLink>

        <NuxtLink to="/admin/skills" class="action-card hover:bg-indigo-100">
          <i class="fas fa-cogs text-indigo-600 text-xl mr-2"></i>
          Gérer les compétences
        </NuxtLink>

        <NuxtLink
          to="/admin/experiences"
          class="action-card hover:bg-purple-100"
        >
          <i class="fas fa-user-tie text-purple-600 text-xl mr-2"></i>
          Gérer le parcours
        </NuxtLink>
        <NuxtLink to="/admin/messages" class="action-card hover:bg-green-100">
          <i class="fas fa-envelope-open text-green-600 text-xl mr-2"></i>
          Voir les messages
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
