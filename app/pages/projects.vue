<script setup lang="ts">
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const projects = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const data = await $fetch(`${apiBase}/api/projects`);
    projects.value = data;
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
      Mes Projets 🚀
    </h1>

    <!-- Loader -->
    <div v-if="loading" class="text-center text-gray-500 animate-pulse">
      Chargement des projets...
    </div>

    <!-- Erreur -->
    <div v-if="error" class="text-red-500 text-center font-medium">
      ❌ {{ error }}
    </div>

    <!-- Projets -->
    <div
      v-if="projects.length > 0"
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
    >
      <div
        v-for="project in projects"
        :key="project.id"
        class="group bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2"
      >
        <!-- Image -->
        <img
          :src="project.image_url || '/placeholder-project.jpg'"
          alt="Project image"
          class="h-48 w-full object-cover group-hover:opacity-90 transition"
        />

        <!-- Content -->
        <div class="p-5">
          <h2
            class="text-xl font-semibold text-blue-900 group-hover:text-indigo-600 transition mb-2"
          >
            {{ project.title }}
          </h2>

          <p class="text-gray-600 text-sm mb-4">
            {{ project.description }}
          </p>

          <!-- Actions -->
          <div class="flex gap-4">
            <a
              v-if="project.github_link"
              :href="project.github_link"
              target="_blank"
              class="text-indigo-700 font-medium hover:text-indigo-900 transition"
            >
              💻 Code
            </a>
            <a
              v-if="project.demo_link"
              :href="project.demo_link"
              target="_blank"
              class="text-blue-700 font-medium hover:text-blue-900 transition"
            >
              🔗 Demo
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Aucun projet -->
    <p
      v-if="!loading && projects.length === 0 && !error"
      class="text-gray-500 text-center mt-10"
    >
      Aucun projet pour le moment.
    </p>
  </div>
</template>
