<template>
  <div class="container wrapper">
    <h3 class="page-title title is-4">Tenders</h3>
    <div class="columns">
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
          />
          <ERadio
            v-model:type="tenderType"
            label="Finished"
            name="type"
            value="FINISHED"
          />
          <ERadio
            v-model:type="tenderType"
            label="Draft"
            name="type"
            value="DRAFT"
          />
          <ERadio
            v-model:type="tenderType"
            label="Canceled"
            name="type"
            value="CANCELED"
          />
        </div>
        <div class="buttons is-centered">
          <button class="button reset" @click="resetFilter">Reset</button>
          <button class="button apply" @click="applyFilter">Apply</button>
        </div>
      </div>
      <div class="column is-8 box tenders-container">
        <!-- <ESelect :values="{asc: ''}"/> -->
        <div v-if="isLoading" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
        <div v-if="!isLoading" class="tenders-list">
          <nuxt-link
            v-for="tender in tenders"
            :key="tender"
            class="box"
            :to="{ path: `/tenders/${tender.id}` }"
          >
            <h4 class="title is-4">{{ tender.attributes.title }}</h4>
            <b>Organization: {{ tender.attributes.organizationId }}</b>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import ERadio from "@/components/form/ERadio.vue";

await nextTick();

const tendersURL = "https://backend-ten-swart.vercel.app/api/tender";
const pageLimit = 100;
let pageOffset = 0;
const nextLink = ref(null);
const tenderType = ref(null);
const tenders = ref([]);
const isLoading = ref(true);

function getTenders() {
  const url = new URL(tendersURL);
  if (tenderType.value)
    url.searchParams.append("filter[status]", tenderType.value);
  url.searchParams.append("page[limit]", pageLimit);
  url.searchParams.append("page[offset]", pageOffset);
  useFetch(() => url.href, {
    default: () => [],
    onResponse({ response }) {
      isLoading.value = false;
      nextLink.value = response._data.links.next;
      tenders.value = [...tenders.value, ...response._data.data];
    },
  });
}

function resetFilter() {
  pageOffset = 0;
  tenderType.value = null;
  isLoading.value = true;
  tenders.value = [];
  getTenders();
}

function applyFilter() {
  isLoading.value = true;
  tenders.value = [];
  getTenders();
}

getTenders();
</script>

<style lang="scss">
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
</style>
