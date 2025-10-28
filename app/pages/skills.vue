<script setup lang="ts">
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const skills = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const data = await $fetch(`${apiBase}/api/skills`);
    skills.value = data;
  } catch (err: any) {
    error.value = err?.message || "Erreur de chargement";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-6xl mx-auto py-20 px-6">
    <h1 class="text-3xl font-bold text-center text-blue-900 mb-12">
      Mes Compétences 💡
    </h1>

    <!-- Loader -->
    <div v-if="loading" class="text-center text-gray-500 animate-pulse">
      Chargement des compétences...
    </div>

    <!-- Erreur -->
    <div v-if="error" class="text-red-500 text-center font-medium">
      ❌ {{ error }}
    </div>

    <!-- Skills Grid -->
    <div
      v-if="skills.length > 0"
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <div
        v-for="skill in skills"
        :key="skill.id"
        class="group bg-white p-6 rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all border"
      >
        <h2
          class="text-lg font-semibold text-indigo-700 mb-2 group-hover:text-indigo-900 transition"
        >
          {{ skill.name }}
        </h2>

        <p class="text-sm text-gray-500 mb-3">
          {{ skill.category || "Autres" }}
        </p>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            class="bg-indigo-600 h-3 transition-all"
            :style="{ width: skill.level + '%' }"
          ></div>
        </div>

        <!-- Level Text -->
        <p class="mt-2 text-right text-sm text-gray-600">{{ skill.level }}%</p>
      </div>
    </div>

    <!-- Aucun résultat -->
    <p
      v-if="!loading && skills.length === 0 && !error"
      class="text-gray-500 text-center mt-10"
    >
      Aucune compétence enregistrée pour le moment.
    </p>
  </div>
</template>
