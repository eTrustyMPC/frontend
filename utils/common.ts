export function subHash(hash: string) {
  return hash.substr(0, 4) + "..." + hash.substr(-3);
}
