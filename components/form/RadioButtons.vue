<template>
  <div class="radio-field">
    <label v-if="label" class="label">{{ label }}</label>
    <div class="control">
      <label v-for="(key, v) in values" class="radio">
        <input type="radio" :name="name" @click="$emit('change', v)"/>
        {{ key }}
      </label>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "RadioButtons",
  props: ["values", "label", "name"],
  emits: ["change"]
});
</script>

<style lang="scss">
.radio-field {
  margin-bottom: 25px;

  .radio {
    display: block;
    margin-left: 0;
    line-height: 1.5;
  }
}
</style>
