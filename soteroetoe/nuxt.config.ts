// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modulesDir: ["../node_modules"], // This is not working for some reason
  modules: ["@vueuse/nuxt", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
});
