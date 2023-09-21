import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    isAuth: false,
    token: null,
    id: null,
    email: null,
  }),

  getters: {
    user: (state) => {
      return { id: state.id, email: state.email, token: state.token };
    },
  },

  actions: {
    saveUserInfo(id, email, token) {
      this.id = id;
      this.email = email;
      this.token = token;
      this.isAuth = true;
      if (process.client)
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ id: id, email: email, token: token })
        );
    },
  },
});
