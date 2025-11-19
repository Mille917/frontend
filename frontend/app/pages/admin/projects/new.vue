<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~~/stores/user";

const { $api } = useNuxtApp();
const router = useRouter();
const userStore = useUserStore();

/* 🧾 Formulaire */
const form = ref({
  title: "",
  description: "",
  technologies: "",
  imageUrl: "",
  githubLink: "",
  demoLink: "",
  price: "",
  duration: "",
  images: [] as string[],
});

/* 🖼️ Fichiers */
const mainImage = ref<File | null>(null);
const mainPreview = ref<string | null>(null);
const galleryFiles = ref<File[]>([]);
const galleryPreviews = ref<string[]>([]);

const loading = ref(false);
const error = ref<string | null>(null);

/* ✅ Image principale */
const selectMainImage = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    mainImage.value = file;
    mainPreview.value = URL.createObjectURL(file);
  }
};
const removeMainImage = () => {
  mainImage.value = null;
  mainPreview.value.imageUrl = null;
};

/* ✅ Galerie */
const selectGallery = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files) {
    const newFiles = Array.from(files);
    galleryFiles.value.push(...newFiles);
    galleryPreviews.value.push(...newFiles.map((f) => URL.createObjectURL(f)));
  }
};
const removeGalleryImage = (index: number) => {
  galleryFiles.value.splice(index, 1);
  galleryPreviews.value.splice(index, 1);
};

/* ✅ Enregistrer un projet */
const saveProject = async () => {
  loading.value = true;
  error.value = null;

  const formData = new FormData();
  Object.entries(form.value).forEach(([key, val]) =>
    formData.append(key, val as any)
  );

  if (mainImage.value) formData.append("image", mainImage.value);
  galleryFiles.value.forEach((file) => formData.append("images", file));

  try {
    await $api.post("/projects", formData, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
    router.push("/admin/projects");
  } catch (err: any) {
    console.error("Erreur création projet :", err);
    error.value =
      err.response?.data?.message ||
      "❌ Erreur lors de l’enregistrement du projet.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto py-24 px-6">
    <h1 class="text-3xl font-bold text-blue-900 mb-8 flex items-center gap-3">
      <i class="fa-solid fa-folder-plus text-blue-700"></i>
      Nouveau Projet
    </h1>

    <form
      @submit.prevent="saveProject"
      class="bg-white p-8 rounded-2xl shadow border border-gray-200 space-y-6"
    >
      <!-- 🔹 Titre -->
      <div>
        <label class="label"><i class="fa-solid fa-heading mr-2"></i> Titre</label>
        <input v-model="form.title" class="inputProject" required />
      </div>

      <!-- 🔹 Description -->
      <div>
        <label class="label"><i class="fa-solid fa-align-left mr-2"></i> Description</label>
        <textarea
          v-model="form.description"
          rows="4"
          class="inputProject"
          placeholder="Décrivez brièvement le projet..."
          required
        ></textarea>
      </div>

      <!-- 🔹 Technologies -->
      <div>
        <label class="label"><i class="fa-solid fa-code mr-2"></i> Technologies</label>
        <input
          v-model="form.technologies"
          placeholder="Ex: Vue.js, AdonisJS, TailwindCSS"
          class="inputProject"
        />
      </div>

      <!-- 💰 Prix & Durée -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="label"><i class="fa-solid fa-dollar-sign mr-2"></i> Prix estimé (USD)</label>
          <input v-model="form.price" type="number" min="0" class="inputProject" />
        </div>
        <div>
          <label class="label"><i class="fa-solid fa-clock mr-2"></i> Durée de création</label>
          <input v-model="form.duration" class="inputProject" placeholder="Ex: 3 semaines" />
        </div>
      </div>

      <!-- 🖼️ Image principale -->
      <div>
        <label class="label"><i class="fa-solid fa-image mr-2"></i> Image principale</label>
        <input type="file" accept="image/*" @change="selectMainImage" class="inputProject" />
        <div v-if="mainPreview" class="mt-3 text-center">
          <img :src="mainPreview" class="w-full h-56 object-cover rounded-xl shadow" />
          <button
            type="button"
            @click="removeMainImage"
            class="text-red-600 hover:text-red-800 text-sm mt-2 flex items-center gap-1 justify-center"
          >
            <i class="fa-solid fa-trash-can"></i> Retirer
          </button>
        </div>
      </div>

      <!-- 🖼️ Galerie -->
      <div>
        <label class="label"><i class="fa-solid fa-images mr-2"></i> Galerie d’images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          @change="selectGallery"
          class="inputProject"
        />

        <div v-if="galleryPreviews.length > 0" class="mt-4 grid grid-cols-3 gap-3">
          <div
            v-for="(url, index) in galleryPreviews"
            :key="index"
            class="relative group"
          >
            <img :src="url" class="w-full h-32 object-cover rounded-lg border shadow" />
            <button
              type="button"
              @click="removeGalleryImage(index)"
              class="absolute top-1 right-1 bg-red-600 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 🔹 Liens -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="label"><i class="fa-brands fa-github mr-2"></i> Lien GitHub</label>
          <input v-model="form.githubLink" type="url" class="inputProject" />
        </div>
        <div>
          <label class="label"><i class="fa-solid fa-globe mr-2"></i> Lien Démo</label>
          <input v-model="form.demoLink" type="url" class="inputProject" />
        </div>
      </div>

      <!-- 🔹 Erreur -->
      <p v-if="error" class="text-red-600 text-center">{{ error }}</p>

      <!-- 🔹 Boutons -->
      <div class="flex justify-end gap-3">
        <NuxtLink
          to="/admin/projects"
          class="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center gap-2 transition"
        >
          <i class="fa-solid fa-arrow-left"></i> Annuler
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow flex items-center gap-2 transition"
        >
          <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-floppy-disk"></i>
          {{ loading ? "Enregistrement..." : "Enregistrer" }}
        </button>
      </div>
    </form>
  </div>
</template>