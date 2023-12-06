<template>
  <div class="container steps-form">
    <div class="columns">
      <AccountMenu />
      <div class="column is-8 box">
        <h3 class="title is-4">
          {{ $t("pages.account.tenders.index.title") }}
        </h3>
        <div v-if="pending" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
        <div v-if="!pending" class="tenders-list">
          <nuxt-link
            v-for="tender in tenders"
            :key="tender"
            class="box"
            :to="{ path: `/tenders/${tender.id}` }"
          >
            <h4 class="title is-4">{{ tender.title }}</h4>
            <b
              >{{ $t("pages.account.tenders.index.organizationLabel") }}:
              {{ tender.organizationId }}</b
            >
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from "vue";
import AccountMenu from "@/components/account/menu.vue";
import { useUserStore } from "@/stores/user";

const config = useRuntimeConfig();

await nextTick();

const store = useUserStore();
const baseURL = config.public.baseURL;
const token = store.token;
const query = JSON.stringify({
  where: {
    ownerId: {
      equals: store.user.id,
    },
  },
});

const { data: tenders, pending } = useFetch(
  () => `${baseURL}/api/tender/findMany?q=${query}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    default: () => [],
    transform: (result) => result.data,
  }
);
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
