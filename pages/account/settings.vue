<template>
  <div class="container steps-form">
    <div class="columns">
      <AccountMenu />
      <div class="column is-8 box">
        <h3 class="title is-4">{{ $t("pages.account.settings.title") }}</h3>
        <div class="account-wrapper select-role-form">
          <ESelect
            v-model="language"
            :selected="language"
            :label="$t('pages.account.settings.lanuageSelectorLabel')"
            :values="{
              en: 'English',
              fr: 'Français',
            }"
            @update:value="saveUILanguage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from "vue";
import { useI18n } from "vue-i18n";
import AccountMenu from "@/components/account/menu.vue";
import ESelect from "@/components/form/ESelect.vue";

await nextTick();

const { locale } = useI18n();
const language = ref(locale.value);

function saveUILanguage(lang) {
  locale.value = lang;
  localStorage.setItem("ui_lang", lang);
}
</script>

<style lang="scss">
.tenders-list {
  padding: 0 10px 30px 10px;

  .box {
    transition: 0.3s all;

    h4 {
      transition: 0.3s all;
    }

    &:hover {
      box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0 0 1px #e5c076;
      background: #e5c076;
      color: #fff;

      h4 {
        color: #fff;
      }
    }
  }
}
</style>
