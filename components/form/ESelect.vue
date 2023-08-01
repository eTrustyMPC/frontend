<template>
  <div class="select-field">
    <label v-if="label" class="label">{{ label }}</label>
    <div class="select">
      <select @change="(event) => $emit('update:value', event.target.value)">
        <option
          v-for="(key, v) in values"
          :key="key"
          :value="v"
          :selected="selected == v"
        >
          {{ key }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "ESelect",
  props: {
    values: {
      type: Object,
      default() {
        return {};
      },
    },
    name: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    selected: {
      type: String,
      default: "",
    },
  },
});
</script>
