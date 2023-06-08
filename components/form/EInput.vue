<template>
  <div class="input-field field">
    <label v-if="label" class="label">{{ label }}</label>
    <div class="control">
      <input
        class="input"
        :name="name"
        :placeholder="placeholder"
        :type="fieldType"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "EInput",
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    fieldType: {
      type: String,
      default: "text",
    },
  },
});
</script>
