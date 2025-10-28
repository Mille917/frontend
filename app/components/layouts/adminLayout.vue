<template>
  <div class="min-h-screen flex bg-gray-100 dark:bg-gray-900">
    <!-- ✅ Sidebar -->
    <aside class="w-64 bg-white dark:bg-gray-800 shadow-md p-6">
      <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Dashboard
      </h2>

      <nav class="flex flex-col gap-3">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'p-3 rounded-lg text-left transition',
            activeTab === tab.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300',
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>

      <button
        @click="logout"
        class="mt-10 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Déconnexion
      </button>
    </aside>

    <!-- ✅ Contenu dynamique -->
    <main class="flex-1 p-8">
      <slot :activeTab="activeTab"></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "~/stores/userStore";

const userStore = useUserStore();

// ✅ Les onglets disponibles
const tabs = [
  { id: "projects", label: "Projets" },
  { id: "skills", label: "Compétences" },
  { id: "experiences", label: "Expériences" },
  { id: "messages", label: "Messages" },
];

const activeTab = ref("projects");

const logout = () => {
  userStore.logout();
  navigateTo("/login");
};
</script>
