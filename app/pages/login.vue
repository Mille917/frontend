<script setup lang="ts">
import { ref } from "vue"
import { useUserStore } from "~/stores/userStore"
import { useRouter } from "vue-router"

const user = useUserStore()
const router = useRouter()

const email = ref("")
const password = ref("")

const submit = async () => {
  await user.login(email.value, password.value)

  if (user.token) {
    router.push("/admin") // ✅ redirection après succès
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">Connexion</h1>

      <input
        v-model="email"
        placeholder="Email"
        type="email"
        class="border rounded-md p-2 w-full mb-3"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Mot de passe"
        class="border rounded-md p-2 w-full mb-3"
      />

      <button
        @click="submit"
        :disabled="user.loading"
        class="bg-blue-600 disabled:opacity-50 text-white px-4 py-2 w-full rounded-md hover:bg-blue-700 transition"
      >
        {{ user.loading ? "Connexion..." : "Se connecter" }}
      </button>

      <!-- ✅ Message d’erreur -->
      <p v-if="user.error" class="text-red-500 text-center mt-3">
        {{ user.error }}
      </p>
    </div>
  </div>
</template>
