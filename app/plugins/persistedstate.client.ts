import { defineNuxtPlugin } from 'nuxt/app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'


export default defineNuxtPlugin(() => {
 const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
})
