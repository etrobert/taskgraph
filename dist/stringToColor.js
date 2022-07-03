function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return hash;
}
function stringToColor(str) {
  const hash = djb2(str);
  const r = (hash & 16711680) >> 16;
  const g = (hash & 65280) >> 8;
  const b = hash & 255;
  return "#" + ("0" + r.toString(16)).substr(-2) + ("0" + g.toString(16)).substr(-2) + ("0" + b.toString(16)).substr(-2);
}
export default stringToColor;
