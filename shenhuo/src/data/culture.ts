export interface CultureItem {
  id: string;
  title: string;
  icon: string;
  dotColor: string;
  content: string;
}

export const cultureItems: CultureItem[] = [
  {
    id: "festivals",
    title: "节日与神话",
    icon: "节",
    dotColor: "var(--gold)",
    content:
      "中国的每一个传统节日背后几乎都有一个神话故事。春节赶年兽、清明祭祖、端午赛龙舟、七夕鹊桥、中秋赏月——这些流传千年的习俗，都是神话在现代生活中的延续。了解这些故事，让孩子过节时更有仪式感。",
  },
  {
    id: "folklore",
    title: "民俗溯源",
    icon: "俗",
    dotColor: "var(--cinnabar)",
    content:
      "从剪纸到糖画，从龙舟到舞狮，中国丰富的民间艺术形式都源于神话传说。门神是驱邪的，灶王爷保灶台的，财神管财运——这些民间信仰的背后，都有一个神话原型。",
  },
  {
    id: "symbolism",
    title: "象征与寓意",
    icon: "寓",
    dotColor: "var(--jade)",
    content:
      "龙是中华文明的象征，凤代表祥瑞，莲花象征高洁，松柏代表坚韧。这些符号遍布建筑、服饰和日常生活中，每个背后都有一段神话传说。",
  },
  {
    id: "geography",
    title: "地理与传说",
    icon: "地",
    dotColor: "var(--mountain-mid)",
    content:
      "昆仑山、蓬莱仙岛、不周山、桃花源——中国大地上的许多山川都有对应的神话传说。三山五岳、四海八荒，每处山水都有一段传奇。",
  },
];
