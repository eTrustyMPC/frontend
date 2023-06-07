<template>
  <div class="number-input-field field">
    <label v-if="label" class="label">{{ label }}</label>
    <div class="control">
      <input
        class="input"
        type="text"
        :name="name"
        :placeholder="placeholder"
        :disabled="isInputDisabled"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "ENumberInput",
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
    isInputDisabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss">
.number-input-field {
  display: flex;

  input {
    width: 55px;
    height: 30px;
  }
}

.label {
  line-height: 30px;
}

.label:not(:last-child) {
  margin-bottom: 0;
  margin-right: 15px;
}
</style>
