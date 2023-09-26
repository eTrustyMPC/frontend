<template>
  <div class="container steps-form">
    <div class="columns">
      <AccountMenu />
      <div class="column is-8 box">
        <div v-if="store.user" class="account-wrapper">
          <h3 class="title is-4">Account</h3>
          <div class="user-info"><b>E-mail:</b> {{ store.user.email }}</div>
          <div v-if="store.user.createdAt" class="user-info">
            <b>Created at:</b> {{ store.user.createdAt }}
          </div>
          <div v-if="store.user.syncTxId" class="user-info">
            <b>Token address: </b>
            <a
              :href="
                'https://testnet.partisiablockchain.com/info/transaction/Shard1/' +
                store.user.syncTxId
              "
              >{{ subHash(store.user.syncTxId) }}</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AccountMenu from "@/components/account/menu.vue";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  name: "Account",
  components: { AccountMenu },
  data: () => {
    return {
      store: useUserStore(),
    };
  },
  computed: {},
  methods: {},
});
</script>

<style lang="scss">
.user-info {
  font-size: 18px;
  margin-bottom: 10px;

  a {
    color: #f7b452;
  }
}
</style>
