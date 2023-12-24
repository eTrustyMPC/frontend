<template>
  <div class="container steps-form">
    <div class="columns">
      <AccountMenu />
      <div class="column is-8 box">
        <h3 class="title is-4">
          {{ $t("pages.account.estimation.index.title") }}
        </h3>
        <div v-if="pending" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
        <div v-if="offers" class="offers-list">
          <div v-for="offer in offers" :key="offer" class="box">
            <div class="columns">
              <div class="column is-4">
                <div class="offer-info">
                  <b
                    >{{
                      $t("pages.account.estimation.index.tenderTitleLable")
                    }}:
                  </b>
                  <nuxt-link :to="{ path: `/tenders/${tender.id}` }">{{
                    tender.title
                  }}</nuxt-link>
                </div>
                <div class="offer-info">
                  <b
                    >{{ $t("pages.account.estimation.index.lotTitleLable") }}:
                  </b>
                  {{ lotsMap[offer.lotId].title }}
                </div>
                <div class="offer-info">
                  <b
                    >{{
                      $t("pages.account.estimation.index.criterionTitleLable")
                    }}:
                  </b>
                  {{ getCriterionByOffer(offer).title }}
                </div>
              </div>
              <div class="column is-8">
                <div class="offer-info">
                  <b
                    >{{
                      $t(
                        "pages.account.estimation.index.offerDescriptionLabel"
                      )
                    }}:
                  </b>
                  {{ offer.description }}
                </div>
                <div class="offer-info">
                  <b
                    >{{
                      $t("pages.account.estimation.index.offerAmountLabel")
                    }}:
                  </b>
                  {{ offer.cost }}
                </div>
              </div>
            </div>
            <div v-if="recordedVotes.includes(offer.id)" class="offer-info">
              {{ $t("pages.account.estimation.index.voteDescriptionLabel") }}
              <br />
              {{ $t("pages.account.estimation.index.voteLabel") }}:
              <b>{{ offerValueMap[offer.id] }}</b>
            </div>
            <div
              v-if="
                moment(getTenderByOffer(offer).deadlineAt) < moment() &&
                !recordedVotes.includes(offer.id)
              "
              class="offer-info"
            >
              {{ $t("pages.account.estimation.index.voteTimeLabel") }}
            </div>
            <button
              class="button estimation-button"
              :disabled="
                recordedVotes.includes(offer.id) ||
                moment(getTenderByOffer(offer).deadlineAt) < moment()
              "
              @click="showEstimationModal(offer)"
            >
              {{ $t("pages.account.estimation.index.evaluateButton") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div :class="['notification ', isShowNotification ? 'is-active' : '']">
      <button class="delete" @click="isShowNotification = false"></button>
      {{ $t("pages.account.estimation.index.modalTitle") }}
    </div>
    <div v-if="isShowModal" class="offer-modal modal is-active">
      <div class="modal-background" @click="isShowModal = false"></div>
      <div class="modal-content">
        <div class="box">
          <label class="label evaluation-label">Evaluation Input</label>
          <span class="is-size-6">Put your evaluation from 1 to 10</span>
          <EInput
            v-model:value="estimationValue"
            :label="$t('pages.account.estimation.index.modalInputLabel')"
            name="estimationValue"
          />
          <div class="buttons modal-buttons">
            <button
              class="button apply"
              :disabled="!isModalFormValid"
              @click="estimate"
            >
              {{ $t("pages.account.estimation.index.modalButton") }}
              <div v-if="isLoading" class="loader is-loading"></div>
            </button>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="isShowModal = false"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from "vue";
import moment from "moment";
import AccountMenu from "@/components/account/menu.vue";
import { useUserStore } from "@/stores/user";
import EInput from "@/components/form/EInput.vue";

const config = useRuntimeConfig();

await nextTick();

const store = useUserStore();
const baseURL = config.public.baseURL;
const token = store.token;
const lotsMap = ref({});
const tendersMap = ref({});
const offers = ref([]);
const criterionsMap = ref({});
const recordedVotes = ref([]);
const estimationValue = ref(1);
const isShowNotification = ref(false);
const offerValueMap = ref({});
const isLoading = ref(false);
const isShowModal = ref(false);
const modalOffer = ref(null);
const query = JSON.stringify({
  where: {
    jury_emails: {
      array_contains: store.user.email,
    },
  },
});

const isModalFormValid = computed(() => {
  const value = parseInt(estimationValue.value) || 0;
  return value >= 1 && value <= 10;
});

function getTenderByOffer(offer) {
  return tendersMap.value[lotsMap.value[offer.lotId].tenderId];
}

function getCriterionByOffer(offer) {
  return criterionsMap.value[lotsMap.value[offer.lotId].criterionId];
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
      lotsInfo.value.forEach((lot) => {
        lotsMap.value[lot.id] = lot;
      });

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
      const scoreQuery = JSON.stringify({
        where: { ownerId: store.user.id },
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
      scoreInfo.value.forEach((score) => {
        offerValueMap.value[score.offerId] = score.value;
      });
      recordedVotes.value = scoreInfo.value.map((s) => s.offerId);
      offers.value = offersInfo.value;
    },
  }
);

function showEstimationModal(offer) {
  isShowModal.value = true;
  modalOffer.value = offer;
}

async function estimate() {
  const estimation = parseInt(estimationValue.value);
  const offerId = modalOffer.value.id;
  isLoading.value = true;
  const lot = lotsMap.value[modalOffer.value.lotId];
  await useFetch(() => `${baseURL}/api/score/create`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${store.user.token}`,
    },
    transform: (result) => result.data,
    body: JSON.stringify({
      data: {
        ownerId: store.user.id,
        offerId,
        value: estimation,
        criterionId: criterionsMap.value[lot.criterionId].id,
      },
    }),
  });
  offerValueMap.value[offerId] = estimation;
  recordedVotes.value.push(offerId);
  isShowNotification.value = true;
  isLoading.value = false;
  isShowModal.value = false;
  modalOffer.value = null;
  estimationValue.value = 1;
  setTimeout(() => (isShowNotification.value = false), 5000);
}
</script>

<style lang="scss">
.tenders-list {
  padding: 0 10px 30px 10px;
}

.offer-info {
  a {
    color: #e5c076;
  }
}

.evaluation-input {
  margin-top: 10px;
}

.label {
  &.evaluation-label {
    margin-bottom: 0;
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
