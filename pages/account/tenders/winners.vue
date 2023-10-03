<template>
  <div class="container steps-form">
    <div class="columns">
      <AccountMenu />
      <div class="column is-8 box">
        <h3 class="title is-4">Winners</h3>
        <div v-if="pending" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
        <div v-if="!pending" class="offers-list">
          <div
            v-for="lot in lots"
            :key="lot"
            :set="(winner = getWinnerByLot(lot))"
            class="box"
          >
            <div class="columns">
              <div class="column is-4">
                <div class="offer-info">
                  <b>Tender: </b>
                  <nuxt-link
                    :to="{ path: `/tenders/${getTenderByLot(lot).id}` }"
                    >{{ getTenderByLot(lot).title }}</nuxt-link
                  >
                </div>
                <div class="offer-info">
                  <b>Lot: </b>
                  {{ lot.title }}
                </div>
                <div class="offer-info">
                  <b>Criterion: </b>
                  {{ getCriterionByLot(lot).title }}
                </div>
              </div>
              <div class="column is-8">
                <div v-if="!winner" class="offer-info">
                  <b>No winner</b>
                </div>
                <div v-if="winner" class="offer-info">
                  <b>Bidder e-mail: {{ getUserEmail(winner.ownerId).email }}</b>
                </div>
                <div v-if="winner" class="offer-info">
                  <b>Bidder cost: {{ winner.cost }}</b>
                </div>
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
import AccountMenu from "@/components/account/menu.vue";
import { useUserStore } from "@/stores/user";

const config = useRuntimeConfig();

await nextTick();

const store = useUserStore();
const baseURL = config.public.baseURL;
const token = store.token;
const lots = ref([]);
const tendersMap = ref({});
const offersMap = ref([]);
const criterionsMap = ref({});
const scoreMap = ref({});
const query = JSON.stringify({
  where: {
    jury_emails: {
      array_contains: store.user.email,
    },
  },
});

function getTenderByLot(lot) {
  return tendersMap.value[lot.tenderId];
}

function getCriterionByLot(lot) {
  return criterionsMap.value[lot.criterionId];
}

function getUserEmail(userId) {
  const userIdQuery = JSON.stringify({
    where: { id: userId },
  });
  const { data: user } = useFetch(
    () => `${baseURL}/api/user/findFirst?q=${userIdQuery}`,
    {
      headers: {
        Authorization: `Bearer ${store.user.token}`,
      },
      transform: (result) => result.data,
    }
  );
  return user.value;
}

function getWinnerByLot(lot) {
  const offers = offersMap.value[lot.id];
  if (!offers) return;
  const estimationsOfferMap = {};
  offers.forEach((offer) => {
    const estimations = scoreMap.value[offer.id];
    estimationsOfferMap[offer.id] =
      estimations.reduce((p, s) => p + s.value, 0) / estimations.length;
  });
  const winnerOfferId = Object.keys(estimationsOfferMap).reduce((acc, item) =>
    estimationsOfferMap[acc] > estimationsOfferMap[item] ? acc : item
  );

  return Object.values(offers).filter((o) => {
    return o.id === Number(winnerOfferId);
  })[0];
}

const { pending } = useFetch(
  () => `${baseURL}/api/tender/findMany?q=${query}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    async onResponse({ response }) {
      response._data.data.forEach((tender) => {
        tendersMap.value[tender.id] = tender;
      });
      const lotQuery = JSON.stringify({
        where: { tenderId: { in: response._data.data.map((t) => t.id) } },
      });
      const { data: lotsInfo } = await useFetch(
        () => `${baseURL}/api/lot/findMany?q=${lotQuery}`,
        {
          headers: {
            Authorization: `Bearer ${store.user.token}`,
          },
          transform: (result) => result.data,
        }
      );
      lots.value = lotsInfo.value;

      const criterionQuery = JSON.stringify({
        where: { id: { in: lotsInfo.value.map((l) => l.criterionId) } },
      });
      const { data: criterions } = await useFetch(
        () => `${baseURL}/api/criterion/findMany?q=${criterionQuery}`,
        {
          headers: {
            Authorization: `Bearer ${store.user.token}`,
          },
          transform: (result) => result.data,
        }
      );

      criterions.value.forEach((criterion) => {
        criterionsMap.value[criterion.id] = criterion;
      });

      const offerQuery = JSON.stringify({
        where: { lotId: { in: lotsInfo.value.map((l) => l.id) } },
      });
      const { data: offersInfo } = await useFetch(
        () => `${baseURL}/api/offer/findMany?q=${offerQuery}`,
        {
          headers: {
            Authorization: `Bearer ${store.user.token}`,
          },
          transform: (result) => result.data,
        }
      );

      offersInfo.value.forEach((offer) => {
        if (!offersMap.value[offer.lotId]) offersMap.value[offer.lotId] = [];
        offersMap.value[offer.lotId].push(offer);
      });

      const scoreQuery = JSON.stringify({
        where: { offerId: { in: offersInfo.value.map((o) => o.id) } },
      });
      const { data: scoreInfo } = await useFetch(
        () => `${baseURL}/api/score/findMany?q=${scoreQuery}`,
        {
          headers: {
            Authorization: `Bearer ${store.user.token}`,
          },
          transform: (result) => result.data,
        }
      );

      scoreInfo.value.forEach((s) => {
        if (!scoreMap.value[s.offerId]) scoreMap.value[s.offerId] = [];
        scoreMap.value[s.offerId].push(s);
      });
    },
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

.offer-info {
  a {
    color: #e5c076;
  }
}

.estimation-button {
  margin-top: 10px;
  background: #e5c076;
  color: #fff;
  border: 0;
  transition: 0.3s all;
  border: 1px solid #e5c076 !important;

  &:hover,
  &:focus {
    color: #e5c076;
    background: #fff;
  }

  &:disabled {
    color: #e5c076;
  }
}
</style>
