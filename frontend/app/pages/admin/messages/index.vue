<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "~~/stores/user";

const { $api } = useNuxtApp();
const userStore = useUserStore();

const contacts = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

/* ✅ Charger les messages */
const loadContacts = async () => {
  try {
    const { data } = await $api.get("/contacts", {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
    contacts.value = data.sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (err: any) {
    console.error("Erreur chargement contacts :", err);
    error.value =
      err.response?.data?.message || "Erreur lors du chargement des messages.";
  } finally {
    loading.value = false;
  }
};

/* ✅ Marquer comme lu / non lu */
const toggleRead = async (contact: any) => {
  try {
    await $api.put(
      `/contacts/${contact.id}`,
      { is_read: !contact.is_read },
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    );
    contact.is_read = !contact.is_read;
  } catch (err) {
    console.error("Erreur lors de la mise à jour du statut", err);
  }
};

/* ✅ Supprimer un message */
const deleteContact = async (id: number) => {
  if (!confirm("Supprimer ce message ?")) return;
  try {
    await $api.delete(`/contacts/${id}`, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
    contacts.value = contacts.value.filter((c) => c.id !== id);
  } catch (err) {
    console.error("Erreur lors de la suppression", err);
  }
};

onMounted(loadContacts);
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
      v-if="contacts.length > 0"
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
    >
      <div
        v-for="c in contacts"
        :key="c.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition relative"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-lg text-blue-800 dark:text-blue-300">
            {{ c.name }}
          </h2>
          <i
            v-if="c.is_read"
            class="fa-solid fa-circle-check text-green-600"
            title="Lu"
          ></i>
          <i
            v-else
            class="fa-regular fa-circle text-yellow-500"
            title="Non lu"
          ></i>
        </div>

        <p class="text-sm text-gray-500">{{ c.email }}</p>
        <!-- <p class="mt-3 font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
          {{ c.subject || "(Sans sujet)" }}
        </p> -->
        <p class="mt-2 text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
          {{ c.message }}
        </p>
        <p class="text-xs text-gray-400 mt-3">
          Reçu le {{ new Date(c.created_at).toLocaleString() }}
        </p>

        <div class="mt-4 flex justify-between items-center">
          <NuxtLink
            :to="`/admin/messages/${c.id}`"
            class="text-blue-600 text-sm hover:underline flex items-center gap-1"
          >
            <i class="fa-regular fa-eye"></i> Lire
          </NuxtLink>

          <div class="flex gap-2">
            <button
              @click="toggleRead(c)"
              class="text-sm rounded px-2 py-1 transition flex items-center gap-1"
              :class="
                c.is_read
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              "
            >
              <i
                :class="c.is_read ? 'fa-solid fa-check' : 'fa-regular fa-envelope-open'"
              ></i>
              {{ c.is_read ? 'Lu' : 'Non lu' }}
            </button>

            <button
              @click="deleteContact(c.id)"
              class="bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded text-sm flex items-center gap-1"
            >
              <i class="fa-solid fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <p
      v-if="!loading && contacts.length === 0 && !error"
      class="text-gray-500 text-center mt-10"
    >
      Aucun message reçu pour l’instant 📭
    </p>

    <NuxtLink
      to="/admin/dashboard"
      class="block text-center text-blue-600 mt-8 hover:underline flex items-center justify-center gap-2"
    >
      <i class="fas fa-arrow-left"></i> Retour au tableau de bord
    </NuxtLink>
  </div>
</template>
