<template>
  <div class="container steps-form">
    <div class="columns">
      <div class="column box">
        <div v-if="pending" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
        <div v-if="!pending" class="tender-info">
          <h3 class="title is-4">{{ tender.title }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from "vue";
import { useUserStore } from "@/stores/user";

const route = useRoute();
await nextTick();

const store = useUserStore();
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const token = store.token;
const tenderId = route.params.id;

const { data: tender, pending } = useFetch(
  () => `${baseURL}/api/v1/tenders/${tenderId}`,
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
.user-info {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
