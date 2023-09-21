export function subHash(hash: string) {
  return hash.substr(0, 4) + "..." + hash.substr(-3);
}

export async function getUserByExternalId(externalId: string, token: string) {
  const config = useRuntimeConfig();
  const baseURL = config.public.baseURL;
  const query = JSON.stringify({
    where: {
      uuid: {
        equals: externalId,
      },
    },
  });
  const { data: user } = await useFetch(
    () => `${baseURL}/api/user/findFirst?q=${query}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return user.value.data.id;
}
