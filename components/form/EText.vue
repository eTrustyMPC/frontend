<template>
  <div class="input-field field">
    <label v-if="label" class="label">{{ label }}</label>
    <div class="control">
      <textarea
        class="textarea"
        :name="name"
        :placeholder="placeholder"
        :type="fieldType"
        :value="value"
        @input="(event) => $emit('update:value', event.target.value)"
      ></textarea>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "EText",
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
    value: {
      type: String,
      default: "",
    },
  },
});
</script>

<style lang="scss"></style>
