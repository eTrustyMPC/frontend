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
    selectedRole: false,
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
        selectedRole: state.selectedRole,
        isAuth: state.isAuth,
      };
    },
  },

  actions: {
    setSelectedRole(flag) {
      this.selectedRole = flag;
      localStorage.setItem(`selectedRole${this.id}`, flag);
    },
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
      this.selectedRole =
        JSON.parse(localStorage.getItem(`selectedRole${id}`)) ?? false;
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
