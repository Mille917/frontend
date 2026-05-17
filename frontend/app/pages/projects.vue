<script setup lang="ts">
import { ref, onMounted } from "vue";

const { $api } = useNuxtApp();

interface ProjectItem {
  id: string | number;
  title: string;
  description: string;
  imageUrl?: string;
  images?: string[];
  githubLink?: string;
  demoLink?: string;
}

interface RawProjectItem {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  imageUrl?: unknown;
  image_url?: unknown;
  images?: unknown;
  githubLink?: unknown;
  github_link?: unknown;
  demoLink?: unknown;
  demo_link?: unknown;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const projects = ref<ProjectItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const { data } = await $api.get<RawProjectItem[]>("/public/projects");
    // Normaliser les champs snake_case -> camelCase
    const normalize = (p: RawProjectItem): ProjectItem => ({
      id: (p.id ?? "") as string | number,
      title: String(p.title ?? ""),
      description: String(p.description ?? ""),
      imageUrl: (p.imageUrl as string) ?? (p.image_url as string | undefined),
      images: Array.isArray(p.images) ? (p.images as string[]) : undefined,
      githubLink: (p.githubLink as string) ?? (p.github_link as string | undefined),
      demoLink: (p.demoLink as string) ?? (p.demo_link as string | undefined),
    });

    const normalized = data.map(normalize);

    // Précharger toutes les images avant affichage
    await Promise.all(
      normalized.map(
        (project) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = project.imageUrl || "/placeholder-project.jpg";
            img.onload = resolve;
            img.onerror = resolve;
          })
      )
    );

    projects.value = normalized;
  } catch (err: unknown) {
    console.error("Erreur chargement projets:", err);
    const apiError = err as ApiErrorResponse;
    error.value = apiError.response?.data?.message || "Erreur de chargement.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-6xl mx-auto py-20 px-6">
    <!-- 🔹 Titre principal -->
    <h1
      class="text-3xl font-bold text-center text-blue-900 mb-12 flex items-center justify-center gap-3"
    >
      <i class="fa-solid fa-folder-tree text-blue-700"></i>
      <span>{{ $t('projects.title') }}</span>
    </h1>

    <!-- 🔹 Loader -->
    <div
      v-if="loading"
      class="text-center text-gray-500 animate-pulse flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-spinner fa-spin text-blue-600"></i>
      <span>{{ $t('projects.loading') }}</span>
    </div>

    <!-- 🔹 Erreur -->
    <div
      v-if="error"
      class="text-red-500 text-center font-medium flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-triangle-exclamation"></i>
      {{ error }}
    </div>

    <!-- 🔹 Liste des projets -->
    <div
      v-if="projects.length > 0"
      class="grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
    >
      <div
        v-for="project in projects"
        :key="project.id"
        class="group bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 border border-gray-200 flex flex-col"
      >
        <!-- 🖼 Image -->
        <div class="relative">
          <img
            :src="project.imageUrl || '/placeholder-project.jpg'"
            alt="Image du projet"
            class="h-48 w-full object-cover group-hover:opacity-90 transition"
          />
          <div
            class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition"
          ></div>
        </div>

        <!-- 🧾 Contenu -->
        <div class="p-5 flex flex-col flex-1">
          <h2
            class="text-xl font-semibold text-blue-900 group-hover:text-indigo-600 transition mb-2 flex items-center gap-2"
          >
            <i class="fa-solid fa-diagram-project text-indigo-600"></i>
            {{ project.title }}
          </h2>

          <div
            class="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 overflow-hidden"
            v-html="project.description"
          ></div>

          <!-- 🔗 Liens et détails -->
          <div class="flex justify-between items-center mt-auto pt-3 border-t">
            <div class="flex gap-4">
              <a
                v-if="project.githubLink"
                :href="project.githubLink"
                target="_blank"
                class="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition text-sm font-medium"
              >
                <i class="fa-brands fa-github"></i>
                {{ $t('projects.code') }}
              </a>

              <a
                v-if="project.demoLink"
                :href="project.demoLink"
                target="_blank"
                class="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition text-sm font-medium"
              >
                <i class="fa-solid fa-up-right-from-square"></i>
                {{ $t('projects.demo') }}
              </a>
            </div>

            <!-- 👁️ Bouton voir détails -->
            <NuxtLink
              :to="`/${project.id}`"
              class="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition"
            >
              <i class="fa-solid fa-eye"></i>
              {{ $t('projects.details') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔹 Aucun projet -->
    <p
      v-if="!loading && projects.length === 0 && !error"
      class="text-gray-500 text-center mt-10 flex items-center justify-center gap-2"
    >
      <i class="fa-regular fa-circle-xmark text-gray-400"></i>
      {{ $t('projects.empty') }}
    </p>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
