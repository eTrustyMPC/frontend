<template>
  <div class="signin-modal">
    <div class="container">
      <div class="columns is-vcentered">
        <div class="column is-4"></div>
        <div class="column is-4"></div>
        <div class="column is-3">
          <h4 class="title is-4 has-text-centered">Sign In</h4>
          <EInput v-model:value="email" label="E-mail" name="email" />
          <div class="password">
            <div class="input-field field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  v-model="password"
                  class="input"
                  name="password"
                  :type="isShowPassword ? 'text' : 'password'"
                />
                <span class="icon" @click="isShowPassword = !isShowPassword">
                  <i
                    :class="['fa', isShowPassword ? 'fa-eye' : 'fa-eye-slash']"
                  ></i>
                </span>
              </div>
            </div>
          </div>
          <button class="button" @click="signin">
            Login
            <div v-if="isLoading" class="loader is-loading"></div>
          </button>
        </div>
      </div>
    </div>
    <div :class="['notification', isShowNotification ? 'is-active' : '']">
      <button class="delete" @click="isShowNotification = false"></button>
      {{ notificationText }}
    </div>
  </div>
</template>

<script lang="ts">
import EInput from "@/components/form/EInput.vue";
import { useUserStore } from "@/stores/user";

definePageMeta({
  layout: "empty",
});

export default defineComponent({
  name: "SignUp",
  components: { EInput },
  data: () => {
    return {
      isShowSignInModal: false,
      email: "nikita@etrusty.io",
      password: "niktest1",
      isShowNotification: false,
      notificationText: "",
      isLoading: false,
      isShowPassword: false,
    };
  },
  computed: {},
  methods: {
    closeNotification() {
      setTimeout(() => (this.isShowNotification = false), 3000);
    },
    async signin() {
      if (!/^[^@]+@\w+(\.\w+)+\w$/.test(this.email) && this.password === "") {
        this.isShowNotification = true;
        this.notificationText = "Enter your e-mail and password!";
        this.closeNotification();
        return;
      }

      this.isLoading = true;
      const baseURL = this.$config.public.baseURL;
      const authReq = await fetch(`${baseURL}/api/auth/logIn`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      });

      this.isLoading = false;
      if (authReq.status !== 200) {
        this.isShowNotification = true;
        this.notificationText = "Authentication error: Wrong email or password";
        this.closeNotification();
        return;
      }

      const data = await authReq.json();
      const store = useUserStore();
      const token = data.meta.session.access_token;
      store.saveUserInfo(
        data.data.id,
        data.data.email,
        token,
        data.data.role,
        data.data.syncTxId,
        data.meta.session.user.created_at
      );
      navigateTo("/account");
    },
  },
});
</script>

<style lang="scss">
$fa-font-path: "~@fortawesome/fontawesome-free/webfonts";

.signin-modal {
  position: fixed;
  background: #fff;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
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

  .password {
    margin-bottom: 10px;

    .control {
      position: relative;

      span {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 5px;
        margin: auto;
        cursor: pointer;
      }
    }
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

    .loader {
      margin-left: 10px;
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
