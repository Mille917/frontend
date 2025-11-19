<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isVisible = ref(true);
const clickCount = ref(0);
let lastScrollY = 0;
let clickTimeout = null;

// ✅ Secret triple-clic
const triggerSecret = () => {
  clickCount.value++;

  if (clickTimeout) clearTimeout(clickTimeout);

  clickTimeout = setTimeout(() => {
    clickCount.value = 0;
  }, 1000);

  if (clickCount.value === 3) {
    clickCount.value = 0;
    router.push("/admin/login");
  }
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  isVisible.value = currentScrollY < lastScrollY || currentScrollY < 50;
  lastScrollY = currentScrollY;
};

// ✅ S’exécute uniquement côté client
onMounted(() => {
  lastScrollY = window.scrollY;
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header
    class="fixed top-0 left-0 w-full z-50 transition-all duration-300"
    :class="[
      isVisible
        ? 'opacity-100 pointer-events-auto'
        : 'opacity-0 pointer-events-none',
      'hover:opacity-100 hover:pointer-events-auto',
    ]"
  >
    <nav
      class="bg-white dark:bg-gray-800 shadow-sm fixed w-full z-50 top-0 left-0 transition-all duration-300"
    >
      <div
        class="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center"
      >
        <!-- ✅ Triple click ici -->
        <h1
          class="text-xl font-bold text-blue-600 dark:text-blue-400 select-none"
          @click="triggerSecret"
        >
          Raïssa<span class="text-gray-800 dark:text-gray-200">.dev</span>
        </h1>

        <ul class="flex gap-6 text-gray-700 dark:text-gray-300">
          <li>
            <NuxtLink to="/" class="hover:text-blue-600">Accueil</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/projects" class="hover:text-blue-600"
              >Projets</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/skills" class="hover:text-blue-600"
              >Compétences</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/experiences" class="hover:text-blue-600"
              >Parcours</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/contact" class="hover:text-blue-600"
              >Contact</NuxtLink
            >
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped>
nav a.router-link-exact-active {
  color: #2563eb;
  font-weight: 600;
}
</style>
