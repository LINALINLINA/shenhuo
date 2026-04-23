import type { Place } from "./types";

export const places: Place[] = [
  {
    name: "昆仑山",
    realm: "heaven",
    pos: { left: "15%", top: "20%" },
    desc: "万山之祖，西王母居所。传说中连接天地的神山，是天界在人间的根基。",
  },
  {
    name: "天庭",
    realm: "heaven",
    pos: { left: "45%", top: "8%" },
    desc: "玉皇大帝统领众仙的宫殿所在，凌霄宝殿庄严辉煌，各路星君在此办公。",
  },
  {
    name: "瑶池",
    realm: "heaven",
    pos: { left: "72%", top: "15%" },
    desc: "西王母的居所，每逢蟠桃成熟便举办蟠桃盛会，邀各路神仙前来。",
  },
  {
    name: "蓬莱仙岛",
    realm: "sea",
    pos: { left: "85%", top: "45%" },
    desc: "东海之上的仙山，八仙过海的目的地，常年云雾缭绕，仙气飘飘。",
  },
  {
    name: "东胜神洲",
    realm: "mortal",
    pos: { left: "10%", top: "52%" },
    desc: "四大部洲之一，傲来国花果山所在，仙石孕育了齐天大圣孙悟空。",
  },
  {
    name: "不周山",
    realm: "mortal",
    pos: { left: "35%", top: "40%" },
    desc: "曾经的撑天柱子，被共工怒撞而断，导致天塌地陷，引出女娲补天的故事。",
  },
  {
    name: "东海之滨",
    realm: "sea",
    pos: { left: "55%", top: "55%" },
    desc: "哪吒闹海之地，也是精卫填海之处。东海龙王敖广的水晶宫在此。",
  },
  {
    name: "龙宫",
    realm: "sea",
    pos: { left: "68%", top: "68%" },
    desc: "四海龙王居所，以珊瑚珍珠建造。东海龙宫最为宏大壮丽。",
  },
  {
    name: "丰都鬼城",
    realm: "underworld",
    pos: { left: "25%", top: "80%" },
    desc: "冥界入口，十殿阎罗在此审判亡魂，十八层地狱关押恶灵。",
  },
  {
    name: "忘川河",
    realm: "underworld",
    pos: { left: "50%", top: "85%" },
    desc: "冥界之河，亡魂须经奈何桥渡过，饮一碗孟婆汤，忘记前世记忆。",
  },
  {
    name: "六道轮回",
    realm: "underworld",
    pos: { left: "78%", top: "82%" },
    desc: "天道、人道、阿修罗道、畜生道、饿鬼道、地狱道——众生轮回的规则。",
  },
];

export function getAllPlaces(): Place[] {
  return places;
}

export function getPlaceByName(name: string): Place | undefined {
  return places.find((p) => p.name === name);
}
