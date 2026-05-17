<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const { $api } = useNuxtApp();
const router = useRouter();

/* 🧾 Formulaire */
const form = ref<{
  title: string;
  description: string;
  technologies: string;
  github_link: string;
  demo_link: string;
  price: string;
  duration: string;
}>({
  title: "",
  description: "",
  technologies: "",
  github_link: "",
  demo_link: "",
  price: "",
  duration: "",
});

/* 🖼️ Fichiers */
const mainImage = ref<File | null>(null);
const mainPreview = ref<string | null>(null);
const galleryFiles = ref<File[]>([]);
const galleryPreviews = ref<string[]>([]);

const loading = ref(false);
const error = ref<string | null>(null);

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
    const apiError = err as ApiErrorResponse;
    const message = apiError.response?.data?.message;
    return typeof message === "string" ? message : undefined;
  }

  return undefined;
};

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
  mainPreview.value = null;
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
    formData.append(key, String(val)),
  );

  if (mainImage.value) formData.append("image", mainImage.value);
  galleryFiles.value.forEach((file) => formData.append("images", file));

  try {
    // Le token est géré par l'intercepteur dans plugins/api.ts
    // Note: Ne pas forcer Content-Type, laisser axios gérer multipart/form-data
    await $api.post("/projects", formData);
    router.push("/admin/projects");
  } catch (err: unknown) {
    console.error("Erreur création projet :", err);
    error.value = getErrorMessage(err) || t("admin.error_save_project");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto py-24 px-4 sm:px-6">
    <h1
      class="text-3xl sm:text-4xl font-bold text-blue-900 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
    >
      <span class="flex items-center gap-3">
        <i class="fa-solid fa-folder-plus text-blue-700"></i>
        {{ t("admin.new_project") }}
      </span>
    </h1>

    <form
      @submit.prevent="saveProject"
      class="bg-white p-6 sm:p-8 rounded-2xl shadow border border-gray-200 space-y-6"
    >
      <!-- 🔹 Titre -->
      <div>
        <label class="label" for="titleInput"
          ><i class="fa-solid fa-heading mr-2"></i>
          {{ t("admin.title_label") }}</label
        >
        <input
          id="titleInput"
          v-model="form.title"
          class="inputProject"
          required
        />
      </div>

      <!-- 🔹 Description -->
      <div>
        <label class="label" for="descriptionInput"
          ><i class="fa-solid fa-align-left mr-2"></i>
          {{ t("admin.description_label") }}</label
        >
        <textarea
          id="descriptionInput"
          v-model="form.description"
          rows="4"
          class="inputProject"
          :placeholder="t('admin.description_placeholder')"
          required
        ></textarea>
      </div>

      <!-- 🔹 Technologies -->
      <div>
        <label class="label" for="technologiesInput"
          ><i class="fa-solid fa-code mr-2"></i>
          {{ t("admin.technologies_label") }}</label
        >
        <input
          id="technologiesInput"
          v-model="form.technologies"
          :placeholder="t('admin.technologies_placeholder')"
          class="inputProject"
        />
      </div>

      <!-- 💰 Prix & Durée -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="label" for="priceInput"
            ><i class="fa-solid fa-dollar-sign mr-2"></i>
            {{ t("admin.price_label") }} (USD)</label
          >
          <input
            id="priceInput"
            v-model="form.price"
            type="number"
            min="0"
            class="inputProject"
          />
        </div>
        <div>
          <label class="label" for="durationInput"
            ><i class="fa-solid fa-clock mr-2"></i>
            {{ t("admin.duration_label") }}</label
          >
          <input
            id="durationInput"
            v-model="form.duration"
            class="inputProject"
            :placeholder="t('admin.duration_placeholder')"
          />
        </div>
      </div>

      <!-- 🖼️ Image principale -->
      <div>
        <label class="label" for="mainImageInput"
          ><i class="fa-solid fa-image mr-2"></i>
          {{ t("admin.image_label") }}</label
        >
        <input
          id="mainImageInput"
          type="file"
          accept="image/*"
          @change="selectMainImage"
          class="inputProject"
        />
        <div v-if="mainPreview" class="mt-3 text-center">
          <img
            :src="mainPreview"
            :alt="t('admin.project_image_alt')"
            class="w-full h-56 object-cover rounded-xl shadow"
          />
          <button
            class="text-red-600 hover:text-red-800 text-sm mt-2 flex items-center gap-1 justify-center w-full sm:w-auto"
            type="button"
            @click="removeMainImage"
          >
            <i class="fa-solid fa-trash-can"></i> {{ t("admin.remove_image") }}
          </button>
        </div>
      </div>

      <!-- 🖼️ Galerie -->
      <div>
        <label class="label" for="galleryInput"
          ><i class="fa-solid fa-images mr-2"></i>
          {{ t("admin.gallery_label") }}</label
        >
        <input
          id="galleryInput"
          type="file"
          accept="image/*"
          multiple
          @change="selectGallery"
          class="inputProject"
        />

        <div
          v-if="galleryPreviews.length > 0"
          class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          <div
            v-for="(url, index) in galleryPreviews"
            :key="index"
            class="relative group"
          >
            <img
              :src="url"
              :alt="t('admin.gallery_image_alt', { number: index + 1 })"
              class="w-full h-32 object-cover rounded-lg border shadow"
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

      <!-- 🔹 Liens -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="label" for="githubLinkInput"
            ><i class="fa-brands fa-github mr-2"></i>
            {{ t("admin.github_label") }}</label
          >
          <input
            id="githubLinkInput"
            v-model="form.github_link"
            type="url"
            class="inputProject"
          />
        </div>
        <div>
          <label class="label" for="demoLinkInput"
            ><i class="fa-solid fa-globe mr-2"></i>
            {{ t("admin.demo_label") }}</label
          >
          <input
            id="demoLinkInput"
            v-model="form.demo_link"
            type="url"
            class="inputProject"
          />
        </div>
      </div>

      <!-- 🔹 Erreur -->
      <p v-if="error" class="text-red-600 text-center">{{ error }}</p>

      <!-- 🔹 Boutons -->
      <div class="flex flex-col sm:flex-row justify-end gap-3">
        <NuxtLink
          to="/admin/projects"
          class="w-full sm:w-auto px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center gap-2 transition text-sm sm:text-base"
        >
          <i class="fa-solid fa-arrow-left"></i> {{ t("admin.cancel") }}
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading"
          class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow flex items-center justify-center gap-2 transition text-sm sm:text-base"
        >
          <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-floppy-disk"></i>
          {{ loading ? t("admin.saving") : t("admin.save") }}
        </button>
      </div>
    </form>
  </div>
</template>
