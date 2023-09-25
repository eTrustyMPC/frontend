import { useUserStore } from "@/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return;
  const store = useUserStore();
  const route = useRoute();

  const localStorageInfo = localStorage.getItem("userInfo");

  if (to.path !== "/signin" && !localStorageInfo) return navigateTo("/signin");

  const userInfo = JSON.parse(localStorageInfo);
  if (userInfo)
    store.saveUserInfo(
      userInfo.id,
      userInfo.email,
      userInfo.token,
      userInfo.role,
      userInfo.syncTxId,
      userInfo.createdAt
    );

  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VyX2VtYWlsIjoibmlraXRhQGV0cnVzdHkuaW8iLCJleHAiOjE2OTA3OTUyODd9.Dulq3a6ewWq5YpZK9lKqaDu142_DH5lRGekUFypShII"
  const token = store.token;
  const config = useRuntimeConfig();
  const baseURL = config.public.baseURL;
  const tenderRequest = await fetch(`${baseURL}/api/tender/findFirst`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (to.path !== "/signin" && tenderRequest.status !== 200) {
    return navigateTo("/signin");
  }
});
