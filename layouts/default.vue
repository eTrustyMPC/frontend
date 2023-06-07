<template>
  <div id="main">
    <app-header />
    <slot />
    <app-footer />
  </div>
</template>

<script lang="ts">
import appHeader from "./appHeader.vue";
import appFooter from "./appFooter.vue";

export default defineComponent({
  name: "Default",
  components: {
    appHeader,
    appFooter,
  },
});
</script>

<style lang="scss">
html,
body,
#__nuxt {
  margin: 0;
  padding: 0;
  height: 100%;
}

#main {
  min-height: 100%;
  position: relative;
  padding-bottom: 93px;
}
</style>
