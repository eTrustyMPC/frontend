<template>
  <div class="container steps-form">
    <div class="columns">
      <div class="column menu-container box is-4">
        <div class="content steps-menu">
          <ul>
            <li class="is-active"><a>Account</a></li>
            <li><a>My tenders</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "Account",
  components: {},
  data: () => {
    return {};
  },
  computed: {},
  methods: {
    goToNextStep() {
      if (this.isStepValid) {
        this.numberStep++;
        this.disabledItems.splice(
          this.disabledItems.indexOf(this.numberStep),
          1
        );
      }
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

      .disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      &.is-active {
        background: #f7b452;

        a {
          color: #fff;
        }
      }

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #f7b452;

        a {
          color: #fff;
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

.menu-container {
  padding: 0;
}

.tender-main-info {
  max-width: 450px;
}

.criterion-info {
  position: relative;

  .delete-button {
    position: absolute;
    right: 0;
    top: 30px;
  }

  .input-field {
    max-width: 70%;
  }

  .select-field {
    margin-top: 20px;
  }

  hr {
    margin: 20px 0;
    background: rgb(39 48 56 / 50%);
  }

  .delete-button {
    &:hover {
      background: #273038;
      color: #fff;
      transition: all 0.3s;
    }
  }
}
</style>
