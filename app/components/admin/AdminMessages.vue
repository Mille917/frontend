<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const messages = ref([]);

const loadMessages = async () => {
  const { data } = await axios.get("http://localhost:3333/api/contact");
  messages.value = data;
};

const deleteMessage = async (id: number) => {
  if (!confirm("Supprimer ce message ?")) return;
  await axios.delete(`http://localhost:3333/api/contact/${id}`);
  loadMessages();
};

onMounted(() => loadMessages());
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Messages reçus</h2>

    <div v-if="messages.length === 0" class="text-gray-500">
      Aucun message pour le moment 📭
    </div>

    <div class="space-y-4">
      <div
        v-for="m in messages"
        :key="m.id"
        class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow relative"
      >
        <p class="font-semibold">{{ m.name }} — {{ m.email }}</p>
        <p class="mt-2">{{ m.message }}</p>

        <button
          @click="deleteMessage(m.id)"
          class="absolute top-3 right-3 text-red-600 hover:text-red-800"
        >
          🗑
        </button>
      </div>
    </div>
  </div>
</template>
