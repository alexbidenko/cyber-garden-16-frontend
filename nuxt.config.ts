// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    'primevue/resources/themes/bootstrap4-dark-blue/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    'primeflex/primeflex.css',
  ],
  build: {transpile: ['primevue']},
  modules: [
    '@pinia/nuxt',
    '@nuxt/image-edge',
  ],
})
