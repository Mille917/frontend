<script setup lang="ts">
import { ref } from "vue"
import { useUserStore } from "~~/stores/user"
import { useRouter } from "vue-router"
import { useNuxtApp } from "nuxt/app"

const user = useUserStore()
const router = useRouter()

const email = ref("")
const password = ref("")
const fullName = ref("Admin Raïssa")

const isRegister = ref(false)
const clicks = ref(0)
const status = ref("")

const secretTrigger = () => {
  clicks.value++
  if (clicks.value >= 3) {
    isRegister.value = !isRegister.value
    clicks.value = 0
    status.value = ""
  }
}

const submit = async () => {
  status.value = ""
  if (isRegister.value) {
    try {
      const { $api } = useNuxtApp()
      await $api.post('/auth/register', {
        fullName: fullName.value,
        email: email.value,
        password: password.value,
      })
      status.value = "Compte créé avec succès ! Vous pouvez maintenant vous connecter."
      isRegister.value = false // Repasse en mode connexion
    } catch (err: any) {
      status.value = "Erreur : " + (err.response?.data?.message || err.message)
    }
  } else {
    try {
      await user.login(email.value, password.value)
      if (user.token) {
        router.push("/admin")
      }
    } catch (err: any) {
      // L'erreur est gérée par le store et affichée via user.error
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 transition-colors duration-300">
    <div class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-md transform transition-all">
      
      <!-- Titre avec mode secret -->
      <h1 
        @click="secretTrigger" 
        class="text-3xl font-extrabold text-center mb-2 cursor-pointer select-none text-gray-900 dark:text-white"
      >
        {{ isRegister ? "Créer un compte" : "Connexion" }}
      </h1>
      
      <p class="text-sm text-center text-gray-500 dark:text-gray-400 mb-8">
        {{ isRegister ? "Inscrivez-vous pour accéder à l'administration" : "Connectez-vous pour gérer votre portfolio" }}
      </p>

      <!-- Formulaire -->
      <div class="space-y-4">
        
        <!-- Champ Nom (uniquement si Register) -->
        <div v-if="isRegister" class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom complet</label>
          <input
            v-model="fullName"
            placeholder="Ex: Raïssa Bomboko"
            class="border border-gray-300 dark:border-gray-700 rounded-lg p-3 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <!-- Champ Email -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Adresse Email</label>
          <input
            v-model="email"
            placeholder="admin@portfolio.com"
            type="email"
            class="border border-gray-300 dark:border-gray-700 rounded-lg p-3 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <!-- Champ Mot de passe -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="border border-gray-300 dark:border-gray-700 rounded-lg p-3 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <!-- Bouton -->
        <button
          @click="submit"
          :disabled="user.loading"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold p-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <span v-if="user.loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Chargement...
          </span>
          <span v-else>
            {{ isRegister ? "Créer le compte" : "Se connecter" }}
          </span>
        </button>

      </div>

      <!-- Messages de retour -->
      <div class="mt-6 text-center">
        <!-- Message d’erreur du store (Login) -->
        <p v-if="user.error && !isRegister" class="text-red-500 text-sm font-medium">
          {{ user.error }}
        </p>

        <!-- Message de statut (Register) -->
        <p v-if="status" class="text-sm font-medium" :class="{'text-green-600 dark:text-green-400': status.includes('succès'), 'text-red-600 dark:text-red-400': status.includes('Erreur')}">
          {{ status }}
        </p>
      </div>

      <!-- Petit texte discret -->
      <p class="text-xs text-gray-400 dark:text-gray-600 text-center mt-6">
        Zone réservée à l'administrateur.
      </p>
    </div>
  </div>
</template>
