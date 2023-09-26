<template>
  <header>
    <div class="container">
      <div class="columns">
        <div class="column is-2">
          <div class="logo">
            <nuxt-link :to="{ path: '/' }">
              <img src="/header-logo.png" />
            </nuxt-link>
          </div>
        </div>
        <div class="column is-3 is-vcentered">
          <ul class="main-menu">
            <li>
              <nuxt-link active-class="active" :to="{ path: '/tenders' }"
                >Tenders</nuxt-link
              >
            </li>
            <!-- <li>
              <nuxt-link active-class="active" :to="{ path: '/transactions' }"
                >Transactions</nuxt-link
              >
            </li> -->
          </ul>
        </div>
        <div class="column is-7 is-vcentered">
          <div class="buttons is-right tool-buttons">
            <nuxt-link
              v-if="store.user.role == 'tender_owner'"
              class="button is-link"
              :to="{ path: '/tenders/create' }"
            >
              <span class="icon">
                <i class="fa fa-business-time"></i>
              </span>
              <span>Create tender</span>
            </nuxt-link>
            <nuxt-link class="button user-account" :to="{ path: '/account' }">
              <span class="icon">
                <i class="fa fa-user"></i>
              </span>
              <span>{{ store.user.email }}</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/user";

export default defineComponent({
  name: "AppHeader",
  components: {},
  setup() {
    return {
      store: useUserStore(),
    };
  },
  data: () => {
    return {};
  },
  methods: {},
});
</script>

<style lang="scss">
header {
  background: #f0f5f7;
  padding: 20px 0px;

  .logo {
    width: 180px;
  }

  .tool-buttons {
    a.button {
      margin: 0;
      transition: all 0.3s;
      background: #f7b452;

      &.user-account {
        background: none !important;
        color: #273038 !important;
        border: 0;
      }

      &:hover {
        background: #273038;
      }
    }
  }
}
</style>
