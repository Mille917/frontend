<script setup lang="ts">
import { ref } from "vue";
const config = useRuntimeConfig();

const name = ref("");
const email = ref("");
const message = ref("");
const loading = ref(false);
const success = ref(false);

const submit = async () => {
  loading.value = true;
  success.value = false;

  try {
    await $fetch(`${config.public.apiBase}/public/contact`, {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        message: message.value,
      },
    });

    success.value = true;
    name.value = "";
    email.value = "";
    message.value = "";
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto py-20 px-6">
    <h1 class="text-3xl font-bold text-center text-blue-800 mb-12">
      Me Contacter <i class="fas fa-envelope"></i>
    </h1>

    <div class="grid md:grid-cols-2 gap-10">
      <!-- ✅ Form -->
      <form
        @submit.prevent="submit"
        class="bg-white shadow-xl rounded-xl p-8 border"
      >
        <div class="mb-4">
          <label class="text-gray-700 font-medium">Nom complet</label>
          <input
            v-model="name"
            type="text"
            class="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Votre nom"
            required
          />
        </div>

        <div class="mb-4">
          <label class="text-gray-700 font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="email@gmail.com"
            required
          />
        </div>
      
        <div class="mb-4">
          <label class="text-gray-700 font-medium">Message</label>
          <textarea
            v-model="message"
            rows="5"
            class="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Écrivez votre message..."
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-800 transition disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? "Envoi en cours..." : "Envoyer le message" }}
        </button>

        <p v-if="success" class="text-green-600 text-center mt-4 font-semibold">
          ✅ Merci ! Votre message a bien été envoyé.
        </p>
      </form>

      <!-- ✅ Contact Details -->
      <div
        class="flex flex-col justify-center bg-indigo-50 rounded-xl p-8 space-y-6 border border-indigo-200"
      >
        <h2 class="text-xl font-semibold text-indigo-700">Informations</h2>
        <p class="text-gray-700">
          📍 Kinshasa, République Démocratique du Congo
        </p>
        <div class="icon-button space-y-4">
          <!--social media email-->
          <div class="button">
            <div class="s-icon gap-2 flex items-center">
              <div
                class="s-icon bg-gradient-to-b from-red-800 to-red-400 p-2 rounded-full flex items-center justify-center"
              >
                <i
                  class="fas fa-envelope text-transparent bg-amber-50 bg-clip-text"
                ></i>
              </div>
              <a
                href="mailto:bombokoraissa@gmail.com"
                class="email-text text-black hover:text-transparent bg-clip-text bg-gradient-to-b from-red-800 to-yellow-400 transition-colors duration-300"
              >
                bombokoraissa@gmail.com
              </a>
            </div>
          </div>

          <!--social media whatsapp-->
          <div class="button">
            <div class="s-icon flex items-center">
              <div
                class="s-icon bg-green-500 p-2 rounded-full flex items-center justify-center"
              >
                <i class="fab fa-whatsapp text-white"></i>
              </div>
              <a
                href="https://wa.me/243859214152"
                target="_blank"
                class="text-black hover:text-transparent bg-clip-text bg-gradient-to-b from-green-600 to-green-800  transition-colors duration-300 ml-3 font-sm"
              >
                +243 859 214 152
              </a>
            </div>
          </div>

          <!--social media linkedin-->
          <div class="button">
            <div class="s-icon flex items-center">
              <div
                class="s-icon bg-blue-700 p-2 rounded-full flex items-center justify-center"
              >
                <i class="fab fa-linkedin-in text-amber-50"></i>
              </div>
              <a
                href="https://www.linkedin.com/in/raissa-bofanga/"
                target="_blank"
                class="text-black hover:text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-800  to-blue-600 transition-colors duration-300 ml-3 font-sm"
              >
                RaissaBofanga
              </a>
            </div>
          </div>

          <!--social media github-->
          <div class="button">
            <div class="s-icon flex items-center">
              <div
                class="s-icon bg-black p-2 rounded-full flex items-center justify-center"
              >
                <i class="fab fa-github text-amber-50"></i>
              </div>

              <a
                href="https://github.com/Mille917"
                target="_blank"
                class="text-black hover:text-transparent bg-clip-text bg-gradient-to-b from-gray-600 to-gray-800 transition-colors duration-300 ml-3 font-sm"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <p class="text-indigo-700 font-medium">

         <i class="fas fa-star"></i>
           Disponible pour collaborations & missions freelance
        </p>
      </div>
    </div>
  </div>
</template>
