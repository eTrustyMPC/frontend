<template>
  <label class="radio">
    <input
      type="radio"
      :value="value"
      :name="name"
      @change="(event) => $emit('update:type', event.target.value)"
    />{{ label }}
    <i class="fa fa-check"></i>
  </label>
</template>

<script lang="ts">
export default defineComponent({
  name: "ERadio",
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      required: true,
    },
  },
  emits: ["change"],
});
</script>

<style lang="scss">
.radio {
  position: relative;
  padding-left: 30px;
  font-size: 18px;
  line-height: 1.6;

  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    -o-appearance: none;
    appearance: none;
  }

  i {
    display: none;
  }

  input:checked::before {
    background: #f7b452;
  }

  input:checked + i {
    display: block;
    position: absolute;
    left: 4px;
    color: #fff;
    z-index: 2;
    top: 7px;
    font-size: 15px;
  }

  input::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 20px;
    height: 20px;
    border: 1px solid #f7b452;
    border-radius: 3px;
    margin: auto;
  }
}
</style>
