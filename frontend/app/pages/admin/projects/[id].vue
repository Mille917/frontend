<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "~~/stores/user";

const { $api } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const projectId = route.params.id;

const loading = ref(true);
const error = ref<string | null>(null);
const success = ref(false);

const form = ref({
  title: "",
  description: "",
  technologies: "",
  githubLink: "",
  demoLink: "",
  imageUrl: "",
  price: "",
  duration: "",
  images: [],
});

const imageFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const newGalleryFiles = ref<File[]>([]);
const galleryPreviewUrls = ref<string[]>([]);

/* ✅ Charger les données du projet existant */
const fetchProject = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await $api.get(`/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
    form.value = {
      title: data.title,
      description: data.description,
      technologies: data.technologies || "",
      githubLink: data.githubLink || "",
      demoLink: data.demoLink || "",
      imageUrl: data.imageUrl || "",
      price: data.price || "",
      duration: data.duration || "",
      images: data.images || [],
    };
    previewUrl.value = data.imageUrl || null;
  } catch (err: any) {
    console.error("Erreur de chargement :", err);
    error.value =
      err.response?.data?.message || "Erreur de chargement du projet.";
  } finally {
    loading.value = false;
  }
};

/* ✅ Gestion image */
const selectImage = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    imageFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const removeImage = () => {
  imageFile.value = null;
  previewUrl.value = null;
  form.value.imageUrl = "";
};

/* ✅ Gestion galerie d’images */
const selectGallery = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files) {
    newGalleryFiles.value = Array.from(files);
    galleryPreviewUrls.value = newGalleryFiles.value.map((f) =>
      URL.createObjectURL(f)
    );
  }
};
const removeGalleryImage = (index: number) => {
  newGalleryFiles.value.splice(index, 1);
  galleryPreviewUrls.value.splice(index, 1);
};

/* ✅ Sauvegarde des modifications */
const updateProject = async () => {
  error.value = null;
  success.value = false;

  const formData = new FormData();

  // ✅ Ajouter seulement les champs utiles
  for (const key of [
    "title",
    "description",
    "technologies",
    "github_link",
    "demo_link",
    "price",
    "duration",
  ]) {
    formData.append(key, form.value[key] || "");
  }

  // ✅ Ajouter le fichier image si nouveau
  if (imageFile.value) {
    formData.append("image", imageFile.value);

    // Nouvelle galerie
    newGalleryFiles.value.forEach((file) => formData.append("images", file));
  }

  try {
    await $api.put(`/projects/${projectId}`, formData, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    success.value = true;
    setTimeout(() => router.push("/admin/projects"), 1500);
  } catch (err: any) {
    console.error("Erreur mise à jour :", err);
    error.value =
      err.response?.data?.message || "Erreur lors de la mise à jour du projet.";
  }
};

onMounted(fetchProject);
</script>

<template>
  <div class="max-w-3xl mx-auto py-24 px-6">
    <!-- ✅ Titre principal -->
    <div
      class="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3"
    >
      <h1
        class="text-3xl font-bold text-blue-900 flex items-center gap-2 text-center sm:text-left"
      >
        <i class="fa-solid fa-pen-to-square text-blue-700"></i>
        Modifier le projet
      </h1>

      <NuxtLink
        to="/admin/projects"
        class="text-gray-600 hover:text-blue-600 flex items-center gap-2 transition"
      >
        <i class="fa-solid fa-arrow-left"></i>
        Retour
      </NuxtLink>
    </div>

    <!-- ✅ États -->
    <div
      v-if="loading"
      class="text-center text-gray-500 flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-spinner fa-spin"></i> Chargement du projet...
    </div>

    <div
      v-if="error"
      class="text-red-600 mb-4 text-center font-medium flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-triangle-exclamation"></i>
      {{ error }}
    </div>

    <!-- ✅ Formulaire -->
    <form
      v-if="!loading && !error"
      @submit.prevent="updateProject"
      class="space-y-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div class="grid gap-4">
        <!-- Titre -->
        <div>
          <label class="label">
            <i class="fa-solid fa-heading mr-2"></i> Titre
          </label>
          <input v-model="form.title" class="input" required />
        </div>

        <!-- Description -->
        <div>
          <label class="label">
            <i class="fa-solid fa-align-left mr-2"></i> Description
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            class="input"
            required
          ></textarea>
        </div>

        <!-- Technologies -->
        <div>
          <label class="label">
            <i class="fa-solid fa-code mr-2"></i> Technologies
          </label>
          <input
            v-model="form.technologies"
            placeholder="Ex: Vue, AdonisJS, Tailwind"
            class="input"
          />
        </div>

        <!-- Liens -->
        <div class="grid md:grid-cols-2 gap-4">
          <!-- Prix -->
          <div>
            <label class="label"
              ><i class="fa-solid fa-dollar-sign mr-2"></i> Prix estimé
              (USD)</label
            >
            <input v-model="form.price" type="number" min="0" class="input" />
          </div>

          <!-- Durée -->
          <div>
            <label class="label"
              ><i class="fa-solid fa-clock mr-2"></i> Durée du projet</label
            >
            <input
              v-model="form.duration"
              class="input"
              placeholder="Ex : 3 semaines"
            />
          </div>

          <div>
            <label class="label">
              <i class="fa-brands fa-github mr-2"></i> Lien GitHub
            </label>
            <input v-model="form.githubLink" class="input" type="url" />
          </div>
          <div>
            <label class="label">
              <i class="fa-solid fa-globe mr-2"></i> Lien Démo
            </label>
            <input v-model="form.demoLink" class="input" type="url" />
          </div>
        </div>

        <!-- Image -->
        <div>
          <label class="label">
            <i class="fa-solid fa-image mr-2"></i> Image du projet
          </label>
          <div
            class="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition"
          >
            <input
              type="file"
              accept="image/*"
              @change="selectImage"
              class="hidden"
              id="imageUpload"
            />
            <label
              for="imageUpload"
              class="cursor-pointer text-blue-600 hover:underline flex items-center gap-2"
            >
              <i class="fa-solid fa-upload"></i>
              Télécharger une image
            </label>

            <div v-if="previewUrl" class="mt-4 w-full">
              <img
                :src="previewUrl"
                class="w-full h-48 object-cover rounded-lg shadow-md border animate-fade-in"
              />
              <button
                type="button"
                @click="removeImage"
                class="text-red-600 hover:text-red-800 text-sm mt-2 font-medium transition flex items-center gap-1"
              >
                <i class="fa-solid fa-trash-can"></i>
                Retirer l’image
              </button>
            </div>
          </div>
        </div>
        <!-- Galerie d’images -->
        <div>
          <label class="label">
            <i class="fa-solid fa-images mr-2"></i> Galerie d’images
          </label>
          <div
            class="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition"
          >
            <input
              type="file"
              accept="image/*"
              multiple
              @change="selectGallery"
              class="hidden"
              id="galleryUpload"
            />
            <label
              for="galleryUpload"
              class="cursor-pointer text-blue-600 hover:underline flex items-center gap-2"
            >
              <i class="fa-solid fa-upload"></i>
              Télécharger des images
            </label>

            <div
              v-if="galleryPreviewUrls.length > 0"
              class="mt-4 grid grid-cols-3 gap-3 w-full"
            >
              <div
                v-for="(url, index) in galleryPreviewUrls"
                :key="index"
                class="relative group"
              >
                <img
                  :src="url"
                  class="w-full h-32 object-cover rounded-lg border shadow animate-fade-in"
                />
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
        </div>
      </div>

      <!-- ✅ Boutons d’action -->
      <div
        class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
      >
        <button
          type="button"
          @click="router.push('/admin/projects')"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition flex items-center gap-2 justify-center"
        >
          <i class="fa-solid fa-xmark"></i> Annuler
        </button>

        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center"
        >
          <i class="fa-solid fa-floppy-disk"></i> Sauvegarder
        </button>
      </div>

      <p
        v-if="success"
        class="text-green-600 mt-4 text-center font-medium flex items-center justify-center gap-2"
      >
        <i class="fa-solid fa-circle-check"></i>
        Projet mis à jour avec succès !
      </p>
    </form>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
