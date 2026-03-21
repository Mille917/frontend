<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isVisible = ref(true);
const isMenuOpen = ref(false); // ⭐ Nouveau : menu mobile
const clickCount = ref(0);
let lastScrollY = 0;
let clickTimeout = null;

/* ------------------------------------------------------------------
   🔐 Secret triple-clic
------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------
   🔽 Hide on scroll
------------------------------------------------------------------ */
const handleScroll = () => {
  const currentScrollY = window.scrollY;
  isVisible.value = currentScrollY < lastScrollY || currentScrollY < 50;
  lastScrollY = currentScrollY;
};

onMounted(() => {
  lastScrollY = window.scrollY;
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

/* ------------------------------------------------------------------
   📱 Fermer menu après clic
------------------------------------------------------------------ */
const closeMenu = () => {
  isMenuOpen.value = false;
};
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
    <nav class="bg-white dark:bg-gray-800 shadow-sm w-full transition-all duration-300">
      <div class="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        
        <!-- 🔐 Triple click -->
        <h1
          class="text-xl font-bold text-blue-600 dark:text-blue-400 select-none cursor-pointer"
          @click="triggerSecret"
        >
          Raïssa<span class="text-gray-800 dark:text-gray-200">.dev</span>
        </h1>

        <!-- 🌐 Menu Desktop -->
        <ul class="hidden md:flex gap-6 text-gray-700 dark:text-gray-300">
          <li><NuxtLink to="/" class="hover:text-blue-600">Accueil</NuxtLink></li>
          <li><NuxtLink to="/projects" class="hover:text-blue-600">Projets</NuxtLink></li>
          <li><NuxtLink to="/skills" class="hover:text-blue-600">Compétences</NuxtLink></li>
          <li><NuxtLink to="/experiences" class="hover:text-blue-600">Parcours</NuxtLink></li>
          <li><NuxtLink to="/contact" class="hover:text-blue-600">Contact</NuxtLink></li>
        </ul>

        <!-- 📱 Bouton Hamburger (mobile) -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden text-gray-700 dark:text-gray-200 text-2xl hover:text-blue-600 transition"
        >
          <i :class="isMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
        </button>
      </div>

      <!-- 📱 Menu Mobile -->
      <transition name="fade">
        <div
          v-if="isMenuOpen"
          class="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
        >
          <ul class="flex flex-col p-4 space-y-4 text-gray-700 dark:text-gray-300">
            <li><NuxtLink @click="closeMenu" to="/" class="mobile-link">Accueil</NuxtLink></li>
            <li><NuxtLink @click="closeMenu" to="/projects" class="mobile-link">Projets</NuxtLink></li>
            <li><NuxtLink @click="closeMenu" to="/skills" class="mobile-link">Compétences</NuxtLink></li>
            <li><NuxtLink @click="closeMenu" to="/experiences" class="mobile-link">Parcours</NuxtLink></li>
            <li><NuxtLink @click="closeMenu" to="/contact" class="mobile-link">Contact</NuxtLink></li>
          </ul>
        </div>
      </transition>
    </nav>
  </header>
</template>

<style scoped>
nav a.router-link-exact-active {
  color: #2563eb;
  font-weight: 600;
}

/* 🔥 Animation du menu mobile */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.mobile-link {
  display: block;
  padding: 8px 0;
  font-size: 1rem;
}
.mobile-link:hover {
  color: #2563eb;
}
</style>
