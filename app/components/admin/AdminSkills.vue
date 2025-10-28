<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const skills = ref([]);
const showModal = ref(false);
const editingSkill = ref(null);

const form = ref({
  name: "",
  category: "",
  level: 50, // 0 → 100
});

/* ✅ Charge compétences */
const loadSkills = async () => {
  const { data } = await axios.get("http://localhost:3333/api/skills");
  skills.value = data;
};

/* ✅ Ouvre modal (ajout ou modif) */
const openModal = (skill:  null) => {
  editingSkill.value = skill;
  form.value = skill ? { ...skill } : { name: "", category: "", level: 50 };
  showModal.value = true;
};

/* ✅ Save = ajout ou mise à jour */
const saveSkill = async () => {
  if (editingSkill.value) {
    await axios.put(
      `http://localhost:3333/api/skills/${editingSkill.value.id}`,
      form.value
    );
  } else {
    await axios.post("http://localhost:3333/api/skills", form.value);
  }

  showModal.value = false;
  loadSkills();
};

/* ✅ Delete */
const deleteSkill = async (id: number) => {
  if (!confirm("Supprimer cette compétence ?")) return;
  await axios.delete(`http://localhost:3333/api/skills/${id}`);
  loadSkills();
};

onMounted(() => loadSkills());
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Gestion des Compétences</h2>

    <button
      @click="openModal()"
      class="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      ➕ Ajouter une compétence
    </button>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="s in skills"
        :key="s.id"
        class="bg-white dark:bg-gray-800 shadow p-4 rounded-lg"
      >
        <h3 class="font-semibold text-lg">{{ s.name }}</h3>
        <p class="text-gray-500">{{ s.category }}</p>

        <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full"
            :style="{ width: s.level + '%' }"
          ></div>
        </div>

        <div class="flex gap-2 mt-3">
          <button
            @click="openModal(s)"
            class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            ✏️ Modifier
          </button>
          <button
            @click="deleteSkill(s.id)"
            class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            🗑 Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">
          {{ editingSkill ? "Modifier" : "Nouvelle compétence" }}
        </h3>

        <form @submit.prevent="saveSkill" class="space-y-3">
          <input v-model="form.name" placeholder="Nom" class="input" required />
          <input
            v-model="form.category"
            placeholder="Catégorie"
            class="input"
            required
          />
          <label class="text-sm text-gray-600"
            >Niveau : {{ form.level }}%</label
          >
          <input
            type="range"
            min="0"
            max="100"
            v-model="form.level"
            class="w-full"
          />

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

