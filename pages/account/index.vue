<template>
  <div class="container steps-form">
    <div class="columns">
      <AccountMenu />
      <div class="column is-8 box">
        <div
          v-if="store.user && !store.user.role"
          class="account-wrapper select-role-form"
        >
          <ESelect
            v-model:value="role"
            label="Role"
            :values="{
              application: 'application',
              jury_member: 'jury_member',
              tender_owner: 'tender_owner',
            }"
          />
          <button class="button" @click="saveRole">
            <span>Save</span>
            <div v-if="isLoading" class="loader is-loading"></div>
          </button>
        </div>
        <div v-if="store.user && store.user.role" class="account-wrapper">
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
import ESelect from "@/components/form/ESelect.vue";

export default defineComponent({
  name: "Account",
  components: { AccountMenu, ESelect },
  data: () => {
    return {
      role: "application",
      store: useUserStore(),
      isLoading: false,
    };
  },
  computed: {},
  methods: {
    async saveRole() {
      this.isLoading = true;
      const url = this.$config.public.baseURL;
      await useFetch(() => `${url}/api/user/update`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.store.user.token}`,
        },
        body: JSON.stringify({
          data: {
            role: this.role,
          },
          where: {
            id: this.store.user.id,
          },
        }),
      });
      this.store.setRole(this.role);
      this.isLoading = false;
    },
  },
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

.select-role-form {
  max-width: 30%;

  .select,
  select {
    width: 100%;
  }

  .button {
    margin-top: 15px;
    background: #e5c076;
    color: #fff;
    border: 1px solid #e5c076 !important;
    transition: 0.3s all;
    width: 100%;

    .loader {
      border-right-color: #fff;
      border-top-color: #fff;
    }

    span {
      margin-right: 5px;
    }

    &:hover,
    &:focus {
      background: #fff;
      color: #273038;

      .loader {
        border-right-color: #e5c076;
        border-top-color: #e5c076;
      }
    }
  }
}
</style>
