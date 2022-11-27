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
    '@kevinmarrec/nuxt-pwa'
  ],
  pwa: {
    workbox: {
      enabled: true,
      templatePath: '~/scripts/sw.js',
    },
    manifest: {
      name: 'Admire Simpler',
      short_name: 'Admire Simpler',
      lang: "ru",
      theme_color: '#20262e',
      background_color: '#20262e',
      start_url: '/dashboard',
    },
  },
})
