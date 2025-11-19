<script setup lang="ts">
import { ref, onMounted } from "vue"
const { $api } = useNuxtApp()

const skills = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchSkills() {
  try {
    const { data } = await $api.get("/skills")
    skills.value = data
  } catch (err: any) {
    error.value = err.response?.data?.message || "Erreur de chargement."
  } finally {
    loading.value = false
  }
}

async function deleteSkill(id: number) {
  if (!confirm("Supprimer cette compétence ?")) return
  try {
    await $api.delete(`/skills/${id}`)
    fetchSkills()
  } catch (err: any) {
    alert(err.response?.data?.message || "Erreur lors de la suppression.")
  }
}

onMounted(fetchSkills)
</script>

<template>
  <div class="max-w-6xl mx-auto py-24 px-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- ✅ En-tête -->
    <div
      class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
    >
      <h1
        class="text-3xl font-bold text-blue-900 flex items-center gap-3 text-center sm:text-left"
      >
        <i class="fa-solid fa-brain text-blue-700"></i>
        Gestion des compétences
      </h1>

      <NuxtLink
        to="/admin/skills/create"
        class="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <i class="fa-solid fa-plus"></i>
        Ajouter
      </NuxtLink>
    </div>

    <!-- ✅ Loader -->
    <div
      v-if="pending"
      class="flex justify-center items-center text-gray-500 py-12"
    >
      <i class="fa-solid fa-spinner fa-spin mr-2"></i>
      Chargement des compétences...
    </div>

    <!-- ✅ Erreur -->
    <p
      v-if="error"
      class="text-red-600 text-center font-medium flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-triangle-exclamation"></i>
      {{ error }}
    </p>
    <!-- ✅ Table responsive -->
    <div
      v-if="skills && skills.length"
      class="overflow-x-auto bg-white rounded-xl shadow-lg"
    >
      <table class="min-w-full border-collapse text-left">
        <thead
          class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          <tr>
            <th class="p-4 font-semibold">Nom</th>
            <th class="p-4 font-semibold">Catégorie</th>
            <th class="p-4 font-semibold text-center">Niveau</th>
            <th class="p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="skill in skills"
            :key="skill.id"
            class="border-t bg-gray-50 dark:bg-gray-700"
          >
            <td class="p-4 font-medium text-gray-900 dark:text-white">
              <i class="fa-solid fa-lightbulb text-yellow-400 mr-2"></i>
              {{ skill.name }}
            </td>
            <td class="p-4 text-gray-600 dark:text-gray-300">
              <i class="fa-solid fa-layer-group mr-2 text-gray-500"></i>
              {{ skill.category }}
            </td>
            <td class="p-4 text-center">
              <div class="flex flex-col items-center">
                <div
                  class="w-24 sm:w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-1 overflow-hidden"
                >
                  <div
                    class="bg-blue-600 h-2 rounded-full transition-all"
                    :style="{ width: skill.level + '%' }"
                  ></div>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-300">
                  {{ skill.level }}%
                </span>
              </div>
            </td>
            <td class="p-4 flex justify-center gap-3">
              <NuxtLink
                :to="`/admin/skills/${skill.id}`"
                class="text-yellow-600 hover:text-yellow-700 transition"
                title="Modifier"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </NuxtLink>
              <button
                @click="deleteSkill(skill.id)"
                class="text-red-600 hover:text-red-700 transition"
                title="Supprimer"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ✅ Aucun résultat -->
    <p v-else-if="!pending" class="text-gray-500 text-center mt-10">
      <i class="fa-solid fa-circle-info mr-2 text-blue-600"></i>
      Aucune compétence enregistrée.
    </p>

    <!-- ✅ Retour -->
    <NuxtLink
      to="/admin/dashboard"
      class="block text-center text-blue-600 mt-8 hover:underline flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-gauge"></i>
      Retour au tableau de bord
    </NuxtLink>
  </div>
</template>
