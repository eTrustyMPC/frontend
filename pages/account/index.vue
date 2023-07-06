<template>
  <div class="container steps-form">
    <div class="columns">
      <AccountMenu />
      <div class="column is-8 box">
        <h3 class="title is-4">Account</h3>
        <div class="user-info">
          <b>Name:</b> {{ store.user.lastName }} {{ store.user.firstName }}
        </div>
        <div class="user-info"><b>E-mail:</b> {{ store.user.email }}</div>
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
}
</style>
