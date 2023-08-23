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
        <div class="buttons">
          <button class="button" @click="isShowOfferModal = true">
            Participate
          </button>
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
            <!-- <div class="tender-info-option description">
              <span class="icon">
                <i class="fa fa-comment"></i>
              </span>
              <span
                >Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when an unknown
                printer took a galley of type and scrambled it to make a type
                specimen book. It has survived not only five centuries, but also
                the leap into electronic typesetting, remaining essentially
                unchanged. It was popularised in the 1960s with the release of
                Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker
                including versions of Lorem Ipsum.</span
              >
            </div> -->
            <div class="tender-info-option">
              <span class="icon">
                <i class="fa fa-envelope"></i>
              </span>
              <span>{{ user.email }}</span>
            </div>
            <div class="tender-info-option">
              <span class="icon">
                <i class="fa fa-building"></i>
              </span>
              <span>{{ organization.name }}</span>
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
              <!--               <div class="tender-info-option description">
                <span class="icon">
                  <i class="fa fa-star"></i>
                </span>
                <span>{{ criterion.scoreType.toLowerCase() }}</span>
              </div>
              <div class="tender-info-option description">
                <span class="icon">
                  <i class="fa fa-code-compare"></i>
                </span>
                <span>{{ criterion.agregationType.toLowerCase() }}</span>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="['notification ', isNotification ? 'is-active' : '']">
      <button class="delete" @click="isNotification = false"></button>
      {{ notificationText }}
    </div>
    <div v-if="isShowOfferModal" class="modal is-active">
      <div class="modal-background" @click="isShowOfferModal = false"></div>
      <div class="modal-content">
        <div class="box">
          <ESelect
            v-model:value="offerLot"
            label="Lot"
            :selected="lots[0].id"
            :values="
              Object.assign({}, ...lots.map((v) => ({ [v.id]: v.title })))
            "
          />
          <EInput v-model:value="offerCost" label="Cost" name="cost" />
          <EText v-model:value="offerDescription" label="Description" />
          <div class="buttons modal-buttons">
            <button
              class="button apply"
              :disabled="!isModalFormValid"
              @click="createOffer"
            >
              Apply
              <div v-if="isLoading" class="loader is-loading"></div>
            </button>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="isShowOfferModal = false"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, computed } from "vue";
import { subHash } from "@/utils/common";
import { useUserStore } from "@/stores/user";
import EText from "@/components/form/EText.vue";
import EInput from "@/components/form/EInput.vue";
import ESelect from "@/components/form/ESelect.vue";

const route = useRoute();
const config = useRuntimeConfig();
const store = useUserStore();
await nextTick();

const isNotification = ref(false);
const notificationText = ref("");
const tenderId = route.params.id;
const activeItem = ref(0);
const lots = ref([]);
const criterions = ref([]);
const isShowOfferModal = ref(false);
const offerCost = ref("");
const offerDescription = ref("");
const offerLot = ref(null);
const menuItems = [
  "Information",
  "Lot information",
  "Lot criterion",
  // "Transactions",
];

const isModalFormValid = computed(() => {
  const cost = parseInt(offerCost.value) || 0;
  if (cost <= 0) return false;
  if (offerDescription.value.length < 3) return false;
  return true;
});
const apiUrl = config.public.baseURL;
const tenderIdQuery = JSON.stringify({ where: { id: Number(tenderId) } });
const organization = ref({});
const user = ref({});
const isLoading = ref(false);

const { data: tender, pending } = useFetch(
  () => `${apiUrl}/api/tender/findFirst?q=${tenderIdQuery}`,
  {
    default: () => {},
    headers: {
      Authorization: `Bearer ${store.user.token}`,
    },
    transform: (result) => result.data,
    onResponse({ response }) {
      const organizationIdQuery = JSON.stringify({
        where: { id: Number(response._data.data.organizationId) },
      });
      useFetch(
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
      useFetch(() => `${apiUrl}/api/user/findFirst?q=${userIdQuery}`, {
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
      useFetch(() => `${apiUrl}/api/lot/findMany?q=${lotQuery}`, {
        headers: {
          Authorization: `Bearer ${store.user.token}`,
        },
        onResponse({ response }) {
          lots.value = response._data.data;
          const criterionQuery = JSON.stringify({
            where: { id: Number(response._data.data[0].id) },
          });
          offerLot.value = lots.value[0].id;
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
      });
    },
  }
);

function createOffer() {
  isLoading.value = true;
  useFetch(() => `${apiUrl}/api/offer/create`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${store.user.token}`,
    },
    body: JSON.stringify({
      data: {
        ownerId: store.user.id,
        organizationId: 1,
        lotId: offerLot.value,
        cost: parseInt(offerCost.value),
        description: offerDescription.value,
      },
    }),
    onResponse() {
      isLoading.value = false;
    },
  });
}

function choseMenuItem(idx) {
  activeItem.value = idx;
}

function copyHash(hash) {
  navigator.clipboard.writeText(hash);
  isNotification.value = true;
  notificationText.value = `Copied to clipboard: ${hash}`;
  setTimeout(() => (isNotification.value = false), 3000);
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
</style>
