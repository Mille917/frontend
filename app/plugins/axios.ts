import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = axios.create({
    baseURL: config.public.apiBase, // base URL configurable
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Si tu veux injecter automatiquement le token depuis Pinia :
  api.interceptors.request.use((request) => {
    const userStore = useUserStore()
    if (userStore.token) {
      request.headers.Authorization = `Bearer ${userStore.token}`
    }
    return request
  })

  return {
    provide: {
      api,
    },
  }
})
