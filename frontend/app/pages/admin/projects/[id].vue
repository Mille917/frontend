<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "~~/stores/user";

const { t } = useI18n();
const { $api } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const projectId = route.params.id;

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

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
  } catch (err: unknown) {
    console.error("Erreur de chargement :", err);
    error.value =
      getErrorMessage(err) || t("admin.error_loading_project");
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
      URL.createObjectURL(f),
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

  // ✅ Ajouter les champs textes
  formData.append("title", form.value.title);
  formData.append("description", form.value.description);
  formData.append("technologies", form.value.technologies);
  formData.append("github_link", form.value.githubLink || "");
  formData.append("demo_link", form.value.demoLink || "");
  formData.append("price", form.value.price ? String(form.value.price) : "");
  formData.append("duration", form.value.duration || "");

  // ✅ Envoyer les URLs des images déjà présentes pour ne pas les perdre
  if (form.value.images && form.value.images.length > 0) {
    form.value.images.forEach((url) => {
      formData.append("existing_images", url);
    });
  }

  // ✅ Ajouter le fichier image principale si nouveau
  if (imageFile.value) {
    formData.append("image", imageFile.value);
  }

  // ✅ Ajouter les nouvelles images de la galerie si présentes
  if (newGalleryFiles.value.length > 0) {
    newGalleryFiles.value.forEach((file) => {
      formData.append("images", file);
    });
  }

  try {
    // Note: Le token est ajouté automatiquement par l'intercepteur dans plugins/api.ts
    await $api.put(`/projects/${projectId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    success.value = true;
    setTimeout(() => router.push("/admin/projects"), 1500);
  } catch (err: unknown) {
    console.error("Erreur mise à jour :", err);
    error.value =
      getErrorMessage(err) || t("admin.error_update_project");
  }
};

onMounted(fetchProject);
</script>

<template>
  <div class="max-w-4xl mx-auto py-24 px-4 sm:px-6">
    <!-- ✅ Titre principal -->
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3"
    >
      <h1
        class="text-3xl sm:text-4xl font-bold text-blue-900 flex items-center gap-2 text-center sm:text-left"
      >
        <i class="fa-solid fa-pen-to-square text-blue-700" ></i>
        {{ t("admin.edit_project") }}
      </h1>

      <NuxtLink
        to="/admin/projects"
        class="text-gray-600 hover:text-blue-600 flex w-full sm:w-auto items-center justify-center sm:justify-start gap-2 transition text-sm sm:text-base"
      >
        <i class="fa-solid fa-arrow-left" ></i>
        {{ t("admin.back_to_projects") }}
      </NuxtLink>
    </div>

    <!-- ✅ États -->
    <div
      v-if="loading"
      class="text-center text-gray-500 flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-spinner fa-spin" ></i> 
      {{ t("admin.loading_project") }}
    </div>

    <div
      v-if="error"
      class="text-red-600 mb-4 text-center font-medium flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-triangle-exclamation" ></i>
      {{ error }}
    </div>

    <!-- ✅ Formulaire -->
    <form
      v-if="!loading && !error"
      class="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      @submit.prevent="updateProject"
    >
      <div class="grid gap-4">
        <!-- Titre -->
        <div>
          <label class="label" for="titleInput">
            <i class="fa-solid fa-heading mr-2" ></i>
            {{ t("admin.title_label") }}
          </label>
          <input id="titleInput" v-model="form.title" class="input" required />
        </div>

        <!-- Description -->
        <div>
          <label class="label" for="descriptionInput">
            <i class="fa-solid fa-align-left mr-2" ></i>
            {{ t("admin.description_label") }}
          </label>
          <RichTextarea id="descriptionInput" v-model="form.description" />
        </div>

        <!-- Technologies -->
        <div>
          <label class="label" for="technologiesInput">
            <i class="fa-solid fa-code mr-2" ></i>
            {{ t("admin.technologies_label") }}
          </label>
          <input
            id="technologiesInput"
            v-model="form.technologies"
            :placeholder="t('admin.technologies_placeholder')"
            class="input"
          />
        </div>

        <!-- Liens -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Prix -->
          <div>
            <label class="label" for="priceInput"
              ><i class="fa-solid fa-dollar-sign mr-2" ></i>
              {{ t("admin.price_label") }} (USD)</label
            >
            <input
              id="priceInput"
              v-model="form.price"
              type="number"
              min="0"
              class="input"
            />
          </div>

          <!-- Durée -->
          <div>
            <label class="label" for="durationInput"
              ><i class="fa-solid fa-clock mr-2" ></i>
              {{ t("admin.duration_label") }}</label
            >
            <input
              id="durationInput"
              v-model="form.duration"
              class="input"
              :placeholder="t('admin.duration_placeholder')"
            />
          </div>

          <div>
            <label class="label" for="githubLinkInput">
              <i class="fa-brands fa-github mr-2" ></i>
              {{ t("admin.github_label") }}
            </label>
            <input
              id="githubLinkInput"
              v-model="form.githubLink"
              class="input"
              type="url"
            />
          </div>
          <div>
            <label class="label" for="demoLinkInput">
              <i class="fa-solid fa-globe mr-2" ></i>
              {{ t("admin.demo_label") }}
            </label>
            <input
              id="demoLinkInput"
              v-model="form.demoLink"
              class="input"
              type="url"
            />
          </div>
        </div>

        <!-- Image -->
        <div>
          <div class="label">
            <i class="fa-solid fa-image mr-2" ></i>
            {{ t("admin.image_label") }}
          </div>
          <div
            class="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition"
          >
            <input
              id="imageUpload"
              class="hidden"
              type="file"
              accept="image/*"
              @change="selectImage"
            />
            <label
              for="imageUpload"
              class="cursor-pointer text-blue-600 hover:underline flex items-center gap-2"
            >
              <i class="fa-solid fa-upload" ></i>
              {{ t("admin.upload_image") }}
            </label>

            <div v-if="previewUrl" class="mt-4 w-full">
              <img
                :src="previewUrl"
                :alt="form.title || t('admin.project_image_alt')"
                class="w-full h-48 object-cover rounded-lg shadow-md border animate-fade-in"
              />
              <button
                class="text-red-600 hover:text-red-800 text-sm mt-2 font-medium transition flex items-center gap-1 w-full sm:w-auto justify-center"
                type="button"
                @click="removeImage"
              >
                <i class="fa-solid fa-trash-can"></i>
                {{ t("admin.remove_image") }}
              </button>
            </div>
          </div>
        </div>
        <!-- Galerie d’images -->
        <div>
          <div class="label">
            <i class="fa-solid fa-images mr-2" ></i>
            {{ t("admin.gallery_label") }}
          </div>
          <div
            class="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition"
          >
            <input
              id="galleryUpload"
              class="hidden"
              type="file"
              accept="image/*"
              multiple
              @change="selectGallery"
            />
            <label
              for="galleryUpload"
              class="cursor-pointer text-blue-600 hover:underline flex items-center gap-2"
            >
              <i class="fa-solid fa-upload" ></i>
              {{ t("admin.upload_gallery") }}
            </label>

            <div
              v-if="galleryPreviewUrls.length > 0"
              class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full"
            >
              <div
                v-for="(url, index) in galleryPreviewUrls"
                :key="index"
                class="relative group"
              >
                <img
                  class="w-full h-32 object-cover rounded-lg border shadow animate-fade-in"
                  :src="url"
                  :alt="t('admin.gallery_image_alt', { number: index + 1 })"
                />

                <button
                  class="absolute top-1 right-1 bg-red-600 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition"
                  type="button"
                  @click="removeGalleryImage(index)"
                >
                  <i class="fa-solid fa-xmark"></i>
                   {{ t("admin.remove") }}
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
          class="w-full sm:w-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition flex items-center gap-2 justify-center"
          type="button"
          @click="router.push('/admin/projects')"
        >
          <i class="fa-solid fa-xmark" /> {{ t("admin.cancel") }}
        </button>

        <button
          type="submit"
          class="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center"
        >
          <i class="fa-solid fa-floppy-disk" /> {{ t("admin.save") }}
        </button>
      </div>

      <p
        v-if="success"
        class="text-green-600 mt-4 text-center font-medium flex flex-col sm:flex-row items-center justify-center gap-2"
      >
        <i class="fa-solid fa-circle-check" ></i>
        {{ t("admin.project_updated") }}
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
