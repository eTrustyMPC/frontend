<template>
  <header>
    <div class="container">
      <div class="columns">
        <div class="column is-2">
          <div class="logo">
            <img src="/header-logo.png" />
          </div>
        </div>
        <div class="column is-10 is-vcentered">
          <div class="buttons is-right tool-buttons">
            <a
              href="#"
              class="button is-link"
              @click="isShowSignUpModal = !isShowSignUpModal"
            >
              <span class="icon">
                <i class="fa fa-sign-in"></i>
              </span>
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
    <div :class="['signup-modal', isShowSignUpModal ? 'is-active' : '']">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-4"></div>
          <div class="column is-4"></div>
          <div class="column is-3">
            <h4 class="title is-4 has-text-centered">Create your account</h4>
            <EInput label="E-mail" name="email" />
            <div class="password">
              <EInput label="Password" name="password" field-type="password" />
            </div>
            <ESelect
              :values="{
                buyer: 'Buyer',
                supplier: 'Supplier',
                auditor: 'Auditor',
              }"
              name="user_type"
              label="Person type"
            />
            <ECheckbox label="I agree with ..." />
            <button class="button">Create account</button>
            <a href="#" class="signin-link">Sign In</a>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="isShowSignUpModal = !isShowSignUpModal"
      ></button>
    </div>
  </header>
</template>

<script lang="ts">
import EInput from "@/components/form/EInput.vue";
import ESelect from "@/components/form/ESelect.vue";
import ECheckbox from "@/components/form/ECheckbox.vue";

export default defineComponent({
  name: "AppHeader",
  components: { EInput, ESelect, ECheckbox },
  data: () => {
    return {
      isShowSignUpModal: true,
    };
  },
});
</script>

<style lang="scss">
header {
  background: #f0f5f7;
  padding: 20px 0px;

  .logo {
    width: 180px;
  }

  .tool-buttons {
    a.button {
      margin: 0;
      transition: all 0.3s;
      background: #f7b452;

      &:hover {
        background: #273038;
      }
    }
  }
}

.signup-modal {
  position: fixed;
  background: #fff;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  -webkit-transform: translateY(100%);
  -moz-transform: translateY(100%);
  transform: translateY(100%);
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  background-image: url("~/assets/background.svg");
  background-repeat: no-repeat;
  background-size: 100%;

  .modal-close {
    transition: all 0.5s;
    background: #f7b452;
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }

  .container,
  .columns {
    height: 100%;
  }

  &.is-active {
    -webkit-transform: translateY(0%);
    -moz-transform: translateY(0%);
    transform: translateY(0%);
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
  }

  .password {
    margin-bottom: 10px;
  }

  .input-field,
  .select-field {
    margin-bottom: 10px;

    .label {
      font-weight: 400;
    }
  }

  .select-field {
    .select {
      width: 100%;

      select {
        width: 100%;
      }
    }
  }

  .button {
    background: #f7b452;
    color: #fff;
    transition: all 0.5s;
    width: 100%;
    margin-top: 25px;

    &:hover {
      background: #273038;
    }
  }

  .checkbox {
    margin-top: 15px;
  }

  .signin-link {
    margin-top: 10px;
    display: block;
    color: #273038;
    text-decoration: underline;
  }
}
</style>
