<template>
  <div class="container steps-form">
    <div class="columns">
      <AccountMenu />
      <div class="column is-8 box">
        <h3 class="title is-4">{{ $t("pages.account.offers.title") }}</h3>
        <div v-if="pending" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
        <div v-if="!pending" class="offers-list">
          <div v-for="offer in offers" :key="offer" class="box">
            <div class="offer-info">
              <b>{{ $t("pages.account.offers.offerDescriptionLabel") }}: </b>
              {{ offer.description }}
            </div>
            <div class="offer-info">
              <b>{{ $t("pages.account.offers.offerAmountLabel") }}: </b>
              {{ offer.cost }}
            </div>
            <div class="offer-info offer-tender-info">
              <b>{{ $t("pages.account.offers.tenderTitleLable") }}: </b>
              <nuxt-link
                :to="{ path: `/tenders/${getTenderByOffer(offer).id}` }"
                >{{ getTenderByOffer(offer).title }}</nuxt-link
              >
            </div>
            <div class="offer-info offer-tender-info">
              <b>Bid transaction: </b>
              <a
                :href="
                  'https://testnet.partisiablockchain.com/info/transaction/Shard1/' +
                  offer.syncTxId
                "
                target="_blank"
                >{{ subHash(offer.syncTxId) }}</a
              >
            </div>
            <a
              href="#"
              class="button delete-button"
              @click="deleteOffer(offer.id)"
            >
              <span class="icon">
                <i class="fa fa-trash"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from "vue";
import AccountMenu from "@/components/account/menu.vue";
import { useUserStore } from "@/stores/user";
import { subHash } from "@/utils/common";

const config = useRuntimeConfig();

await nextTick();

const store = useUserStore();
const baseURL = config.public.baseURL;
const token = store.token;
const lotTenderMap = ref({});
const tendersMap = ref({});
const query = JSON.stringify({
  where: {
    ownerId: {
      equals: store.user.id,
    },
  },
});

function getTenderByOffer(offer) {
  return tendersMap.value[lotTenderMap.value[offer.lotId]];
}

const { data: offers, pending } = useFetch(
  () => `${baseURL}/api/offer/findMany?q=${query}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    default: () => [],
    transform: (result) => result.data,
    async onResponse({ response }) {
      const lotQuery = JSON.stringify({
        where: { id: { in: response._data.data.map((o) => o.lotId) } },
      });
      const { data: lots } = await useFetch(
        () => `${baseURL}/api/lot/findMany?q=${lotQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          transform: (result) => result.data,
        }
      );
      lots.value.forEach((lot) => {
        lotTenderMap.value[lot.id] = lot.tenderId;
      });
      const tenderQuery = JSON.stringify({
        where: { id: { in: lots.value.map((l) => l.tenderId) } },
      });
      const { data: tenders } = await useFetch(
        () => `${baseURL}/api/tender/findMany?q=${tenderQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          transform: (result) => result.data,
        }
      );
      tenders.value.forEach((tender) => {
        tendersMap.value[tender.id] = tender;
      });
    },
  }
);

async function deleteOffer(offerId) {
  const offerDeleteQuery = JSON.stringify({
    where: { id: offerId },
  });
  await useFetch(() => `${baseURL}/api/offer/delete?q=${offerDeleteQuery}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  offers.value = offers.value.filter((o) => o.id !== offerId);
}
</script>

<style lang="scss">
.offer-tender-info {
  a {
    color: #e5c076;
  }
}

.offers-list {
  .box {
    position: relative;

    .delete-button {
      position: absolute;
      right: 15px;
      top: 15px;

      &:hover {
        background: #273038;
        color: #fff;
        transition: all 0.3s;
      }
    }
  }
}
</style>
