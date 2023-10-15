<template>
  <div class="container steps-form">
    <div class="columns">
      <AccountMenu />
      <div class="column is-8 box">
        <h3 class="title is-4">Winning Bidders</h3>
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
              <div class="offer-info-column column is-4">
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
                <!-- isLoading -->

                <button
                  v-if="winner && lot.status === 'DRAFT'"
                  :disabled="isLoading"
                  class="button"
                  @click="showWinner(lot)"
                >
                  Show winner
                  <div v-if="isLoading" class="loader is-loading"></div>
                </button>
              </div>
              <div class="offer-info-column column is-8">
                <div v-if="lot.status === 'DRAFT'" class="offer-info">
                  <b>No winner</b>
                </div>
                <div
                  v-if="lot.status === 'FINISHED'"
                  class="winner-info-wrapper"
                >
                  <div class="offer-info">
                    <b>Winner email: {{ usersMap[winner.ownerId].email }}</b>
                  </div>
                  <div class="offer-info">
                    <b>Winner price: {{ winner.cost }}</b>
                  </div>
                  <div class="offer-info">
                    <b>Winner transaction: </b>
                    <a
                      :href="
                        'https://testnet.partisiablockchain.com/info/transaction/Shard1/' +
                        winner.syncTxId
                      "
                      target="_blank"
                      >{{ subHash(winner.syncTxId) }}</a
                    >
                  </div>
                  <!-- <button
                    v-if="winners[0] && lot.status !== 'DRAFT'"
                    class="button"
                    @click="otherWinners = winners"
                  >
                    Show other winner
                  </button> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isShowModal" class="offer-modal modal is-active">
      <div
        class="modal-background"
        @click="
          isShowModal = false;
          otherWinners = [];
        "
      ></div>
      <div class="modal-content">
        <div class="box">
          <div class="winner-list">
            {{ otherWinners }}
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="
          isShowModal = false;
          otherWinners = [];
        "
      ></button>
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
const lots = ref([]);
const tendersMap = ref({});
const offersMap = ref([]);
const criterionsMap = ref({});
const isShowModal = ref(false);
const scoreMap = ref({});
const usersMap = ref({});
const isLoading = ref(false);
const otherWinners = ref([]);
const query = JSON.stringify({
  where: {
    ownerId: {
      equals: store.user.id,
    },
  },
});

async function showWinner(lot) {
  isLoading.value = true;
  const offer = getWinnersByLot(lot)[0];
  await useFetch(
    () => `${baseURL}/api/lot/selectWinner?offerId=${offer.id}&lotId=${lot.id}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${store.user.token}`,
      },
      onResponse() {
        lot.status = "FINISHED";
        isLoading.value = false;
      },
    }
  );
}

function getTenderByLot(lot) {
  return tendersMap.value[lot.tenderId];
}

function getCriterionByLot(lot) {
  return criterionsMap.value[lot.criterionId];
}

function getWinnerByLot(lot) {
  const offers = offersMap.value[lot.id];
  if (!offers) return null;
  const estimationsOfferMap = {};
  if (
    !Object.keys(scoreMap.value)
      .map((s) => Number(s))
      .some((r) => offers.map((o) => o.id).includes(r))
  )
    return null;
  const countEstimation = offers
    .filter((o) => o.id in scoreMap.value)
    .reduce((c, o) => c + scoreMap.value[o.id].length, 0);
  offers.forEach((offer) => {
    const estimations = scoreMap.value[offer.id];
    if (!estimations) return;
    estimationsOfferMap[offer.id] =
      estimations.reduce((p, s) => p + s.value, 0) / countEstimation;
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

      const userIdQuery = JSON.stringify({
        where: { id: { in: offersInfo.value.map((o) => o.ownerId) } },
      });
      const { data: users } = await useFetch(
        () => `${baseURL}/api/user/findMany?q=${userIdQuery}`,
        {
          headers: {
            Authorization: `Bearer ${store.user.token}`,
          },
          transform: (result) => result.data,
        }
      );

      users.value.forEach((user) => {
        usersMap.value[user.id] = user;
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
}

.offer-info-column {
  .offer-info {
    a {
      color: #e5c076;
    }
  }

  .button {
    background: #f7b452;
    color: #fff;
    transition: all 0.5s;
    margin-top: 10px;

    .loader {
      margin-left: 10px;
    }

    &:hover {
      background: #273038;
    }
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
