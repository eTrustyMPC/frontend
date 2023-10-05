import { defineStore } from "pinia";
import moment from "moment";

export const useUserStore = defineStore("user", {
  state: () => ({
    isAuth: false,
    token: null,
    id: null,
    email: null,
    role: null,
    syncTxId: null,
    createdAt: null,
  }),

  getters: {
    user: (state) => {
      return {
        id: state.id,
        email: state.email,
        token: state.token,
        role: state.role,
        syncTxId: state.syncTxId,
        createdAt: state.createdAt,
        isAuth: state.isAuth,
      };
    },
  },

  actions: {
    setRole(role) {
      this.role = role;
    },
    saveUserInfo(id, email, token, role, syncTxId, createdAt) {
      this.id = id;
      this.email = email;
      this.token = token;
      this.role = role;
      this.syncTxId = syncTxId;
      this.createdAt = moment(new Date(createdAt)).format("YYYY-MM-DD HH:mm");
      this.isAuth = true;
      if (process.client)
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            id: id,
            email: email,
            token: token,
            role: role,
            syncTxId: syncTxId,
            createdAt: createdAt,
          })
        );
    },
  },
});
