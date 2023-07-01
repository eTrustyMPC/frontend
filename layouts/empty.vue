<template>
  <div id="main">
    <slot />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "Empty",
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
