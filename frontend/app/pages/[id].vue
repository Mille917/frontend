<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Project {
  title: string;
  description: string;
  technologies?: string;
  price?: string | number;
  duration?: string;
  imageUrl?: string;
  images?: string[];
  githubLink?: string;
  demoLink?: string;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const { $api } = useNuxtApp();
const route = useRoute();

const project = ref<Project | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

/* 🖼️ Gestion du zoom plein écran */
const showModal = ref(false);
const activeImage = ref<string | null>(null);

const openModal = (img: string) => {
  activeImage.value = img;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  activeImage.value = null;
};

const getErrorMessage = (err: unknown): string | undefined => {
  if (err instanceof Error) {
    return err.message;
  }

  if (typeof err === "object" && err !== null) {
    const response = (err as ApiErrorResponse).response;
    return response?.data?.message;
  }

  return undefined;
};

/* 🔄 Chargement du projet */
onMounted(async () => {
  try {
    const { data } = await $api.get<Project>(`/public/projects/${String(route.params.id)}`);
    project.value = data;
  } catch (err: unknown) {
    console.error("Erreur de chargement du projet :", err);
    error.value = getErrorMessage(err) || "Impossible de charger ce projet.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-6xl mx-auto py-20 px-6 relative">
    <!-- 🌀 Loader -->
    <div
      v-if="loading"
      class="text-center text-gray-500 animate-pulse flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-spinner fa-spin text-blue-600"></i>
      <span>Chargement du projet...</span>
    </div>

    <!-- ⚠️ Erreur -->
    <div
      v-if="error"
      class="text-red-600 text-center font-medium flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-triangle-exclamation"></i> {{ error }}
    </div>

    <!-- ✅ Contenu du projet -->
    <div v-if="project && !loading" class="space-y-12">
      <!-- 🧠 En-tête -->
      <div class="text-center space-y-4">
        <h1
          class="text-3xl sm:text-4xl font-bold text-blue-900 flex justify-center items-center gap-3"
        >
          <i class="fa-solid fa-diagram-project text-blue-700"></i>
          {{ project.title }}
        </h1>

        <div
          class="text-gray-600 max-w-3xl mx-auto leading-relaxed prose prose-sm sm:prose-base whitespace-pre-line"
        >
          {{ project.description }}
        </div>

        <div
          class="flex justify-center flex-wrap gap-4 mt-4 text-sm text-gray-600"
        >
          <span
            class="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full"
          >
            <i class="fa-solid fa-code mr-1"></i>
            {{ project.technologies || "Non spécifié" }}
          </span>

          <span
            v-if="project.price"
            class="px-3 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full"
          >
            <i class="fa-solid fa-dollar-sign mr-1"></i> Estimé :
            {{ project.price }} $
          </span>

          <span
            v-if="project.duration"
            class="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full"
          >
            <i class="fa-solid fa-clock mr-1"></i> {{ project.duration }}
          </span>
        </div>
      </div>

      <!-- 🖼️ Image principale -->
      <div
        v-if="project.imageUrl"
        class="rounded-2xl overflow-hidden shadow-md"
      >
        <img
          :src="project.imageUrl"
          alt="Image principale"
          class="w-full h-80 object-cover cursor-zoom-in"
          @click="openModal(project.imageUrl)"
        />
      </div>

      <!-- 🎠 Galerie Swiper -->
      <div v-if="project.images?.length" class="mt-10">
        <h2
          class="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2"
        >
          <i class="fa-solid fa-images text-blue-700"></i> Galerie du projet
        </h2>

        <Swiper
          :modules="[Navigation, Pagination]"
          :space-between="20"
          :slides-per-view="1"
          :pagination="{ clickable: true }"
          :navigation="true"
          :loop="true"
          class="rounded-xl shadow-md"
        >
          <SwiperSlide
            v-for="(img, index) in project.images"
            :key="index"
            class="overflow-hidden rounded-lg"
          >
            <img
              :src="img"
              class="w-full h-96 object-cover rounded-lg cursor-zoom-in"
              :alt="`Image ${index + 1}`"
              @click="openModal(img)"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- 🔗 Liens -->
      <div
        class="flex flex-wrap justify-center gap-6 text-sm font-medium mt-8 border-t border-gray-200 pt-6"
      >
        <a
          v-if="project.githubLink"
          :href="project.githubLink"
          target="_blank"
          class="flex items-center gap-2 text-gray-700 hover:text-black transition"
        >
          <i class="fa-brands fa-github text-xl"></i>
          Voir le code
        </a>

        <a
          v-if="project.demoLink"
          :href="project.demoLink"
          target="_blank"
          class="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          <i class="fa-solid fa-up-right-from-square text-sm"></i>
          Voir la démo
        </a>
      </div>

      <!-- 🔙 Retour -->
      <div class="mt-10 text-center">
        <NuxtLink
          to="/projects"
          class="inline-flex items-center gap-2 px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
        >
          <i class="fa-solid fa-arrow-left"></i> Retour aux projets
        </NuxtLink>
      </div>
    </div>

    <!-- 🖼️ Modal plein écran -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center animate-fadeIn"
      @click.self="closeModal"
    >
      <img
        v-if="activeImage"
        :src="activeImage"
        class="max-w-4xl max-h-[90vh] object-contain rounded-lg shadow-2xl"
        alt="Zoom image"
      />

      <!-- Bouton fermer -->
      <button
      class="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white text-2xl p-2 rounded-full"
        @click="closeModal"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Swiper */
.swiper {
  inline-size: 100%;
  block-size: 400px;
  border-radius: 16px;
  --swiper-navigation-color: #1d4ed8;
  --swiper-pagination-color: #1d4ed8;
}
.swiper-slide img {
  transition: transform 0.4s ease;
}
.swiper-slide img:hover {
  transform: scale(1.03);
}

/* Animation modale */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
