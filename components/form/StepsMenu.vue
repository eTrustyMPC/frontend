<template>
  <div class="content steps-menu">
    <ul>
      <li :class="activeElement == index ? 'is-active' : ''" v-for="(name, index) in stepNames">
        <a href="#" @click="activeElement = index">{{
          name
        }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "StepsMenu",
  data: () => {
    return {
      activeElement: 0
    }
  },
  props: {
    stepNames: {
      type: Array,
      default: [],
    },
  },
});
</script>

<style lang="scss">
.steps-menu {
  ul {
    margin: 0;
    list-style-type: none;

    li {
      padding: 10px;
      padding-left: 20px;
      margin: 0;
      transition: all 0.3s;


      &.is-active {
        background: #f7b452;

        a {
          color: #fff
        }
      }

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #f7b452;

        a {
          color: #fff
        }
      }

      a {
        color: #273038;
        font-size: 18px;
      }      
    }
  }

  .buttons {
    margin-top: 20px;
  }
}
</style>
