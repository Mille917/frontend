<script setup lang="ts">

const { data: home } = await useAsyncData(() =>
  queryCollection("content").path("/").first()
);

useSeoMeta({
  title: home.value?.title || "Portfolio — Raïssa Bomboko",
  description:
    home.value?.description || "Découvrez mes compétences et projets",
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <!-- ✅ Hero Section -->
    <section class="bg-gradient-to-br from-indigo-800 via-blue-800 to-indigo-900 text-white py-24">
      <div
        class="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 px-6"
      >
        <!-- Photo -->
        <img
          src="/raissa-bomboko-profile.jpg"
          alt="Raïssa Bomboko"
          class="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-white"
        />

        <!-- Texte -->
        <div>
          <h1 class="text-4xl font-bold">Raïssa Bomboko</h1>
          <p class="text-lg opacity-90 mt-2">
            Développeuse Full Stack • Passionnée de technologies
          </p>
          <NuxtLink
            to="/projects"
            class="inline-block mt-6 bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium shadow-md hover:bg-gray-800 hover:text-amber-50 transition-colors duration-600"
          >
            Voir mes projets <i class="fas fa-rocket"></i>
          </NuxtLink>
        </div>
      </div>
    </section>
    <section class="border-b border-gray-300 mb-12">
      <div class="max-w-6xl mx-auto px-6 py-4 text-center text-gray-700">
        <p>
          Bienvenue sur mon portfolio ! Je suis ravie de partager avec vous mes
          compétences, expériences et projets. N'hésitez pas à explorer les
          différentes sections pour en savoir plus sur mon parcours et mes
          réalisations.
        </p>
      </div>
    </section>

    <!-- ✅ Navigation interne -->
    <main
      class="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8 text-center">
      <NuxtLink
        to="/skills"
        class="group border rounded-2xl p-10 shadow-md transition hover:shadow-2xl hover:-translate-y-2 bg-white hover:bg-blue-50"
      >
        <h2
          class="text-xl font-semibold text-blue-900 mb-3 group-hover:text-blue-700 transition"
        >
          Compétences
        </h2>
        <p class="text-gray-600 group-hover:text-blue-600 transition">
          Découvrez ma boîte à outils technique
        </p>
      </NuxtLink>

      <NuxtLink
        to="/experiences"
        class="group border rounded-2xl p-10 shadow-md transition hover:shadow-2xl hover:-translate-y-2 bg-white hover:bg-blue-50"
      >
        <h2
          class="text-xl font-semibold text-blue-900 mb-3 group-hover:text-blue-700 transition"
        >
          Parcours
        </h2>
        <p class="text-gray-600 group-hover:text-blue-600 transition">
          Mon évolution dans le domaine
        </p>
      </NuxtLink>

      <NuxtLink
        to="/contact"
        class="group border rounded-2xl p-10 shadow-md transition hover:shadow-2xl hover:-translate-y-2 bg-white hover:bg-blue-50"
      >
        <h2
          class="text-xl font-semibold text-blue-900 mb-3 group-hover:text-blue-700 transition"
        >
          Contact
        </h2>
        <p class="text-gray-600 group-hover:text-blue-600 transition">
          Travaillons ensemble <i class="fas fa-handshake text-grey-700"></i>
        </p>
      </NuxtLink>
    </main>
  </div>
</template>
