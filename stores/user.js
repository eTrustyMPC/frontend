import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    isAuth: false,
    token: null,
    id: null,
    email: null,
    role: null,
  }),

  getters: {
    user: (state) => {
      return {
        id: state.id,
        email: state.email,
        token: state.token,
        role: state.role,
      };
    },
  },

  actions: {
    saveUserInfo(id, email, token, role) {
      this.id = id;
      this.email = email;
      this.token = token;
      this.role = role;
      this.isAuth = true;
      if (process.client)
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ id: id, email: email, token: token, role: role })
        );
    },
  },
});
