import { createI18n } from "vue-i18n";
import en from "../locales/en";
import fr from "../locales/fr";

export default defineNuxtPlugin(({ vueApp }) => {
  let lang = "en";
  if (process.client) {
    lang = localStorage.getItem("ui_lang") || "en";
  }
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: lang,
    messages: { en, fr },
  });

  vueApp.use(i18n);
});
