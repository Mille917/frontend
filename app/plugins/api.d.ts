declare module '#app' {
  interface NuxtApp {
    $api: import('axios').AxiosInstance
  }
}
