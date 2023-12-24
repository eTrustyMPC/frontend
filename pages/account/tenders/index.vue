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
          <div v-for="tender in tenders" :key="tender" class="box">
            <nuxt-link :to="{ path: `/tenders/${tender.id}` }">
              <h4 class="title is-4">{{ tender.title }}</h4>
            </nuxt-link>
            <div class="tender-card-informations">
              <div class="tender-info">
                Tender сreation transaction:
                <a
                  :href="
                    'https://testnet.partisiablockchain.com/info/transaction/Shard1/' +
                    tender.syncTxId
                  "
                  target="_blank"
                  >{{ subHash(tender.syncTxId) }}</a
                >
              </div>
              <div class="tender-info">
                Bid before: {{ moment(tender.finishAt).format("YYYY-MM-DD") }}
              </div>
            </div>
            <div class="tender-card-metadata">
              <div class="tender-card-metadata-wrapper">
                <div :class="['status', tender.status.toLowerCase()]">
                  {{ tender.status }}
                </div>
                <div v-if="getExpiredDaysText(tender)" class="expired-days">
                  {{ getExpiredDaysText(tender) }}
                </div>
              </div>
              <div class="tender-card-metadata-button">
                <nuxt-link
                  class="button"
                  :to="{ path: `/tenders/${tender.id}` }"
                >
                  View
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from "vue";
import moment from "moment";
import AccountMenu from "@/components/account/menu.vue";
import { useUserStore } from "@/stores/user";
import { subHash, getExpiredDaysText } from "@/utils/common";

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
  padding: 0;
}
</style>
