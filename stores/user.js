import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    isAuth: false,
    token: "",
    userInfo: {},
  }),

  getters: {
    user: (state) => state.userInfo,
  },

  actions: {
    updateInfo(user, token) {
      this.userInfo = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      };
      this.isAuth = true;
    },
    setToken(token) {
      this.token = token;
      if (process.client) localStorage.setItem("token", token);
    },
  },
});
