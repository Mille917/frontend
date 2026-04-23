<script setup lang="ts">
import { ref, onMounted } from "vue";

const { $api } = useNuxtApp();

const experiences = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

function formatDate(date: any): string {
  if (!date) return "—";

  // Si c’est une string ISO ou SQL
  if (typeof date === "string") {
    // Corrige le format "YYYY-MM-DD HH:mm:ss" → "YYYY-MM-DDTHH:mm:ss"
    const clean = date.replace(" ", "T");
    const d = new Date(clean);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("fr-FR", { year: "numeric", month: "long" });
    }
  }

  // Si c’est un objet Luxon-like
  if (typeof date === "object" && date.year && date.month && date.day) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.toLocaleDateString("fr-FR", { year: "numeric", month: "long" });
  }

  return "—";
}

onMounted(async () => {
  try {
    const { data } = await $api.get("/experiences");
    experiences.value = data;
  } catch (err: any) {
    console.error("Erreur chargement parcours:", err);
    error.value =
      err.response?.data?.message || "Erreur lors du chargement du parcours.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-6xl mx-auto py-20 px-6">
    <!-- 🔹 Titre principal -->
    <h1
      class="text-3xl font-bold text-center text-blue-900  mb-16 flex items-center justify-center gap-3"
    >
      <i class="fa-solid fa-road text-blue-600 "></i>
      <span>{{ $t('experiences.title') }}</span>
    </h1>

    <!-- 🔹 Loader -->
    <div
      v-if="loading"
      class="text-center text-gray-500 animate-pulse flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-spinner fa-spin text-blue-600"></i>
      {{ $t('experiences.loading') }}
    </div>

    <!-- 🔹 Erreur -->
    <div
      v-if="error"
      class="text-red-500 text-center font-medium flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-triangle-exclamation"></i>
      {{ error }}
    </div>

    <!-- 🔹 Timeline -->
    <div
      v-if="experiences.length > 0"
      class="relative border-l-2 border-blue-200  ml-5 pl-8 space-y-10"
    >
      <div
        v-for="exp in experiences"
        :key="exp.id"
        class="relative group transition-all duration-300 hover:translate-x-1"
      >
        <!-- Timeline Dot -->
        <div
          class="absolute -left-4 top-2 w-7 h-7 bg-blue-600 rounded-full border-4 border-white  shadow-md flex items-center justify-center"
        >
          <i class="fa-solid fa-briefcase text-white text-xs"></i>
        </div>

        <!-- Timeline Card -->
        <div
          class="bg-white p-6 rounded-2xl shadow-sm hover:shadow-2xl transition duration-300 border border-gray-100"
        >
          <!-- Titre -->
          <h2
            class="text-xl font-semibold text-blue-800 group-hover:text-blue-600 mb-1 flex items-center gap-2"
          >
            <i
              class="fa-solid fa-code-branch text-blue-600"
            ></i>
            {{ exp.position }}
          </h2>

          <!-- Entreprise & localisation -->
          <p class="text-gray-600 font-medium mb-2">
            <i class="fa-solid fa-building text-gray-400 mr-1"></i>
            {{ exp.company }}
            <span v-if="exp.location" class="ml-1 text-gray-500">
              • {{ exp.location }}
            </span>
          </p>

          <!-- Dates -->

          <p class="text-gray-500 text-sm mb-3 italic">
            <i class="fa-regular fa-calendar text-blue-500 mr-1"></i>
            {{ formatDate(exp.startDate) }} — →
            <span v-if="exp.endDate">
              {{ formatDate(exp.endDate) }}
            </span>
            <span
              v-else
              class="font-semibold text-green-600"
            >
              {{ $t('experiences.today') }}
            </span>
          </p>
          <!-- Description -->
          <p class="text-gray-700 leading-relaxed">
            {{ exp.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- 🔹 Aucun résultat -->
    <p
      v-if="!loading && experiences.length === 0 && !error"
      class="text-gray-500 text-center mt-10 flex items-center justify-center gap-2"
    >
      <i class="fa-regular fa-circle-xmark text-gray-400"></i>
      {{ $t('experiences.empty') }}
    </p>
  </div>
</template>

<style scoped>
/* ✅ Effet doux sur les lignes de la timeline */
.border-l-2 {
  border-image: linear-gradient(to bottom, #3b82f6, #a5b4fc) 1;
}

/* ✅ Transition fluide au survol */
.group:hover .fa-briefcase {
  transform: scale(1.2);
  transition: transform 0.3s ease;
}

/* ✅ Dark mode ajustements */
.dark .border-l-2 {
  border-image: linear-gradient(to bottom, #2563eb, #1e3a8a) 1;
}
</style>
