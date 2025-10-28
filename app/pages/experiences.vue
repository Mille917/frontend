<script setup lang="ts">
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const experiences = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const data = await $fetch(`${apiBase}/api/experiences`)
    experiences.value = data
  } catch (err: any) {
    error.value = err?.message || 'Erreur de chargement'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto py-20 px-6">
    <h1 class="text-3xl font-bold text-center text-blue-900 mb-12">
      Mon Parcours 🚀
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-gray-500 animate-pulse">
      Chargement des expériences...
    </div>

    <!-- Error -->
    <div v-if="error" class="text-red-500 text-center font-medium">
      ❌ {{ error }}
    </div>

    <!-- Timeline -->
    <div class="relative border-l border-indigo-300 ml-4 pl-6 space-y-12">
      <div
        v-for="exp in experiences"
        :key="exp.id"
        class="relative"
      >
        <!-- Dot -->
        <div
          class="absolute -left-3 w-6 h-6 bg-indigo-600 rounded-full border-4 border-white shadow"
        ></div>

        <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition border group">
          <h2 class="text-xl font-semibold text-indigo-700 group-hover:text-indigo-900 transition">
            {{ exp.title }}
          </h2>
          <p class="text-gray-600 font-medium mb-2">
            {{ exp.company }} • {{ exp.location }}
          </p>
          <p class="text-gray-500 text-sm mb-3 italic">
            {{ exp.start_date }} → {{ exp.end_date || "Aujourd'hui" }}
          </p>
          <p class="text-gray-700">
            {{ exp.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty Message -->
    <p
      v-if="!loading && experiences.length === 0 && !error"
      class="text-gray-500 text-center mt-10"
    >
      Aucun parcours enregistré pour le moment.
    </p>
  </div>
</template>
