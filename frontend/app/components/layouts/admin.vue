<template>
  <div class="min-h-screen flex bg-gray-100 dark:bg-gray-900">
    <!-- ✅ Sidebar -->
    <aside
      :class="[
        'fixed md:static top-0 left-0 z-40 h-full md:h-auto w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out flex flex-col justify-between',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <div class="p-6">
        <!-- Logo / titre -->
        <NuxtLink
          to="/admin/dashboard"
          class="block text-xl font-bold mb-8 text-gray-900 dark:text-white hover:text-blue-600 transition"
        >
          <i class="fa-solid fa-gauge mr-2 text-blue-600"></i> Tableau de bord
        </NuxtLink>

        <!-- Navigation -->
        <nav class="flex flex-col gap-3">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="setActive(tab.id)"
            :class="[
              'relative p-3 rounded-lg text-left transition flex items-center justify-between',
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
            ]"
          >
            <span>
              <i :class="tab.icon + ' mr-2'"></i>
              {{ tab.label }}
            </span>

            <!-- 🔴 Badge messages non lus -->
            <span
              v-if="tab.id === 'messages' && unreadCount > 0"
              class="absolute top-2 right-3 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 animate-pulse"
            >
              {{ unreadCount }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Déconnexion -->
      <div class="p-6">
        <button
          @click="logout"
          class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
        >
          <i class="fa-solid fa-right-from-bracket"></i> Déconnexion
        </button>
      </div>
    </aside>

    <!-- ✅ Overlay mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- ✅ Contenu principal -->
    <main class="flex-1 p-6 md:p-8 overflow-y-auto w-full">
      <!-- Bouton mobile -->
      <div class="md:hidden flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">
          Panneau d’administration
        </h2>
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="text-2xl text-gray-700 dark:text-gray-200 focus:outline-none"
        >
          <i
            :class="sidebarOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"
          ></i>
        </button>
      </div>

      <slot :activeTab="activeTab"></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "~~/stores/user";

const userStore = useUserStore();
const activeTab = ref("projects");
const unreadCount = ref(0);
const sidebarOpen = ref(false);
const apiBase = useRuntimeConfig().public.apiBase;

// ✅ Liste des onglets
const tabs = [
  { id: "projects", label: "Projets", icon: "fa-solid fa-folder-open" },
  { id: "skills", label: "Compétences", icon: "fa-solid fa-brain" },
  { id: "experiences", label: "Expériences", icon: "fa-solid fa-briefcase" },
  { id: "messages", label: "Messages", icon: "fa-solid fa-envelope" },
];

// 🔹 Activer un onglet
const setActive = (id: string) => {
  activeTab.value = id;
  sidebarOpen.value = false; // ferme sur mobile
};

// 🔹 Charger le nombre de messages non lus
const fetchUnreadMessages = async () => {
  try {
    const { data } = await axios.get(`${apiBase}/api/contacts`);
    unreadCount.value = data.filter((m: any) => !m.is_read).length;
  } catch (err) {
    console.error("Erreur chargement messages non lus:", err);
  }
};

onMounted(() => {
  fetchUnreadMessages();
  // 🔁 Vérifie toutes les 60 secondes
  setInterval(fetchUnreadMessages, 60000);
});

const logout = () => {
  userStore.logout();
  navigateTo("/login");
};
</script>

<style scoped>
/* Petite animation douce pour la sidebar */
aside {
  will-change: transform;
}

@media (max-width: 768px) {
  aside {
    position: fixed;
    height: 100vh;
  }
}
</style>
