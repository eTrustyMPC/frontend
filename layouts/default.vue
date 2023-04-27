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
  }
});
</script>
