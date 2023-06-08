<template>
  <label class="checkbox" :name="name">
    <input
      type="checkbox"
      value="1"
      @change="$emit('change', $event.target.checked)"
    />
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
  emits: ["change"],
});
</script>
