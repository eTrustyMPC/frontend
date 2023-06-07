<template>
  <label class="checkbox" :name="name">
    <input type="checkbox" @change="$emit('change', $events.target.value)>
    {{ label }}
  </label>
</template>

<script lang="ts">
export default defineComponent({
  name: "ECheckbox",
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
  },
});
</script>
