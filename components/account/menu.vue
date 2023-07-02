<template>
  <div class="column menu-container box is-4">
    <div class="content steps-menu">
      <ul>
        <li
          v-for="(key, path) in items"
          :key="key"
          :class="path == router.path.substring(1) ? 'is-active' : ''"
        >
          <nuxt-link :to="{ path: `/${path}` }">{{ key }}</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ path: `/signin` }" @click="logout"
            >Logout</nuxt-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "AccountMenu",
  components: {},
  data: () => {
    return {
      items: {
        account: "Account",
        tenders: "My tenders",
      },
      router: useRoute(),
    };
  },
  computed: {},
  methods: {
    logout() {
      if (process.client) {
        localStorage.setItem("token", null);
      }
    },
  },
});
</script>

<style lang="scss"></style>
