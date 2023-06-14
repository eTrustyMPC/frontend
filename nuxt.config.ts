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
    },
  },
});
