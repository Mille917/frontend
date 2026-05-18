<script setup lang="ts">
import { ref } from 'vue'
import { useNuxtApp } from 'nuxt/app'

const fullName = ref('Admin Raïssa')
const email = ref('admin@portfolio.com')
const password = ref('TonMotDePasseSecurise')
const status = ref('')

const register = async () => {
  status.value = 'Création du compte...'
  try {
    const { $api } = useNuxtApp()
    await $api.post('/auth/register', {
      fullName: fullName.value,
      email: email.value,
      password: password.value,
    })
    status.value = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.'
  } catch (err: any) {
    status.value = 'Erreur : ' + (err.response?.data?.message || err.message)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">Créer le compte Admin</h1>
      
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Nom complet</label>
        <input v-model="fullName" class="border rounded-md p-2 w-full" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Email</label>
        <input v-model="email" type="email" class="border rounded-md p-2 w-full" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Mot de passe</label>
        <input v-model="password" type="password" class="border rounded-md p-2 w-full" />
      </div>

      <button
        @click="register"
        class="bg-green-600 text-white px-4 py-2 w-full rounded-md hover:bg-green-700 transition"
      >
        Créer le compte
      </button>

      <p v-if="status" class="mt-4 text-center text-sm" :class="{'text-green-600': status.includes('succès'), 'text-red-600': status.includes('Erreur')}">
        {{ status }}
      </p>
    </div>
  </div>
</template>
