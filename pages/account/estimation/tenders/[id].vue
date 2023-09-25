<template>
  <div class="container steps-form">
    <div class="columns">
      <div class="column menu-container">
        <div class="box is-4">
          <div class="content steps-menu">
            <ul>
              <li
                v-for="(item, idx) in menuItems"
                :key="item"
                :class="activeItem == idx ? 'is-active' : ''"
              >
                <a @click="choseMenuItem(idx)">{{ item }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="column is-8 box">
        <div v-if="pending" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
        <div v-if="!pending" class="tender-info">
          <div v-if="activeItem == 0" class="tender-info-section">
            <h3 class="title is-4">{{ tender.title }}</h3>
            <div class="tender-info-option">
              <span class="icon">
                <i class="fa fa-circle-info"></i>
              </span>
              <span>{{ tender.status }}</span>
            </div>
            <div class="tender-info-option">
              <span class="icon">
                <i class="fa fa-envelope"></i>
              </span>
              <span>{{ user.email }}</span>
            </div>
            <div class="tender-info-option transaction">
              <span class="icon">
                <i class="fa fa-lock"></i>
              </span>
              <span>{{ subHash(tender.syncTxId) }}</span>
              <a href="#" @click="copyHash(tender.syncTxId)">
                <span class="icon">
                  <i class="fa fa-copy"></i>
                </span>
              </a>
              <a
                :href="
                  'https://testnet.partisiablockchain.com/info/transaction/Shard1/' +
                  tender.syncTxId
                "
                target="_blank"
              >
                <span class="icon">
                  <i class="fa fa-link"></i>
                </span>
              </a>
            </div>
          </div>
          <div v-if="activeItem == 1 && lots" class="tender-info-section">
            <div v-for="lot in lots" :key="lot">
              <h3 class="title is-5">{{ lot.title }}</h3>
              <div class="tender-info-option description">
                <span class="icon">
                  <i class="fa fa-comment"></i>
                </span>
                <span>{{ lot.description }}</span>
              </div>
            </div>
          </div>
          <div v-if="activeItem == 2 && criterions" class="tender-info-section">
            <div
              v-for="criterion in criterions"
              :key="criterion"
              class="criterion-item"
            >
              <div class="tender-info-option description">
                <span class="icon">
                  <i class="fa fa-heading"></i>
                </span>
                <span>{{ criterion.name }}</span>
              </div>
              <div class="tender-info-option description">
                <span class="icon">
                  <i class="fa fa-comment"></i>
                </span>
                <span>{{ criterion.title }}</span>
              </div>
            </div>
          </div>
          <div v-if="activeItem == 3" class="tender-info-section">
            <div class="offers-list">
              <div v-for="offer in offers" :key="offer" class="box">
                <div class="offer-info">
                  <b>Lot: </b>
                  {{ lots.filter((l) => l.id == offer.lotId)[0].title }}
                </div>
                <div class="offer-info">
                  <b>Offer description: </b> {{ offer.description }}
                </div>
                <div class="offer-info"><b>Cost: </b> {{ offer.cost }}</div>
                <div v-if="recordedVotes.includes(offer.id)" class="offer-info">
                  <b>Your vote has already been counted</b>
                </div>
                <button
                  class="button estimation-button"
                  :disabled="recordedVotes.includes(offer.id)"
                  @click="showEstimationModal(offer)"
                >
                  Estimate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="['notification ', isShowNotification ? 'is-active' : '']">
      <button class="delete" @click="isShowNotification = false"></button>
      Your vote counts
    </div>
    <div v-if="isShowModal" class="offer-modal modal is-active">
      <div class="modal-background" @click="isShowModal = false"></div>
      <div class="modal-content">
        <div class="box">
          <EInput
            v-model:value="estimationValue"
            label="Your estimate"
            name="estimationValue"
          />
          <div class="buttons modal-buttons">
            <button
              class="button apply"
              :disabled="!isModalFormValid"
              @click="estimate"
            >
              Submit estimation
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
import { nextTick, ref, computed } from "vue";
import { subHash } from "@/utils/common";
import { useUserStore } from "@/stores/user";
import EInput from "@/components/form/EInput.vue";

const route = useRoute();
const config = useRuntimeConfig();
const store = useUserStore();
await nextTick();

const notificationText = ref("");
const tenderId = route.params.id;
const activeItem = ref(0);
const lots = ref([]);
const offers = ref([]);
const criterions = ref([]);
const menuItems = [
  "Information",
  "Lot information",
  "Lot criterion",
  "Offers",
  // "Transactions",
];

const apiUrl = config.public.baseURL;
const tenderIdQuery = JSON.stringify({ where: { id: Number(tenderId) } });
const organization = ref({});
const user = ref({});
const isLoading = ref(false);
const isShowNotification = ref(false);
const isShowModal = ref(false);
const estimationValue = ref(null);
const modalOffer = ref(null);
const recordedVotes = ref([]);

const isModalFormValid = computed(() => {
  const value = parseInt(estimationValue.value) || 0;
  return value > 0;
});

const { data: tender, pending } = useFetch(
  () => `${apiUrl}/api/tender/findFirst?q=${tenderIdQuery}`,
  {
    default: () => {},
    headers: {
      Authorization: `Bearer ${store.user.token}`,
    },
    transform: (result) => result.data,
    async onResponse({ response }) {
      const organizationIdQuery = JSON.stringify({
        where: { id: Number(response._data.data.organizationId) },
      });
      await useFetch(
        () => `${apiUrl}/api/organization/findFirst?q=${organizationIdQuery}`,
        {
          headers: {
            Authorization: `Bearer ${store.user.token}`,
          },
          onResponse({ response }) {
            organization.value = response._data.data;
          },
        }
      );

      const userIdQuery = JSON.stringify({
        where: { id: Number(response._data.data.ownerId) },
      });
      await useFetch(() => `${apiUrl}/api/user/findFirst?q=${userIdQuery}`, {
        headers: {
          Authorization: `Bearer ${store.user.token}`,
        },
        onResponse({ response }) {
          user.value = response._data.data;
        },
      });
      const lotQuery = JSON.stringify({
        where: { tenderId: Number(tenderId) },
      });
      const { data: lotsInfo } = await useFetch(
        () => `${apiUrl}/api/lot/findMany?q=${lotQuery}`,
        {
          headers: {
            Authorization: `Bearer ${store.user.token}`,
          },
          transform: (result) => result.data,
          onResponse({ response }) {
            const criterionQuery = JSON.stringify({
              where: { id: Number(response._data.data[0].criterionId) },
            });
            useFetch(
              () => `${apiUrl}/api/criterion/findFirst?q=${criterionQuery}`,
              {
                headers: {
                  Authorization: `Bearer ${store.user.token}`,
                },
                onResponse({ response }) {
                  criterions.value = [response._data.data];
                },
              }
            );
          },
        }
      );
      lots.value = lotsInfo.value;
      const offerQuery = JSON.stringify({
        where: { lotId: { in: lots.value.map((l) => l.id) } },
      });
      const { data: offersInfo } = await useFetch(
        () => `${apiUrl}/api/offer/findMany?q=${offerQuery}`,
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
        () => `${apiUrl}/api/score/findMany?q=${scoreQuery}`,
        {
          headers: {
            Authorization: `Bearer ${store.user.token}`,
          },
          transform: (result) => result.data,
        }
      );
      recordedVotes.value = scoreInfo.value.map((s) => s.offerId);
      offers.value = offersInfo.value;
    },
  }
);

function choseMenuItem(idx) {
  activeItem.value = idx;
}

function copyHash(hash) {
  navigator.clipboard.writeText(hash);
  isShowNotification.value = true;
  notificationText.value = `Copied to clipboard: ${hash}`;
  setTimeout(() => (isShowNotification.value = false), 3000);
}

function showEstimationModal(offer) {
  isShowModal.value = true;
  modalOffer.value = offer;
}

async function estimate() {
  isLoading.value = true;
  await useFetch(() => `${apiUrl}/api/score/create`, {
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
        offerId: modalOffer.value.id,
        value: parseInt(estimationValue.value),
        criterionId: criterions.value[0].id,
      },
    }),
  });
  recordedVotes.value.push(modalOffer.value.id);
  isShowNotification.value = true;
  isLoading.value = false;
  isShowModal.value = false;
  modalOffer.value = null;
  setTimeout(() => (isShowNotification.value = false), 5000);
}
</script>

<style lang="scss">
.user-info {
  font-size: 18px;
  margin-bottom: 10px;
}

.tender-info-option {
  font-size: 18px;
  color: #273038;
  margin-bottom: 10px;

  &.description {
    display: flex;

    .icon {
      margin-right: 10px;
    }
  }

  .icon {
    margin-right: 5px;
    justify-content: left;
    color: #e5c076;
  }
}

.criterion-item {
  margin-bottom: 30px;
}

.transaction {
  span {
    margin-right: 10px;
  }
}

.menu-container {
  button {
    background: #e5c076;
    color: #fff;
    border: 1px solid #e5c076;
    transition: 0.3s all;
    width: 100%;

    &:hover {
      background: #fff;
      color: #273038;
    }
  }
}

.offer-modal {
  .select-field {
    margin-bottom: 15px;
  }
}

.estimation-button {
  margin-top: 10px;
  background: #e5c076;
  color: #fff;
  border: 0;
  transition: 0.3s all;
  border: 1px solid #e5c076;

  &:hover {
    color: #e5c076;
    background: #fff;
  }

  &:disabled {
    color: #e5c076;
  }
}
</style>
