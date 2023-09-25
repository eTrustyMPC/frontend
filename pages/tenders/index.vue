<template>
  <div class="container wrapper">
    <h3 class="page-title title is-4">Tenders</h3>
    <div class="columns tenders-columns">
      <div class="column box tenders-filter">
        <div class="filter-title">
          <h5 class="title is-5">Filters</h5>
        </div>
        <div class="filter-item">
          <label class="label">Types</label>
          <ERadio
            v-model:type="tenderType"
            label="Active"
            name="type"
            value="ACTIVE"
            :is-checked="tenderType == 'ACTIVE'"
          />
          <ERadio
            v-model:type="tenderType"
            label="Finished"
            name="type"
            value="FINISHED"
            :is-checked="tenderType == 'FINISHED'"
          />
          <ERadio
            v-model:type="tenderType"
            label="Draft"
            name="type"
            value="DRAFT"
            :is-checked="tenderType == 'DRAFT'"
          />
          <ERadio
            v-model:type="tenderType"
            label="Canceled"
            name="type"
            value="CANCELED"
            :is-checked="tenderType == 'CANCELED'"
          />
        </div>
        <div class="buttons is-centered">
          <button class="button reset" @click="resetFilter">Reset</button>
          <button class="button apply" @click="applyFilter">Apply</button>
        </div>
      </div>
      <div class="column is-8 box tenders-container">
        <!-- <ESelect :values="{asc: ''}"/> -->
        <div v-if="tenders" class="tenders-list">
          <nuxt-link
            v-for="tender in tenders"
            :key="tender"
            class="box"
            :to="{ path: `/tenders/${tender.id}` }"
          >
            <div style="display: flex; justify-content: space-between">
              <h4 class="title is-4">{{ tender.title }}</h4>
              <div class="status-container">
                <span class="status-text">{{ tender.status }}</span>
                <div
                  :class="['status-icon', getStatusColorClass(tender.status)]"
                ></div>
              </div>
            </div>
            <b>Transaction: {{ subHash(tender.syncTxId) }}</b>
          </nuxt-link>
          <div
            v-if="tenders && maxCountTenders != tenders.length && !isLoading"
            class="buttons is-centered"
          >
            <button class="button add-more-tenders" @click="loadTenders">
              View more
            </button>
          </div>
        </div>
        <div v-if="isLoading" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import { useUserStore } from "@/stores/user";
import ERadio from "@/components/form/ERadio.vue";
import { subHash } from "@/utils/common";

const config = useRuntimeConfig();
const store = useUserStore();

await nextTick();

const apiUrl = config.public.baseURL;
const tendersURL = `${apiUrl}/api/tender/findMany`;
const pageLimit = 3;
let pageOffset = 0;
const maxCountTenders = ref(0);
const route = useRoute();
const router = useRouter();
const tenderType = ref(route.query.type ? route.query.type : "ACTIVE");
const tenders = ref([]);
const isLoading = ref(true);

function getTenders() {
  const url = new URL(tendersURL);
  const whereQuery = {};
  const queryData = {
    take: pageLimit,
    skip: pageOffset,
  };
  if (tenderType.value) whereQuery.where = { status: tenderType.value };
  const query = JSON.stringify({ ...queryData, ...whereQuery });
  const queryForCount = JSON.stringify(whereQuery);
  const countUrl = url.href.replace("findMany", "count");
  useFetch(() => `${url.href}?q=${query}`, {
    default: () => [],
    headers: {
      Authorization: `Bearer ${store.token}`,
    },
    onResponse({ response }) {
      tenders.value = [...tenders.value, ...response._data.data];
      useFetch(() => `${countUrl}?q=${queryForCount}`, {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
        onResponse({ response }) {
          maxCountTenders.value = response._data.data;
          isLoading.value = false;
        },
      });
    },
  });
}

function getStatusColorClass(status: string): string {
  switch (status) {
    case "FINISHED":
      return "finished";
    case "CANCELED":
      return "canceled";
    case "DRAFT":
      return "draft";
    case "ACTIVE":
    default:
      return "active";
  }
}
function resetFilter() {
  pageOffset = 0;
  tenderType.value = null;
  isLoading.value = true;
  tenders.value = [];
  getTenders();
  router.push({ query: null });
}

function applyFilter() {
  pageOffset = 0;
  isLoading.value = true;
  tenders.value = [];
  getTenders();
  router.push({ query: { type: tenderType.value } });
}

function loadTenders() {
  isLoading.value = true;
  pageOffset += pageLimit;
  getTenders();
}

getTenders();
</script>

<style lang="scss">
.tenders-columns {
  align-items: flex-start;
}

.tenders-container {
  margin-left: auto;
}

.tenders-filter {
  padding: 0 0 20px 0;
  max-width: 420px;

  .buttons {
    margin-top: 20px;

    .button {
      margin-left: 10px !important;
      margin-right: 10px !important;
      transition: 0.3s all;
    }

    .apply {
      background: #e5c076;
      color: #fff;
      border: 1px solid #e5c076;

      &:hover {
        background: #fff;
        color: #273038;
      }
    }

    .reset {
      border: 1px solid #e5c076;

      &:hover {
        background: #e5c076;
        color: #fff;
      }
    }
  }

  .filter-title {
    padding: 10px 0;
    text-align: center;
    border-bottom: 1px solid #273038;
  }

  .filter-item {
    padding: 15px;

    .radio {
      display: block;
      margin-left: 0;
    }
  }
}

.tenders-list {
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

.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-container {
  display: flex;
  align-items: center;
  /* To center align the icon with the text */
}

.status-text {
  margin-right: 6px;
  /* Adjust as needed */
}

.status-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* Define different color classes for different statuses */
.status-icon.finished {
  background-color: white;
}

.status-icon.canceled {
  background-color: orange;
}

.status-icon.draft {
  background-color: yellow;
}

.status-icon.active {
  background-color: green;
}

.tender-info {
  display: flex;
  flex-direction: column;
}
</style>
