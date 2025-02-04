export default defineNuxtConfig({
  css: [{ src: "~/assets/scss/main.scss", lang: "scss" }],
  typescript: {
    typeCheck: {
      eslint: {
        files: "./**/*.{ts,js,vue}",
      },
    },
  },
  app: {
    head: {
      script: [
        {
          hid: "stripe",
          src: "https://kit.fontawesome.com/844c5cd16d.js",
          async: true,
          crossorigin: "anonymous",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/etrusty_flavicon_whi.ico",
        },
      ],
    },
  },
  router: { middleware: ["auth"] },
  modules: ["@pinia/nuxt", "@nuxtjs/supabase"],
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || "http://localhost:5000",
    },
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  supabase: {
    redirectOptions: {
      login: "/signin",
      callback: "/confirm",
      exclude: ["/signup"],
    },
  },
});
