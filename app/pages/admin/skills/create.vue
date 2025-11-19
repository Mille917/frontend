<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const { $api } = useNuxtApp()

const form = ref({
  name: "",
  category: "",
  level: 50,
})

const loading = ref(false)
const error = ref<string | null>(null)

const saveSkill = async () => {
  loading.value = true
  error.value = null

  try {
    // ✅ plus besoin de /api ici car ton baseURL le contient déjà
    await $api.post("/skills", form.value)
    router.push("/admin/skills")
  } catch (err: any) {
    console.error("❌ Erreur API:", err)
    error.value = err.response?.data?.message || "Erreur lors de l’enregistrement."
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="max-w-lg mx-auto py-24 px-6">
    <h1
      class="text-3xl font-bold text-blue-900 mb-8 flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-lightbulb text-yellow-500"></i>
      Nouvelle compétence
    </h1>

    <form
      @submit.prevent="saveSkill"
      class="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6"
    >
      <!-- Nom -->
      <div>
        <label class="label">
          <i class="fa-solid fa-font mr-2"></i>Nom de la compétence
        </label>
        <input
          v-model="form.name"
          placeholder="Ex: Vue.js"
          class="inputSkills"
          required
        />
      </div>

      <!-- Catégorie -->
      <div>
        <label class="label">
          <i class="fa-solid fa-layer-group mr-2"></i>Catégorie
        </label>
        <input
          v-model="form.category"
          placeholder="Ex: Frontend, Backend, Outils..."
          class="inputSkills"
          required
        />
      </div>

      <!-- Niveau -->
      <div>
        <label class="label">
          <i class="fa-solid fa-signal mr-2"></i>Niveau : {{ form.level }}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          v-model="form.level"
          class="w-full accent-blue-600"
        />
      </div>

      <p v-if="error" class="text-red-600 text-center">{{ error }}</p>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <NuxtLink
          to="/admin/skills"
          class="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
        >
          <i class="fa-solid fa-arrow-left"></i>
          Annuler
        </NuxtLink>
        <button
          type="submit"
          class="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
          :disabled="loading"
        >
          <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-floppy-disk"></i>
          {{ loading ? "Enregistrement..." : "Sauvegarder" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>
