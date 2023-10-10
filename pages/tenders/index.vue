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
          <div v-for="tender in tenders" :key="tender" class="box">
            <nuxt-link :to="{ path: `/tenders/${tender.id}` }">
              <h4 class="title is-4">{{ tender.title }}</h4>
            </nuxt-link>
            <div class="tender-card-informations">
              <div class="tender-info">
                Transaction:
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
                  {{ tender.status.toLowerCase() }}
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
          <div v-if="isShowButtonViewMore" class="buttons is-centered">
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
import moment from "moment";
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
const route = useRoute();
const router = useRouter();
const tenderType = ref(route.query.type ? route.query.type : "ACTIVE");
const tenders = ref([]);
const isLoading = ref(true);
const isShowButtonViewMore = ref(false);

function getTenders() {
  isShowButtonViewMore.value = false;
  const url = new URL(tendersURL);
  const whereQuery = { orderBy: { createdAt: "desc" } };
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
      isLoading.value = false;
      tenders.value = [...tenders.value, ...response._data.data];
      useFetch(() => `${countUrl}?q=${queryForCount}`, {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
        onResponse({ response }) {
          if (response._data.data !== tenders.value.length)
            isShowButtonViewMore.value = true;
        },
      });
    },
  });
}

function getExpiredDaysText(tender) {
  const finishAt = moment(tender.finishAt).set("hour", 23).set("minute", 59);
  const now = moment();
  const days = finishAt.diff(now, "days");
  if (isNaN(days) || (days <= 0 && now.date() !== finishAt.date())) return;
  if (days === 0) return "closing today";
  if (days === 1) return "1 day to go";
  return `${days} days to go`;
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
    position: relative;

    .tender-card-informations {
      margin-top: 15px;

      .tender-info {
        margin-bottom: 5px;
        font-weight: 700;

        a {
          color: #e5c076;
          display: contents;
        }
      }
    }

    .tender-card-metadata {
      position: absolute;
      right: 15px;
      top: 15px;

      .tender-card-metadata-wrapper,
      .tender-card-metadata-button {
        display: flex;
      }

      .tender-card-metadata-button {
        justify-content: end;
        margin-top: 30px;

        .button {
          color: #e5c076;
          border: 1px solid #e5c076;
          transition: 0.3s all;

          &:hover {
            background: #e5c076;
            color: #fff;
          }
        }
      }

      .status,
      .expired-days {
        padding: 3px 10px;
        border-radius: 50px;
        color: #fff;

        &.active {
          background-color: #f7b452;
        }

        &.draft {
          background-color: #618579;
        }

        &.canceled {
          background-color: #413e4a;
        }

        &.finished {
          background-color: #9caa86;
        }
      }

      .expired-days {
        background: #e5c076;
        margin-left: 10px;
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

.tender-info {
  display: flex;
  flex-direction: column;
}
</style>
