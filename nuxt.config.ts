export default defineNuxtConfig({
  css: [{ src: "~/assets/scss/main.scss", lang: "scss" }],
  typescript: {
    typeCheck: {
      eslint: {
        files: "./**/*.{ts,js,vue}",
      },
    },
  },
});
