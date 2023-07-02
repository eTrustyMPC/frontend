<template>
  <div class="container steps-form">
    <div class="columns">
      <AccountMenu />
      <div class="column is-8 box">
        <h3 class="title is-4">Tenders</h3>
        <div v-if="pending" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
        <div class="tenders-list columns">
          <div v-for="tender in tenders" :key="tender" class="card column is-4">
            <div class="card-image">
              <figure class="image is-4by3">
                <img
                  src="https://bulma.io/images/placeholders/1280x960.png"
                  alt="Placeholder image"
                />
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <p class="title is-5">{{ tender.title }}</p>
                </div>
              </div>

              <div class="content"></div>
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
// export default {
//   name: "Tenders",
//   components: { AccountMenu },
//   setup() {
//     const store = useUserStore();
//     const config = useRuntimeConfig();
//     const baseURL = config.public.baseURL;
//     const token = store.token;

//     const { data: tenders, pending } = useFetch(
//       () => `${baseURL}/api/v1/tenders`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         transform: (result) => result.data,
//       }
//     );

//     return { tenders, pending };
//   },
//   data: () => {
//     return {};
//   },
//   computed: {},
//   methods: {},
// };
</script>

<style lang="scss">
.tenders-list {
  padding: 0 10px 30px 10px;

  .card {
    margin-right: 10px;

    .card-content {
      padding: 0;
      margin-top: 10px;
    }
  }
}
</style>
