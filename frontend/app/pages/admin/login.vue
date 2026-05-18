<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~~/stores/user'
import { useNuxtApp } from 'nuxt/app'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const fullName = ref('Admin Raïssa')
const loading = ref(false)
const errorMessage = ref<string | null>(null)
const status = ref('')

const isRegister = ref(false)
const clicks = ref(0)

const secretTrigger = () => {
  clicks.value++
  if (clicks.value >= 3) {
    isRegister.value = !isRegister.value
    clicks.value = 0
    errorMessage.value = null
    status.value = ""
  }
}

const submitLogin = async () => {
  loading.value = true
  errorMessage.value = null
  status.value = ""

  try {
    if (isRegister.value) {
      const { $api } = useNuxtApp()
      await $api.post('/auth/register', {
        fullName: fullName.value,
        email: email.value,
        password: password.value,
      })
      status.value = "Compte créé avec succès ! Vous pouvez maintenant vous connecter."
      isRegister.value = false // Repasse en mode connexion
    } else {
      await userStore.login(email.value, password.value)
      router.push('/admin/dashboard')
    }
  } catch (error: unknown) {
    if (isRegister.value) {
      const err = error as any
      status.value = "Erreur : " + (err.response?.data?.message || err.message)
    } else {
      errorMessage.value = error instanceof Error ? error.message : userStore.error || "Échec de connexion"
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-700 px-4">

    <div class="w-full max-w-md backdrop-blur-xl bg-white/10 dark:bg-black/20 p-8 rounded-2xl shadow-xl border border-white/10
                animate-[fadeIn_0.8s_ease-out]">

      <!-- Titre avec mode secret (3 clics) -->
      <h1 
        @click="secretTrigger" 
        class="text-3xl font-bold text-center text-white mb-8 cursor-pointer select-none"
      >
        {{ isRegister ? "Inscription Admin 🔐" : "Administration 🔐" }}
      </h1>

      <form @submit.prevent="submitLogin" class="space-y-5">
        
        <!-- Nom complet (uniquement si Register) -->
        <div v-if="isRegister">
          <label class="text-white/90 text-sm">Nom complet</label>
          <div class="relative mt-1">
            <input type="text" v-model="fullName" required placeholder="Ex: Raïssa Bomboko"
              class="w-full px-12 py-3 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/50 focus:ring-2 focus:ring-blue-300 outline-none transition" />
            <span class="absolute left-4 top-3 text-white/70">👤</span>
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="text-white/90 text-sm">Email</label>
          <div class="relative mt-1">
            <input type="email" v-model="email" required placeholder="admin@example.com"
              class="w-full px-12 py-3 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/50 focus:ring-2 focus:ring-blue-300 outline-none transition" />
            <span class="absolute left-4 top-3 text-white/70">📧</span>
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="text-white/90 text-sm">Mot de passe</label>
          <div class="relative mt-1">
            <input type="password" v-model="password" required placeholder="••••••••"
              class="w-full px-12 py-3 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/50 focus:ring-2 focus:ring-blue-300 outline-none transition" />
            <span class="absolute left-4 top-3 text-white/70">🔑</span>
          </div>
        </div>

        <!-- Error (Login) -->
        <p v-if="errorMessage && !isRegister" class="text-red-300 text-center text-sm">{{ errorMessage }}</p>

        <!-- Status / Error (Register) -->
        <p v-if="status" class="text-center text-sm" :class="{'text-green-300': status.includes('succès'), 'text-red-300': status.includes('Erreur')}">
          {{ status }}
        </p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-400 to-blue-300 text-indigo-900 font-bold shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1 disabled:opacity-60">
          <span v-if="!loading">
            {{ isRegister ? "Créer le compte 🚀" : "Se connecter 🚀" }}
          </span>
          <span v-else class="animate-pulse">Traitement...</span>
        </button>

      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
