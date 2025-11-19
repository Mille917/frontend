<template>
  <div class="bg-white text-gray-900 min-h-screen flex flex-col">
    <!-- ✅ Header / Navbar -->
    <header class="w-full border-b border-indigo-800 bg-white/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-50">
      <nav class="max-w-6xl mx-auto flex items-center justify-between p-4">
        <NuxtLink to="/" class="text-xl font-bold text-blue-900 tracking-wide">
          Raïssa Bomboko
        </NuxtLink>

        <ul class="flex gap-6 font-medium">
          <li><NuxtLink class="text-indigo-800 hover:text-blue-700" to="/projects">Projets</NuxtLink></li>
          <li><NuxtLink class="text-indigo-800 hover:text-blue-700" to="/skills">Compétences</NuxtLink></li>
          <li><NuxtLink class="text-indigo-800 hover:text-blue-700" to="/experiences">Parcours</NuxtLink></li>
          <li><NuxtLink class="text-indigo-800 hover:text-blue-700" to="/contact">Contact</NuxtLink></li>
        </ul>
      </nav>
    </header>
  </div>
</template>
<script setup>
useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css",
      integrity:
        "sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==",
      crossorigin: "anonymous",
      referrerpolicy: "no-referrer",
    },
  ],
});
</script>
