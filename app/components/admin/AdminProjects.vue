<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const projects = ref([])
const showModal = ref(false)
const editingProject = ref(null)

const form = ref({
  title: '',
  description: '',
  image_url: '',
  technologies: '',
  github_link: '',
  demo_link: '',
})

/* ✅ Charger les projets */
const loadProjects = async () => {
  const { data } = await axios.get('http://localhost:3333/api/projects')
  projects.value = data
}

/* ✅ Ouvrir modal (ajout ou modification) */
const openModal = (project: null) => {
  editingProject.value = project
  form.value = project
    ? { ...project }
    : {
        title: '',
        description: '',
        image_url: '',
        technologies: '',
        github_link: '',
        demo_link: '',
      }
  showModal.value = true
}

/* ✅ Ajouter ou Mettre à jour */
const saveProject = async () => {
  if (editingProject.value) {
    await axios.put(`http://localhost:3333/api/projects/${editingProject.value.id}`, form.value)
  } else {
    await axios.post('http://localhost:3333/api/projects', form.value)
  }

  showModal.value = false
  loadProjects()
}

/* ✅ Supprimer */
const deleteProject = async (id: number) => {
  if (!confirm('Supprimer ce projet ?')) return
  await axios.delete(`http://localhost:3333/api/projects/${id}`)
  loadProjects()
}

onMounted(() => loadProjects())
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Gestion des Projets</h2>

    <button
      @click="openModal()"
      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4"
    >
      ➕ Ajouter un projet
    </button>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="p in projects"
        :key="p.id"
        class="bg-white dark:bg-gray-800 shadow p-4 rounded-lg"
      >
        <img
          :src="p.image_url || '/placeholder.jpg'"
          class="rounded mb-3 h-40 w-full object-cover"
        />

        <h3 class="font-semibold text-lg">{{ p.title }}</h3>
        <p class="text-gray-500 text-sm mb-3">{{ p.description }}</p>

        <div class="flex gap-2">
          <button
            @click="openModal(p)"
            class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            ✏ Modifier
          </button>

          <button
            @click="deleteProject(p.id)"
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
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div class="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-lg">
        <h3 class="text-xl font-bold mb-4">
          {{ editingProject ? 'Modifier le projet' : 'Nouveau projet' }}
        </h3>

        <form @submit.prevent="saveProject" class="space-y-3">
          <input v-model="form.title" placeholder="Titre" class="input" required />
          <textarea v-model="form.description" placeholder="Description" class="input" required />
          <input v-model="form.image_url" placeholder="Image URL" class="input" />
          <input v-model="form.technologies" placeholder="Technologies (séparées par des virgules)" class="input" />
          <input v-model="form.github_link" placeholder="Lien GitHub" class="input" />
          <input v-model="form.demo_link" placeholder="Lien Démo" class="input" />

          <div class="flex justify-end gap-2">
            <button @click="showModal = false" type="button" class="bg-gray-500 text-white px-3 py-1 rounded">
              Annuler
            </button>

            <button type="submit" class="bg-blue-600 text-white px-3 py-1 rounded">
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full border rounded px-3 py-2;
}
</style>
