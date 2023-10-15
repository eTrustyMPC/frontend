import moment from "moment";

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

export function getExpiredDaysText(tender) {
  const finishAt = moment(tender.finishAt).set("hour", 23).set("minute", 59);
  const now = moment();
  const days = finishAt.diff(now, "days");
  if (isNaN(days) || (days <= 0 && now.date() !== finishAt.date())) return;
  if (days === 0) return "CLOSING TODAY";
  if (days === 1) return "1 DAY TO GO";
  return `${days} DAYS TO GO`;
}
