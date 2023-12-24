<template>
  <div class="signin-modal">
    <div class="container">
      <div class="columns is-vcentered">
        <div class="column is-4"></div>
        <div class="column is-4"></div>
        <div class="column is-3">
          <h4 class="title is-4 has-text-centered">
            {{ $t("pages.signup.title") }}
          </h4>
          <EInput
            v-model:value="email"
            :label="$t('pages.signup.emailLabel')"
            name="email"
          />
          <div class="password">
            <div class="input-field field">
              <label class="label">{{
                $t("pages.signup.passwordLabel")
              }}</label>
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
          <div class="password">
            <div class="input-field field">
              <label class="label">{{ $t("pages.signup.confirmLabel") }}</label>
              <div class="control">
                <input
                  v-model="confirm_password"
                  class="input"
                  name="confirm_password"
                  :type="isShowConfirmPassword ? 'text' : 'password'"
                />
                <span
                  class="icon"
                  @click="isShowConfirmPassword = !isShowConfirmPassword"
                >
                  <i
                    :class="[
                      'fa',
                      isShowConfirmPassword ? 'fa-eye' : 'fa-eye-slash',
                    ]"
                  ></i>
                </span>
              </div>
            </div>
          </div>
          <div class="buttons">
            <button class="button email" :disabled="isLoading" @click="signup">
              <span class="icon">
                <i class="fa fa-unlock"></i>
              </span>
              <span>{{ $t("pages.signup.createButton") }}</span>
              <div v-if="isLoading" class="loader is-loading"></div>
            </button>
            <button class="button discord" @click="signInWithOAuth">
              <span class="icon">
                <i class="fa-brands fa-discord"></i>
              </span>
              <span>{{ $t("pages.signup.discordLabel") }}</span>
            </button>
          </div>
          <span class="signup-link">
            {{ $t("pages.signup.alreadyLabel") }}
            <nuxt-link :to="{ path: `/signin` }">{{
              $t("pages.signup.signinButton")
            }}</nuxt-link>
          </span>
        </div>
      </div>
    </div>
    <div
      :class="[
        'notification',
        'for-signup',
        isShowNotification ? 'is-active' : '',
      ]"
    >
      <button class="delete" @click="isShowNotification = false"></button>
      {{ notificationText }}
    </div>
  </div>
</template>

<script lang="ts">
import EInput from "@/components/form/EInput.vue";

definePageMeta({
  layout: "empty",
});

export default defineComponent({
  name: "SignUp",
  components: { EInput },
  data: () => {
    return {
      isShowSignInModal: false,
      email: "",
      password: "",
      confirm_password: "",
      isShowNotification: false,
      notificationText: "",
      isLoading: false,
      isShowPassword: false,
      isShowConfirmPassword: false,
      supabase: useSupabaseClient(),
      user: useSupabaseUser(),
      passwordRegExp: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    };
  },
  computed: {},
  methods: {
    closeNotification() {
      setTimeout(() => (this.isShowNotification = false), 3000);
    },
    async signup() {
      if (!this.passwordRegExp.test(this.password)) {
        this.isShowNotification = true;
        this.notificationText = this.$t(
          "pages.signup.invalidPasswordNotification"
        );
        this.closeNotification();
        return;
      }
      if (!/^[^@]+@\w+(\.\w+)+\w$/.test(this.email)) {
        this.isShowNotification = true;
        this.notificationText = this.$t(
          "pages.signup.invalidEmailNotification"
        );
        this.closeNotification();
        return;
      }

      if (this.password !== this.confirm_password) {
        this.isShowNotification = true;
        this.notificationText = this.$t(
          "pages.signup.invalidConfirmPasswordNotification"
        );
        this.closeNotification();
        return;
      }

      this.isLoading = true;
      const baseURL = this.$config.public.baseURL;
      const signUpResponse = await fetch(`${baseURL}/api/auth/signUp`, {
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
      if (signUpResponse.status !== 200) {
        const data = await signUpResponse.json();
        this.isShowNotification = true;
        this.notificationText = data.error.message;
        this.closeNotification();
      }
      await this.supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });
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
    margin-top: 10px;
    width: calc(50% - 5px);

    &:hover {
      background: #273038;
    }

    .loader {
      margin-left: 10px;
    }

    &.discord {
      background: #273038;

      &:hover {
        background: #f7b452;
      }
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

.signup-link {
  a {
    color: #f7b452;
  }
}
</style>
