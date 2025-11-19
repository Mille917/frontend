<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "~~/stores/user";

const config = useRuntimeConfig();
const userStore = useUserStore();
const messages = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const loadMessages = async () => {
  try {
    messages.value = await $fetch(`${config.public.apiBase}/contacts`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
  } catch (err: any) {
    console.error("Erreur de chargement :", err);
    error.value =
      err?.data?.message || "Erreur lors du chargement des messages.";
  } finally {
    loading.value = false;
  }
};

const deleteMessage = async (id: number) => {
  if (!confirm("Supprimer ce message ?")) return;
  try {
    await $fetch(`${config.public.apiBase}/contacts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    messages.value = messages.value.filter((m) => m.id !== id);
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
  }
};

onMounted(loadMessages);
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-24">
    <h1
      class="text-3xl font-bold text-blue-900 dark:text-blue-300 mb-10 text-center flex items-center justify-center gap-3"
    >
      <i class="fa-solid fa-envelope text-blue-700"></i>
      Messages reçus
    </h1>

    <div
      v-if="loading"
      class="text-center text-gray-500 animate-pulse flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-spinner fa-spin"></i> Chargement des messages...
    </div>

    <p
      v-if="error"
      class="text-red-600 text-center flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-triangle-exclamation"></i> {{ error }}
    </p>

    <div
      v-if="messages.length > 0"
      class="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
    >
      <div
        v-for="m in messages"
        :key="m.id"
        class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition relative"
      >
        <p class="font-semibold text-blue-800 dark:text-blue-300">
          {{ m.name }} — <span class="text-gray-600">{{ m.email }}</span>
        </p>
        <p class="mt-2 text-gray-700 dark:text-gray-300">{{ m.message }}</p>

        <div class="flex justify-between items-center mt-4">
          <NuxtLink
            :to="`/admin/contacts/${m.id}`"
            class="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <i class="fa-regular fa-eye"></i> Lire
          </NuxtLink>

          <button
            @click="deleteMessage(m.id)"
            class="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
          >
            <i class="fa-solid fa-trash"></i> Supprimer
          </button>
        </div>
      </div>
    </div>

    <p
      v-if="!loading && messages.length === 0 && !error"
      class="text-center text-gray-500 mt-10"
    >
      Aucun message reçu pour l’instant 📭
    </p>
     <!-- ✅ Lien vers le dashboard -->
    <NuxtLink
      to="/admin/dashboard"
      class="block text-center text-blue-600 mt-10 hover:underline flex items-center justify-center gap-2"
    >
      <i class="fas fa-arrow-left"></i> Retour au tableau de bord
    </NuxtLink>
  </div>
</template>
