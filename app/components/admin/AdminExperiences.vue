<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const experiences = ref([]);
const showModal = ref(false);
const editing = ref(null);

const form = ref({
  company: "",
  role: "",
  start_date: "",
  end_date: "",
  description: "",
});

/* 🔹 Charger */
const load = async () => {
  const { data } = await axios.get("http://localhost:3333/api/experiences");
  experiences.value = data;
};

/* 🔹 Ouvrir la modal */
const openModal = (item: null) => {
  editing.value = item;
  form.value = item
    ? { ...item }
    : { company: "", role: "", start_date: "", end_date: "", description: "" };

  showModal.value = true;
};

/* 🔹 Sauvegarder */
const save = async () => {
  if (editing.value) {
    await axios.put(
      `http://localhost:3333/api/experiences/${editing.value.id}`,
      form.value
    );
  } else {
    await axios.post("http://localhost:3333/api/experiences", form.value);
  }
  showModal.value = false;
  load();
};

/* 🔹 Supprimer */
const remove = async (id: number) => {
  if (!confirm("Supprimer cette expérience ?")) return;
  await axios.delete(`http://localhost:3333/api/experiences/${id}`);
  load();
};

onMounted(() => load());
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Gestion des Expériences</h2>

    <button
      @click="openModal()"
      class="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      ➕ Ajouter une expérience
    </button>

    <div class="space-y-4">
      <div
        v-for="exp in experiences"
        :key="exp.id"
        class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
      >
        <h3 class="font-semibold text-lg">{{ exp.role }}</h3>
        <p class="text-gray-600">{{ exp.company }}</p>
        <p class="text-gray-500 text-sm">
          📅 {{ exp.start_date }} — {{ exp.end_date || "Aujourd’hui" }}
        </p>
        <p class="mt-2 text-gray-700">{{ exp.description }}</p>

        <div class="flex gap-2 mt-3">
          <button @click="openModal(exp)" class="btn-edit">✏️ Modifier</button>
          <button @click="remove(exp.id)" class="btn-delete">
            🗑 Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- 🔹 Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white dark:bg-gray-900 p-6 w-full max-w-md rounded-lg">
        <h3 class="text-xl font-bold mb-4">
          {{ editing ? "Modifier l’expérience" : "Nouvelle expérience" }}
        </h3>

        <form @submit.prevent="save" class="space-y-3">
          <input
            v-model="form.role"
            placeholder="Poste"
            class="input"
            required
          />
          <input
            v-model="form.company"
            placeholder="Entreprise"
            class="input"
            required
          />
          <div class="flex gap-2">
            <input
              v-model="form.start_date"
              type="date"
              class="input"
              required
            />
            <input v-model="form.end_date" type="date" class="input" />
          </div>
          <textarea
            v-model="form.description"
            placeholder="Description"
            rows="4"
            class="input"
          ></textarea>

          <div class="flex justify-end gap-2">
            <button type="button" @click="showModal = false" class="btn-cancel">
              Annuler
            </button>
            <button type="submit" class="btn-save">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

