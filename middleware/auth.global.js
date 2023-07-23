import { useUserStore } from "@/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // const store = useUserStore();
  // if (process.client) {
  //   store.setToken(localStorage.getItem("token"));
  // }
  // // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VyX2VtYWlsIjoibmlraXRhQGV0cnVzdHkuaW8iLCJleHAiOjE2OTA3OTUyODd9.Dulq3a6ewWq5YpZK9lKqaDu142_DH5lRGekUFypShII"
  // const token = store.token;
  // const config = useRuntimeConfig();
  // const baseURL = config.public.baseURL;
  // const userRequest = await fetch(`${baseURL}/api/v1/users/me`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // });
  // if (userRequest.status == 200) {
  //   const json = await userRequest.json();
  //   store.updateInfo(json.data);
  // }
});
