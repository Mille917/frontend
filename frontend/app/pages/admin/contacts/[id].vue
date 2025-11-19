<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "~~/stores/user";

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const contact = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    contact.value = await $fetch(
      `${config.public.apiBase}/contacts/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      }
    );

    if (!contact.value.is_read) {
      await $fetch(`${config.public.apiBase}/contacts/${route.params.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
        body: { is_read: true },
      });
      contact.value.is_read = true;
    }
  } catch (err: any) {
    console.error("Erreur de chargement :", err);
    error.value = err?.data?.message || "Erreur lors du chargement du message.";
  } finally {
    loading.value = false;
  }
});

const deleteMessage = async () => {
  if (!confirm("Voulez-vous vraiment supprimer ce message ?")) return;
  try {
    await $fetch(`${config.public.apiBase}/contacts/${route.params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    router.push("/admin/contacts");
  } catch (err) {
    console.error("Erreur de suppression :", err);
    alert("Erreur lors de la suppression du message.");
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-24">
    <div
      class="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <button
        @click="router.push('/admin/contacts')"
        class="text-blue-700 dark:text-blue-400 hover:underline mb-6 flex items-center gap-2 transition"
      >
        <i class="fa-solid fa-arrow-left"></i> Retour à la boîte de réception
      </button>

      <div
        v-if="loading"
        class="text-center text-gray-500 animate-pulse flex items-center justify-center gap-2"
      >
        <i class="fa-solid fa-spinner fa-spin"></i> Chargement du message...
      </div>

      <p
        v-if="error"
        class="text-center text-red-600 flex items-center justify-center gap-2"
      >
        <i class="fa-solid fa-triangle-exclamation"></i> {{ error }}
      </p>

      <div v-if="contact && !loading && !error">
        <div class="flex justify-between items-center mb-6">
          <h1
            class="text-2xl font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2"
          >
            <i class="fa-solid fa-envelope-open-text"></i>
            {{ contact.subject || "Message sans sujet" }}
          </h1>
          <button
            @click="deleteMessage"
            class="text-red-600 hover:text-red-800 flex items-center gap-1 transition"
          >
            <i class="fa-solid fa-trash"></i> Supprimer
          </button>
        </div>

        <div
          class="text-gray-700 dark:text-gray-300 space-y-2 mb-6 border-b pb-4 border-gray-200 dark:border-gray-700"
        >
          <p><strong>Nom :</strong> {{ contact.name }}</p>
          <p><strong>Email :</strong> {{ contact.email }}</p>
          <p>
            <strong>Reçu le :</strong>
            {{ new Date(contact.created_at).toLocaleString() }}
          </p>

          <p
            v-if="contact.is_read"
            class="text-green-700 dark:text-green-400 font-medium flex items-center gap-2"
          >
            <i class="fa-solid fa-circle-check"></i> Message lu
          </p>
          <p v-else class="text-yellow-600 font-medium flex items-center gap-2">
            <i class="fa-regular fa-envelope"></i> Non lu
          </p>
        </div>

        <p
          class="text-gray-800 dark:text-gray-100 whitespace-pre-line leading-relaxed"
        >
          {{ contact.message }}
        </p>
      </div>
    </div>
  </div>
</template>
