<template>
  <div class="container steps-form">
    <div class="columns">
      <AccountMenu />
      <div class="column is-8 box">
        <h3 class="title is-4">Offers</h3>
        <div v-if="pending" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
        <div v-if="!pending" class="offers-list">
          <div v-for="offer in offers" :key="offer" class="box">
            <div class="offer-info">
              <b>Description: </b> {{ offer.description }}
            </div>
            <div class="offer-info"><b>Cost: </b> {{ offer.cost }}</div>
            <div class="offer-info offer-tender-info">
              <b>Tender: </b>
              <nuxt-link
                :to="{ path: `/tenders/${offerTenderMap[offer.id].id}` }"
                >{{ offerTenderMap[offer.id].title }}</nuxt-link
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

const config = useRuntimeConfig();

await nextTick();

const store = useUserStore();
const baseURL = config.public.baseURL;
const token = store.token;
const offerTenderMap = ref({});
const query = JSON.stringify({
  where: {
    ownerId: {
      equals: store.user.id,
    },
  },
});

const { data: offers, pending } = useFetch(
  () => `${baseURL}/api/offer/findMany?q=${query}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    default: () => [],
    transform: (result) => result.data,
    onResponse({ response }) {
      response._data.data.forEach(async (offer) => {
        const lotQuery = JSON.stringify({
          where: { id: offer.lotId },
        });
        const { data: lot } = await useFetch(
          () => `${baseURL}/api/lot/findFirst?q=${lotQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            transform: (result) => result.data,
          }
        );

        const tenderQuery = JSON.stringify({
          where: { id: lot.value.tenderId },
        });
        const { data: tender } = await useFetch(
          () => `${baseURL}/api/tender/findFirst?q=${tenderQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            transform: (result) => result.data,
          }
        );
        offerTenderMap.value[offer.id] = {
          id: tender.value.id,
          title: tender.value.title,
        };
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
