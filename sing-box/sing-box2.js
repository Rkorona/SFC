const { type, name } = $arguments;
const compatible_outbound = {
  tag: "COMPATIBLE",
  type: "direct",
};

let config = JSON.parse($files[0]);
let proxies = await produceArtifact({
  name: "测试",
  type: "collection", // subscription/condition
  platform: "sing-box",
  produceType: "internal",
});
config.outbounds.push(...proxies);

function getTags(proxies, regex) {
  return proxies.filter((p) => regex.test(p.tag)).map((p) => p.tag);
}

const regexOther = /🇨🇳|镇江|徐州|武汉|济南|🇭🇰|香港|direct|HongKong|Hong Kong|🇼🇸|台湾|Taiwan|🇯🇵|日本|东京|Japan|🇸🇬|新加坡|Singapore|🇺🇲|美国|America|United States|🇰🇷|韩国|Korea/i;
const regexHongKong = /🇭🇰|香港|HongKong|Hong Kong/i;
const regexTaiwan = /🇼🇸|台湾|Taiwan/i;
const regexJapan = /🇯🇵|日本|东京|Japan/i;
const regexSingapore = /🇸🇬|新加坡|Singapore/i;
const regexKorea = /🇰🇷|韩国|Korea/i;
const regexUSA = /🇺🇲|美国|America|United States/i;
const regexChina = /🇨🇳|徐州|武汉|镇江|济南/i;

const tagMap = {
  "其它": (proxies) => proxies.filter((p) => !regexOther.test(p.tag)).map((p) => p.tag),
  "香港": (proxies) => getTags(proxies, regexHongKong),
  "香港-自动选择": (proxies) => getTags(proxies, regexHongKong),
  "台湾": (proxies) => getTags(proxies, regexTaiwan),
  "台湾-自动选择": (proxies) => getTags(proxies, regexTaiwan),
  "日本": (proxies) => getTags(proxies, regexJapan),
  "日本-自动选择": (proxies) => getTags(proxies, regexJapan),
  "新加坡": (proxies) => getTags(proxies, regexSingapore),
  "新加坡-自动选择": (proxies) => getTags(proxies, regexSingapore),
  "韩国": (proxies) => getTags(proxies, regexKorea),
  "韩国-自动选择": (proxies) => getTags(proxies, regexKorea),
  "美国": (proxies) => getTags(proxies, regexUSA),
  "美国-自动选择": (proxies) => getTags(proxies, regexUSA),
  "中国": (proxies) => getTags(proxies, regexChina),
};

config.outbounds.forEach((outbound) => {
  if (tagMap[outbound.tag]) {
    outbound.outbounds.push(...tagMap[outbound.tag](proxies));
  }
});

$content = JSON.stringify(config, null, 2);