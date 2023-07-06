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
          <ECheckbox label="Active" name="isActive" />
          <ECheckbox label="Finished" />
          <ECheckbox label="Draft" />
          <ECheckbox label="Canceled" />
        </div>
        <div class="buttons is-centered">
          <button class="button reset">Reset</button>
          <button class="button apply">Apply</button>
        </div>
      </div>
      <div class="column is-8 box tenders-container">
        <!-- <ESelect :values="{asc: ''}"/> -->
        <div v-if="pending" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
        <div v-if="!pending" class="tenders-list">
          <nuxt-link
            v-for="tender in tenders"
            :key="tender"
            class="box"
            :to="{ path: `/tenders/${tender.Id}` }"
          >
            <h4 class="title is-4">{{ tender.title }}</h4>
            <b>Organization: prisma</b>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from "vue";
import ECheckbox from "@/components/form/ECheckbox.vue";
import { useUserStore } from "@/stores/user";

await nextTick();

const store = useUserStore();
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const token = store.token;

const { data: tenders, pending } = useFetch(() => `${baseURL}/api/v1/tenders`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  default: () => [],
  transform: (result) => result.data,
});
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

    .checkbox {
      display: block;
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
