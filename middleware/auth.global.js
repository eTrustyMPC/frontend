import { useUserStore } from "@/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return;
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();
  const store = useUserStore();
  const route = useRoute();

  if (to.path === "/signup") return;
  if (to.path !== "/signin" && !user.value) return navigateTo("/signin");

  if (!user.value) return;

  const token = supabase.auth.headers.Authorization.replace("Bearer ", "");

  const config = useRuntimeConfig();
  const baseURL = config.public.baseURL;
  const userQuery = JSON.stringify({ where: { uuid: user.value.id } });
  const response = await fetch(`${baseURL}/api/user/findFirst`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const userInfo = (await response.json()).data;

  if (to.path !== "/signin" && response.status !== 200) {
    return navigateTo("/signin");
  }

  store.saveUserInfo(
    userInfo.id,
    user.value.email,
    token,
    userInfo.role,
    userInfo.syncTxId,
    user.value.created_at
  );
});
