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
            <EInput
              v-model:value="password"
              label="Password"
              name="password"
              field-type="password"
            />
          </div>
          <!-- <ESelect
            :values="{
              buyer: 'Buyer',
              supplier: 'Supplier',
              auditor: 'Auditor',
            }"
            name="user_type"
            label="Person type"
          /> -->
          <!-- <ECheckbox label="I agree with ..." /> -->
          <button class="button" @click="signin">Submit</button>
          <!-- <a href="#" class="signin-link">Sign In</a> -->
        </div>
      </div>
    </div>
    <div
      :class="['notification is-info', isShowNotification ? 'is-active' : '']"
    >
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
      password: "string",
      isShowNotification: false,
      notificationText: "",
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

      const baseURL = this.$config.public.baseURL;
      const authReq = await fetch(`${baseURL}/api/v1/users/signin`, {
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

      if (authReq.status !== 200) {
        this.isShowNotification = true;
        this.notificationText = "Authentication error: Wrong email or password";
        this.closeNotification();
        return;
      }

      const data = await authReq.json();
      const store = useUserStore();
      store.setToken(data.data);
      // store.updateInfo({}, )
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

  .notification {
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 100;
    transform: translateX(120%);
    transition: all 0.5s ease-in-out;
    background-color: #546b64;

    &.is-active {
      -webkit-transform: translateX(0%);
      -moz-transform: translateX(0%);
      transform: translateX(0%);
      -webkit-transition: all 0.5s ease-in-out;
      -moz-transition: all 0.5s ease-in-out;
      transition: all 0.5s ease-in-out;
    }
  }
}
</style>
