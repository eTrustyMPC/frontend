export function serializeObject(obj: object) {
  let objStr = JSON.stringify(obj);
  objStr = objStr.replace(/\{/g, encodeURIComponent("{"));
  objStr = objStr.replace(/}/g, encodeURIComponent("}"));
  objStr = objStr.replace(/:/g, encodeURIComponent(":"));
  return objStr;
}
