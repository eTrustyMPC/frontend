<template>
  <div class="column menu-container box is-4">
    <div class="content steps-menu">
      <ul>
        <li
          v-for="(key, path) in getMenuItems"
          :key="key"
          :class="path === router.path.substring(1) ? 'is-active' : ''"
        >
          <nuxt-link :to="{ path: `/${path}` }">{{ key }}</nuxt-link>
        </li>
        <li>
          <a href="#" @click="logout">{{
            $t("components.account.menu.logOutButton")
          }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/user";

export default defineComponent({
  name: "AccountMenu",
  components: {},
  data: () => {
    return {
      router: useRoute(),
      store: useUserStore(),
      supabase: useSupabaseClient(),
    };
  },
  computed: {
    getMenuItems() {
      const userRole = this.store.user.role;
      const localePath = "components.account.menu.itemsMap";
      const menuItems = {
        account: this.$t(`${localePath}.account`),
      };
      if (!this.store.user.role) return menuItems;
      if (userRole === "tender_owner") {
        menuItems["account/tenders"] = this.$t(`${localePath}.tenders`);
        menuItems["account/tenders/winners"] = this.$t(`${localePath}.winners`);
      }
      if (userRole === "application")
        menuItems["account/offers"] = this.$t(`${localePath}.offers`);
      if (userRole === "jury_member")
        menuItems["account/estimation/"] = this.$t(`${localePath}.estimation`);
      menuItems["account/settings"] = this.$t(`${localePath}.settings`);
      return menuItems;
    },
  },
  methods: {
    async logout() {
      if (process.client) {
        await this.supabase.auth.signOut();
      }
      window.location.reload();
    },
  },
});
</script>

<style lang="scss"></style>
